import { ConflictException, Injectable } from '@nestjs/common';
import {
  properties,
  annualTargetBudgets,
  units,
  coOwners,
  unitCoOwners,
  type OnboardingPayload,
} from '@syndic-pro/db';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SyndicOnboardingService {
  constructor(private readonly database: DatabaseService) {}

  async createFromOnboarding(payload: OnboardingPayload, userId: string) {
    return this.database.db.transaction(async (tx) => {
      // 1. Property
      const [property] = await tx
        .insert(properties)
        .values({
          name: payload.property.name,
          address: payload.property.address,
          city: payload.property.city,
        })
        .returning();

      if (!property) {
        throw new ConflictException('Failed to create property');
      }

      // 2. Annual target budget (fiscal year)
      await tx.insert(annualTargetBudgets).values({
        propertyId: property.id,
        startDate: payload.fiscalYear.startDate,
        endDate: payload.fiscalYear.endDate,
        totalBudget: payload.fiscalYear.totalBudget,
        status: payload.fiscalYear.lockBudget ? 'locked' : 'unlocked',
        createdByUserId: userId,
      });

      // 3. Units — insert all, keep a clientId -> real id map
      const unitClientIdToId = new Map<string, number>();

      for (const unit of payload.units) {
        const [inserted] = await tx
          .insert(units)
          .values({
            propertyId: property.id,
            unitLabel: unit.unitLabel,
            floor: unit.floor,
            type: unit.type,
            weightCoefficient: unit.weightCoefficient,
          })
          .returning();

        if (!inserted) {
          throw new ConflictException(
            `Failed to create unit "${unit.unitLabel}"`,
          );
        }

        unitClientIdToId.set(unit.clientId, inserted.id);
      }

      // 4. Co-owners + the unit_co_owners join row (with billingFrequency,
      //    isDesignatedSyndic) for each
      let designatedSyndicUserContext: {
        coOwnerId: number;
      } | null = null;

      for (const co of payload.coOwners) {
        const unitId = unitClientIdToId.get(co.unitClientId);
        if (!unitId) {
          // Should be unreachable — Zod already validated this — but a
          // transaction is not the place to trust that blindly.
          throw new ConflictException(
            `unitClientId "${co.unitClientId}" did not resolve to a unit`,
          );
        }

        const [coOwner] = await tx
          .insert(coOwners)
          .values({
            name: co.name,
            email: co.email,
            phone: co.phone,
          })
          .returning();

        if (!coOwner) {
          throw new ConflictException(`Failed to create co-owner "${co.name}"`);
        }

        await tx.insert(unitCoOwners).values({
          unitId,
          coOwnerId: coOwner.id,
          ownershipPercentage: co.ownershipPercentage,
          billingFrequency: co.billingFrequency,
          isDesignatedSyndic: co.designatedSyndic,
        });

        if (co.designatedSyndic) {
          designatedSyndicUserContext = { coOwnerId: coOwner.id };
        }
      }

      // 5. syndicDesignations expects a userId (from `user`), not a
      //    coOwnerId — co-owners aren't necessarily platform users yet.
      //    Skip this insert until the co-owner accepts an invitation and
      //    gets a real userId; flag it back to the caller instead of
      //    silently doing nothing.
      const pendingSyndicAssignment = designatedSyndicUserContext !== null;

      return {
        property,
        unitCount: payload.units.length,
        coOwnerCount: payload.coOwners.length,
        pendingSyndicAssignment,
      };
    });
  }
}
