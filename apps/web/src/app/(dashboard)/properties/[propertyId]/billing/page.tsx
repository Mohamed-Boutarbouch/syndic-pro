import { BillingCards } from '@/components/billing/billing-cards';
import { CoOwnerPayments } from '@/components/billing/co-owner-payments';

export default async function BillingPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <BillingCards />
      <div className="px-4 lg:px-6">
        <CoOwnerPayments />
      </div>
    </div>
  );
}
