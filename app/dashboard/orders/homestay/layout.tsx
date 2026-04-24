import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt phòng Homestay",
  description:
    "Đặt phòng homestay giá rẻ trên GiaReViet. Homestay đẹp, giá tốt tại Đà Lạt, Phú Quốc, Hội An và nhiều nơi khác.",
};

export default function HomestayOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
