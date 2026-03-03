"use client";
import Label from "@/app/ui/label";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";

type Props = {
  name: string;
  label?: {
    text?: string;
    icon?: React.ReactNode;
  };
  helperText?: string;
  placeholder?: string;
};

export function RHFDatePicker({ name, label }: Props) {
  const { control, clearErrors } = useFormContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const monthName = `Tháng ${month + 1}, ${year}`;

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

  // Click outside đóng calendar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedDate = field.value ? new Date(field.value) : null;

        const renderDays = () => {
          const days = [];

          for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} />);
          }

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);

            const isPast = date < today;
            const isSelected =
              selectedDate &&
              date.toDateString() === new Date(selectedDate).toDateString();

            days.push(
              <div
                key={day}
                onClick={() => {
                  if (isPast) return;
                  field.onChange(date);
                  clearErrors(name);
                  setOpen(false);
                }}
                className={`
                    text-center py-2 rounded-lg text-sm transition
                    ${
                      isPast
                        ? "text-gray-300 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-100"
                    }
                    ${isSelected ? "bg-blue-500 text-white font-semibold" : ""}
                  `}
              >
                {day}
              </div>
            );
          }

          return days;
        };

        return (
          <div className="flex flex-col gap-1 w-full" ref={ref}>
            <div className="relative w-full">
              {label && (
                <div className="flex gap-1">
                  <Label className="text-sm text-gray-500">{label.text}</Label>
                  <span className="text-red-400">{label.icon}</span>
                </div>
              )}

              <div
                onClick={() => setOpen(!open)}
                className={`w-full border rounded-xl p-3 flex items-center gap-2 cursor-pointer border-gray-300 bg-white ${
                  error ? "border-red-500" : ""
                }`}
              >
                <Calendar size={18} />

                {selectedDate ? (
                  <span>{formatDate(selectedDate)}</span>
                ) : (
                  <span className="text-gray-400">Chọn ngày</span>
                )}
              </div>

              {open && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={goPrevMonth}>
                      <ChevronLeft />
                    </button>

                    <h2 className="font-semibold">{monthName}</h2>

                    <button onClick={goNextMonth}>
                      <ChevronRight />
                    </button>
                  </div>

                  {/* Week days */}
                  <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className={day === "CN" ? "text-red-500" : ""}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days */}
                  <div className="grid grid-cols-7 gap-y-2">{renderDays()}</div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                {error.message}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
