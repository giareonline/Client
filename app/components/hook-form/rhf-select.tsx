"use client";
import { Options } from "@/app/types/types";
import Label from "@/app/ui/label";
import { Select } from "@/app/ui/select";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type Props = InputProps & {
  name: string;
  label?: {
    text?: string;
    icon?: React.ReactNode;
  };
  options: Options[];
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
  placeholder?: string;
};

export function RHFSelect({
  name,
  label,
  options,
  InputProps,
  placeholder = "-- Chọn --",
}: Props) {
  const { control, clearErrors } = useFormContext();
  const { errors } = useFormState({ name });

  const error = errors[name];

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearErrors(name);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearErrors, name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          {label && (
            <div className="flex gap-1">
              <Label className="text-sm text-gray-500">{label.text}</Label>
              <span className="text-red-400">{label.icon}</span>
            </div>
          )}

          <Select
            value={field.value}
            onChange={field.onChange}
            label={label}
            options={options}
            InputProps={InputProps}
            placeholder={placeholder}
            error={!!fieldState.error}
          />
          {fieldState.error && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                  {fieldState.error.message}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    />
  );
}
