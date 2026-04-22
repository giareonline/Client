"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Star, CreditCard, Package, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountDropdown({
  user,
  setUser,
}: {
  user: any;
  setUser: (u: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    window.location.href = "/";
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

  const menuItems = [
    {
      href: "/dashboard/portfolio",
      icon: <User size={15} />,
      label: "Thông tin tài khoản",
      color: "text-[#64748B]",
    },
    {
      href: "/dashboard/deposit",
      icon: <CreditCard size={15} />,
      label: "Nạp sao",
      color: "text-[#FF6B35]",
      bold: true,
    },
    {
      href: "/dashboard/orders",
      icon: <Package size={15} />,
      label: "Quản lý đơn hàng",
      color: "text-[#64748B]",
    },
  ];

  return (
    <div className="relative" ref={ref}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white px-2 py-1 rounded-xl transition-all hover:bg-white/10"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={15} className="text-white" />
          )}
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-[#1E3A5F]/10 border border-[#E2E8F0] overflow-hidden z-50"
          >
            {/* Stars Balance */}
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#92400E] font-medium">
                  Số dư Sao
                </span>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#FDE68A] shadow-sm">
                  <span className="font-bold text-sm text-[#92400E] tracking-tight">
                    {user?.stars || 0}
                  </span>
                  <Star
                    size={14}
                    className="text-[#F59E0B] fill-[#F59E0B]"
                  />
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-[#F8FAFF] transition-colors ${
                    item.bold ? "font-semibold" : "font-medium"
                  } ${item.color}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-[#E2E8F0]" />

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
