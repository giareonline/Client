import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt vé xe khách",
  description:
    "Đặt vé xe khách online giá rẻ trên GiaReViet. Chọn tuyến, chọn ngày, thanh toán nhanh chóng bằng sao.",
};

export default function BusOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
