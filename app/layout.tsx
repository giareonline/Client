import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import AuthProvider from "./components/AuthProvider";
import Providers from "./providers";
import { AlertProvider } from "./components/AlertContext";
import PageTracker from "./components/PageTracker";
import NotificationListener from "./components/NotificationListener";
import GiftEventPopup from "./components/GiftEventPopup";
import Footer from "./components/Footer";
import NextTopLoader from "nextjs-toploader";
import ZaloContact from "./components/zalo-contact";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://giareviet.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GiaReViet - Đặt vé xe & Homestay giá tốt nhất Việt Nam",
    template: "%s | GiaReViet",
  },
  description:
    "GiaReViet - Hệ thống đặt vé xe khách và homestay giá rẻ nhất Việt Nam. So sánh hàng trăm nhà xe, homestay uy tín. Thanh toán an toàn, hỗ trợ 24/7.",
  keywords: [
    "đặt vé xe",
    "vé xe khách",
    "homestay giá rẻ",
    "đặt phòng homestay",
    "GiaReViet",
    "du lịch Việt Nam",
    "vé xe giá rẻ",
    "đặt xe online",
    "homestay Đà Lạt",
    "homestay Phú Quốc",
    "homestay Hội An",
    "vé xe Sài Gòn",
    "vé xe Hà Nội",
  ],
  authors: [{ name: "GiaReViet", url: SITE_URL }],
  creator: "GiaReViet",
  publisher: "GiaReViet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "GiaReViet",
    title: "GiaReViet - Đặt vé xe & Homestay giá tốt nhất Việt Nam",
    description:
      "Tìm kiếm và đặt vé xe khách, homestay với giá tốt nhất. So sánh hàng trăm nhà xe, homestay uy tín trên toàn quốc.",
    images: [
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "GiaReViet Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GiaReViet - Đặt vé xe & Homestay giá tốt nhất Việt Nam",
    description:
      "Tìm kiếm và đặt vé xe khách, homestay với giá tốt nhất Việt Nam.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // google: "YOUR_GOOGLE_VERIFICATION_CODE", // Thêm sau khi đăng ký Google Search Console
  },
  category: "travel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} bg-[#F8FAFF]`}>
        <NextTopLoader
          color="#D8111F"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #D8111F,0 0 5px #D8111F"
          zIndex={1600}
        />
        <Providers>
          <PageTracker />
          <AlertProvider>
            <NotificationListener />
            <AuthProvider>
              {children}
              <Footer />
            </AuthProvider>
          </AlertProvider>
          <GiftEventPopup />
          <ZaloContact />
        </Providers>
      </body>
    </html>
  );
}
