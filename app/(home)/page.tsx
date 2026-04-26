import type { Metadata, ResolvingMetadata } from "next";
import HomeClient from "./home-client";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await searchParams to support both Next.js 14 and 15+
  const searchParams = await props.searchParams;
  const serviceType = searchParams.serviceType || "bus";
  const propertyLocation = searchParams.propertyLocation as string;

  let title = "GiaReViet - Đặt vé xe & Homestay giá tốt nhất Việt Nam";
  let description = "GiaReViet - Hệ thống đặt vé xe khách và homestay giá rẻ nhất Việt Nam. So sánh hàng trăm nhà xe, homestay uy tín. Thanh toán an toàn, hỗ trợ 24/7.";

  if (propertyLocation) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiUrl}/provinces`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const json = await res.json();
        const provinces = json.data || [];
        const p = provinces.find((prov: any) => 
          (prov.spid && prov.spid.toString() === propertyLocation) || 
          (prov.pusn === propertyLocation)
        );
        
        if (p) {
          const isProvinceOnly = !p.spn || p.spn === p.pn;
          const locationName = isProvinceOnly ? p.pn : `${p.spn}, ${p.pn}`;
          
          if (serviceType === "homestay") {
            title = `Homestay ở ${locationName}`;
            description = `Danh sách các homestay, villa tốt nhất ở ${locationName}. Đặt phòng giá rẻ, không phí ẩn tại GiaReViet.`;
          } else {
            title = `Vé xe khách đi ${locationName}`;
            description = `Đặt vé xe khách đi ${locationName} giá rẻ nhất. So sánh hàng trăm nhà xe uy tín tại GiaReViet.`;
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch provinces for metadata", e);
    }
  }

  return {
    title,
    description,
    keywords: [
       "giare", "giave", "giaviet", "giaveonline", "giareonline",
       propertyLocation ? `homestay ${propertyLocation}` : "", 
       propertyLocation ? `vé xe ${propertyLocation}` : ""
    ].filter(Boolean) as string[]
  };
}

export default function Page() {
  return <HomeClient />;
}
