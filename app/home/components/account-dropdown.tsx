"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import Link from "next/link";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click outside đóng menu
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
    <div className="relative" ref={ref}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2  text-white px-3 py-1 rounded-full transition"
      >
        <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
          <User size={16} />
        </div>
        <ChevronDown size={16} />
      </button>


      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-md 
       rounded-2xl shadow-xl border border-gray-100 
       overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <Link
            href="/dashboard/portfolio"
            className="flex items-center gap-3 px-5 py-3 text-sm 
         text-gray-700 hover:bg-gray-50 
         transition-all duration-200"
          >
            Thông tin tài khoản
          </Link>

          <Link
            href="/dashboard/orders"
            className="flex items-center gap-3 px-5 py-3 text-sm 
         text-gray-700 hover:bg-gray-50 
         transition-all duration-200"
          >
            Quản lý đơn hàng
          </Link>

          <div className="border-t border-gray-100" />

          <button
            className="w-full flex items-center gap-3 px-5 py-3 text-sm 
         text-red-500 hover:bg-red-50 
         transition-all duration-200"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
