import AdsColumn from "../components/AdsColumn";
import Header from "../components/header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />

      <div className=" max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_250px] gap-6">
          {/* Left Ads Desktop */}
          <AdsColumn side="left" />

          {/* Main */}
          <main className="min-h-screen">{children}</main>

          {/* Right Ads Desktop */}
          <AdsColumn side="right" />
        </div>
      </div>
    </div>
  );
}
