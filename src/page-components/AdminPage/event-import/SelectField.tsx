"use client";

import React from "react";

interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

interface SelectFieldProps<T extends string | number> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

export default function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className = "",
}: SelectFieldProps<T>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as T)}
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          bg-white
          px-4
          py-2.5
          text-sm
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
          disabled:cursor-not-allowed
          disabled:bg-gray-100
        "
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
