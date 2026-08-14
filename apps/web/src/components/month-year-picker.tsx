'use client';

import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const MONTH_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

type MonthYearPickerProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
  'aria-invalid'?: boolean;
};

export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Select month and year',
  minYear = 2025,
  maxYear = 2035,
  'aria-invalid': ariaInvalid,
}: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined;

  const selectedYear = selectedDate?.getFullYear();
  const selectedMonth = selectedDate?.getMonth();

  const [viewYear, setViewYear] = useState(
    selectedYear ?? new Date().getFullYear(),
  );

  function openChange(next: boolean) {
    if (next) {
      setViewYear(selectedYear ?? new Date().getFullYear());
    }

    setOpen(next);
  }

  function pickMonth(monthIndex: number) {
    const month = String(monthIndex + 1).padStart(2, '0');

    onChange(`${viewYear}-${month}-01`);
    setOpen(false);
  }

  const label =
    selectedYear !== undefined && selectedMonth !== undefined
      ? `${MONTH_FULL[selectedMonth]} ${selectedYear}`
      : placeholder;

  const atMin = viewYear <= minYear;
  const atMax = viewYear >= maxYear;

  return (
    <Popover open={open} onOpenChange={openChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
            aria-invalid={ariaInvalid}
          >
            <span className={cn(!value && 'text-muted-foreground')}>
              {label}
            </span>

            <CalendarDays className="size-4 opacity-50" />
          </Button>
        }
      />

      <PopoverContent className="w-64 p-3" align="start">
        <div className="flex items-center justify-between pb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={atMin}
            onClick={() => setViewYear((year) => Math.max(minYear, year - 1))}
            aria-label="Previous year"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <span className="text-sm font-medium tabular-nums">{viewYear}</span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={atMax}
            onClick={() => setViewYear((year) => Math.min(maxYear, year + 1))}
            aria-label="Next year"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {MONTH_FULL.map((month, index) => {
            const isSelected =
              selectedYear === viewYear && selectedMonth === index;

            return (
              <Button
                key={month}
                type="button"
                variant={isSelected ? 'default' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => pickMonth(index)}
              >
                {MONTHS[index]}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
