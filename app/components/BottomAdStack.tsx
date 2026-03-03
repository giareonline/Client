"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

import { X } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";

const images = [
  "/quang-cao-mobile.png",
  "/quang-cao-mobile.png",
  "/quang-cao-mobile.png",
  "/quang-cao-mobile.png",
  "/quang-cao-mobile.png",
  "/quang-cao-mobile.png",
  "/quang-cao-mobile.png",
  "/quang-cao-mobile.png",
];

export default function BottomAdsSwiper() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
    
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 md:inset-x-16 z-50 shadow-lg p-2">
      
      {/* Close */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 bg-gray-200 text-black rounded-full p-1 z-30"
      >
        <X size={16} />
      </button>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={4}
        slidesPerView={1}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Quảng cáo ${i + 1}`}
              className="w-full h-24 object-cover rounded-md"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}