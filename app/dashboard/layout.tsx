import type { Metadata } from "next";
import Header from "../components/header";
import { MobileBottomNav } from "./components/mobile-bottom-nav";
import Sidebar from "./components/sidebar";

export const metadata: Metadata = {
  title: "Tài khoản",
  description:
    "Quản lý tài khoản GiaReViet của bạn. Xem đơn hàng, nạp tiền, quản lý thông tin cá nhân.",
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0 mb-12 md:mb-0 md:p-8">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
