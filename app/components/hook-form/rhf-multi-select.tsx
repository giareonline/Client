"use client";

import Label from "@/app/ui/label";
import { MultiSelect, Option } from "@/app/ui/multi-select";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: {
    text?: string;
    icon?: React.ReactNode;
  };
  options: Option[];
  placeholder?: string;
};

export function RHFMultiSelect({ name, label, options, placeholder }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1 w-full">
          {label && (
            <div className="flex gap-1">
              <Label className="text-sm text-gray-500">{label.text}</Label>
              <span className="text-red-400">{label.icon}</span>
            </div>
          )}

          <MultiSelect
            value={field.value}
            onChange={field.onChange}
            options={options}
            placeholder={placeholder}
            error={!!fieldState.error}
          />

          {fieldState.error && (
            <span className="text-red-500 text-xs">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
