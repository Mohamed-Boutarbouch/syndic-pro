import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import type { CoOwnerOption } from '@/types/properties/ledger';

type CoOwnerSelectProps = {
  value: string | null;
  onValueChange: (value: string | null) => void;
  coOwners: CoOwnerOption[];
  label?: string;
};

export function CoOwnerSelect({
  value,
  onValueChange,
  coOwners,
  label = 'Co-Owner',
}: CoOwnerSelectProps) {
  const { money, isRtl } = useTranslation();

  const dir = isRtl ? 'rtl' : 'ltr';

  return (
    <div className="space-y-2" dir={dir}>
      <p className="text-sm font-medium">{label}</p>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full" dir={dir}>
          <SelectValue placeholder="Select a co-owner" />
        </SelectTrigger>

        <SelectContent dir={dir} data-lang={isRtl ? 'ar' : undefined}>
          {coOwners.map((coOwner) => (
            <SelectItem key={coOwner.id} value={coOwner.id} className="py-2">
              <div className="flex flex-col items-start gap-0.5 text-start">
                <span className="text-sm">{coOwner.name}</span>

                <span className="text-xs text-muted-foreground">
                  Remaining quota: {money(coOwner.remainingQuota)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
