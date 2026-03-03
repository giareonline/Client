"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Input from "./input";

export type Option = {
  label: string;
  value: string | number;
};

type Props = {
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  options: Option[];
  placeholder?: string;
  error?: boolean;
};

export function MultiSelect({
  value = [],
  onChange,
  options,
  placeholder = "-- Chọn --",
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selectedValues = value;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (val: string | number) => {
    if (!onChange) return;

    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {/* INPUT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className={twMerge(
          "flex items-center flex-wrap gap-2 px-4 py-2 min-h-[48px] rounded-xl cursor-pointer border border-gray-300",
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        {selectedValues.length === 0 ? (
          <span className="text-[#b7b9c0]">{placeholder}</span>
        ) : (
          selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <div
                key={val}
                className="flex items-center gap-1 bg-green-500 text-sm text-gray-600   rounded-lg px-2 "
                onClick={(e) => e.stopPropagation()}
              >
                <span>{opt?.label}</span>
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => toggleValue(val)}
                />
              </div>
            );
          })
        )}

        <ChevronDown
          className={twMerge("ml-auto transition", open && "rotate-180")}
        />
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 z-20 mt-2 bg-white shadow-lg  rounded-xl max-h-60 overflow-auto"
          >
            <div className="sticky top-0 text-gray-400 p-2 ">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {filteredOptions.map((opt) => {
              const active = selectedValues.includes(opt.value);

              return (
                <div
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleValue(opt.value);
                  }}
                  className={twMerge(
                    "px-4 py-2 cursor-pointer",
                    active ? "bg-blue-50" : "hover:bg-blue-50"
                  )}
                >
                  {opt.label}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
