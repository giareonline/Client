import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description:
    "Xem và quản lý thông tin tài khoản cá nhân, số dư sao, lịch sử giao dịch trên GiaReViet.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
