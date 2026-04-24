import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nạp tiền",
  description:
    "Nạp sao vào tài khoản GiaReViet để thanh toán vé xe khách và homestay nhanh chóng, an toàn.",
};

export default function DepositLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
