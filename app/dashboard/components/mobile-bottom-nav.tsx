"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, CreditCard } from "lucide-react";
import { twMerge } from "tailwind-merge";

const menuItems = [
  {
    label: "Hồ sơ",
    href: "/dashboard/portfolio",
    icon: User,
  },
  {
    label: "Đơn hàng",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    label: "Nạp sao",
    href: "/dashboard/deposit",
    icon: CreditCard,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 
      bg-white border-t border-gray-200 
      shadow-[0_-5px_20px_rgba(0,0,0,0.05)] 
      md:hidden"
    >
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                "flex flex-col items-center justify-center text-xs font-medium transition-all",
                isActive ? "text-blue-600" : "text-gray-500"
              )}
            >
              <Icon size={22} />
              <span className="mt-1">{item.label}</span>

              {isActive && (
                <div className="absolute bottom-0 h-1 w-10 bg-blue-600 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
