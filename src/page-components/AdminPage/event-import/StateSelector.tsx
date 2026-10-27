"use client";

import SelectField from "./SelectField";
import { US_STATES } from "@/lib/tcdb/constants";

interface StateSelectorProps {
  value: string;
  onChange: (stateCode: string) => void;
  disabled?: boolean;
}

export default function StateSelector({
  value,
  onChange,
  disabled = false,
}: StateSelectorProps) {
  return (
    <SelectField
      label="State"
      value={value}
      options={US_STATES.map((state) => ({
        label: `${state.name} (${state.code})`,
        value: state.code,
      }))}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
