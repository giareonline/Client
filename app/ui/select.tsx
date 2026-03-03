import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Options } from "../types/types";
import Label from "./label";

type Props = {
  value?: string | number;
  onChange?: (value: string | number) => void;
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
  error?: boolean;
};

export function Select({
  label,
  options,
  value,
  onChange,
  InputProps,
  placeholder = "-- Chọn --",
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-1 w-full" ref={ref}>
      <div className="relative w-full">
       
        <div
          className={twMerge(
            "flex items-center justify-between px-4 py-3 h-12 rounded-lg cursor-pointer border bg-white",
            error ? "border-red-500" : "border-gray-300"
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-2">
            {InputProps?.startAdornment}

            {selectedOption ? (
              <span className="text-gray-800 font-medium">
                {selectedOption.label}
              </span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          <ChevronDown
            className={twMerge(
              "text-gray-500 transition-transform",
              open && "rotate-180"
            )}
          />
        </div>

        {open && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto z-50">
            {options.map((opt) => (
              <div
                key={opt.value}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
