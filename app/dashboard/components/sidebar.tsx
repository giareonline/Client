"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { User, ShoppingBag, CreditCard } from "lucide-react";

const menuItems = [
  {
    label: "Hồ sơ cá nhân",
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
