"use client";

import SelectField from "./SelectField";
import { YEARS } from "@/lib/tcdb/constants";

interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
  disabled?: boolean;
}

export default function YearSelector({
  value,
  onChange,
  disabled = false,
}: YearSelectorProps) {
  return (
    <SelectField
      label="Year"
      value={value}
      options={YEARS.map((year) => ({
        label: year.label,
        value: year.value,
      }))}
      onChange={(value) => onChange(Number(value))}
      disabled={disabled}
    />
  );
}
