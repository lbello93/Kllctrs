"use client";

import SelectField from "./SelectField";
import { MONTHS } from "@/lib/tcdb/constants";

interface MonthSelectorProps {
  value: number;
  onChange: (month: number) => void;
  disabled?: boolean;
}

export default function MonthSelector({
  value,
  onChange,
  disabled = false,
}: MonthSelectorProps) {
  return (
    <SelectField
      label="Month"
      value={value}
      options={MONTHS.map((month) => ({
        label: month.label,
        value: month.value,
      }))}
      onChange={(value) => onChange(Number(value))}
      disabled={disabled}
    />
  );
}
