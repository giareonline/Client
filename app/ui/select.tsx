import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
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
  searchable?: boolean;
};

export function Select({
  label,
  options,
  value,
  onChange,
  InputProps,
  placeholder = "-- Chọn --",
  error,
  searchable = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm("");
    }
  }, [open, searchable]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    let filtered = options;
    if (selectedOption && (selectedOption as any).province && !searchTerm) {
      filtered = filtered.filter(opt => (opt as any).province === (selectedOption as any).province);
    }
    if (searchable && searchTerm) {
      filtered = filtered.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  }, [options, searchable, searchTerm, selectedOption]);

  return (
    <div className="flex flex-col gap-1 w-full" ref={ref}>
      <div className="relative w-full">
        <div
          className={twMerge(
            "flex items-center justify-between px-4 py-3 h-12 rounded-lg cursor-pointer border bg-white",
            error ? "border-red-500" : "border-gray-300",
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
            {InputProps?.startAdornment && (
              <div className="flex-shrink-0">{InputProps.startAdornment}</div>
            )}

            {selectedOption ? (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-gray-800 font-medium truncate block w-full">
                  {selectedOption.label}
                </span>
              </div>
            ) : (
              <span className="text-gray-400 truncate block w-full">
                {placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {selectedOption && (
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.("");
                }}
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
            <ChevronDown
              className={twMerge(
                "text-gray-500 transition-transform flex-shrink-0",
                open && "rotate-180",
              )}
            />
          </div>
        </div>

        {open && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50 overflow-hidden flex flex-col">
            {searchable && (
              <div
                className="p-2 border-b border-gray-100 sticky top-0 bg-white z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300 transition-all"
                  />
                </div>
              </div>
            )}
            <div className="overflow-y-auto max-h-60">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={twMerge(
                      "px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center gap-2",
                      opt.value === value && "bg-[#F0F7FF] text-[#1E3A5F] font-medium"
                    )}
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.icon}
                    {opt.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
