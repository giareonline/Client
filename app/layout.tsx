import "./globals.css";
import { Inter } from "next/font/google";

import AuthProvider from "./components/AuthProvider";
import Providers from "./providers";
import { AlertProvider } from "./components/AlertContext";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "GiaReOnline - Đặt vé xe & Homestay giá tốt nhất",
  description:
    "Tìm kiếm và đặt vé xe khách, homestay với giá tốt nhất. So sánh hàng trăm nhà xe, homestay uy tín trên toàn quốc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} bg-[#F8FAFF]`}>
        <Providers>
          <AlertProvider>
            <AuthProvider>{children}</AuthProvider>
          </AlertProvider>
        </Providers>
      </body>
    </html>
  );
}
