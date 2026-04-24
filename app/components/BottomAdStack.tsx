"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

import { X } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { useBanners } from "../hooks/api/useBanners";

export default function BottomAdsSwiper() {
  const [visible, setVisible] = useState(true);
  const { data: allBanners } = useBanners();

  if (!visible) return null;

  // Fallback if no banners available
  const fallbackImages = [
    { _id: "f1", mobileImage: "/quang-cao-mobile.png" },
    { _id: "f2", mobileImage: "/quang-cao-mobile.png" },
  ];

  const banners = allBanners && allBanners.length > 0 ? allBanners : fallbackImages;
    
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 md:inset-x-16 z-50 shadow-lg p-2">
      
      {/* Close */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 bg-gray-200 text-black rounded-full p-1 z-30 shadow-md"
      >
        <X size={16} />
      </button>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={4}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
      >
        {banners.map((item: any, i: number) => (
          <SwiperSlide key={item._id}>
            {item.link ? (
              <a href={item.link} target="_blank" rel="noreferrer" className="block w-full">
                <img
                  src={item.mobileImage}
                  alt={`Quảng cáo ${i + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              </a>
            ) : (
              <img
                src={item.mobileImage}
                alt={`Quảng cáo ${i + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}