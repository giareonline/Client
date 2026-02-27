import Header from "./components/header";
import LeftAds from "./components/left-ads";
import RightAds from "./components/right-ads";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-100">
        <Header />

        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] xl:grid-cols-[250px_1fr_250px] gap-6">
            
            {/* Left Ads - Desktop */}
            <LeftAds />

            {/* Main Content */}
            <main className="bg-white p-6 rounded shadow min-h-screen">
              {children}
            </main>

            {/* Right Ads - Tablet + Desktop */}
            <RightAds />
          </div>
        </div>
      </body>
    </html>
  );
}