import AdsColumn from "../components/AdsColumn";
import Header from "../components/header";
import JsonLd from "../components/JsonLd";
import PromoSlider from "./components/promo-slider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />
      <JsonLd />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_250px] gap-6">
          {/* Left Ads Desktop */}
          <AdsColumn side="left" />

          {/* Main */}
          <main className="min-h-screen">{children}</main>

          {/* Right Ads Desktop */}
          <AdsColumn side="right" />
        </div>
      </div>
      <div className="mt-10">
        {" "}
        <PromoSlider />
      </div>
    </div>
  );
}
