import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type CoOwnerOption = {
  id: string;
  name: string;
  initials: string;
  remainingQuota: number;
};

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
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a co-owner" />
        </SelectTrigger>

        <SelectContent>
          {coOwners.map((coOwner) => (
            <SelectItem key={coOwner.id} value={coOwner.id} className="py-2">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm">{coOwner.name}</span>

                <span className="text-xs text-muted-foreground">
                  Remaining quota: {coOwner.remainingQuota.toLocaleString()} MAD
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
