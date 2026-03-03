"use client";
import { useFormContext, Controller, useFormState } from "react-hook-form";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/app/ui/input";
import Label from "@/app/ui/label";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type Props = InputProps & {
  name: string;
  label?: {
    text?: string;
    icon?: React.ReactNode;
  };
  disabled?: boolean;
  className?: string;
};

export function RHFTextField({
  name,
  label,
  disabled,
  className,
  ...other
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
      render={({ field, fieldState: { error } }) => (
        <div>
          {label && (
            <div className="flex gap-1">
              <Label className="text-sm text-gray-500">{label.text}</Label>
              <span className="text-red-400">{label.icon}</span>
            </div>
          )}
          <Input
            {...field}
            {...other}
            disabled={disabled}
            className={className}
          />
          {error && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                  {error.message}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    />
  );
}
