import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi",
  description:
    "Xem lịch sử và trạng thái đơn đặt vé xe khách, homestay của bạn trên GiaReViet.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
