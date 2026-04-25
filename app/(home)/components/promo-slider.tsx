"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { PhoneCall } from "lucide-react";

const slides = [
  {
    id: 1,
    title1: "MỪNG ĐẠI LỄ 30/04",
    title2: "ƯU ĐÃI THẢ GA",
    title2Color: "text-[#FF6B00]",
    desc: "Tận hưởng kỳ nghỉ lễ trọn vẹn với hàng ngàn ưu đãi giảm giá vé xe và phòng homestay.",
    btnColor: "bg-[#FF6B00] hover:bg-[#e66000]",
    image: "/event-30-04.jpeg",
  },
  // {
  //   id: 2,
  //   title1: "MUA VÉ XE TRỰC TUYẾN",
  //   title2: "NHANH CHÓNG & TIỆN LỢI",
  //   title2Color: "text-[#FF6B00]",
  //   desc: "Hệ thống đặt vé xe thông minh, đa dạng nhà xe và tuyến đường. Lựa chọn chỗ ngồi ưng ý, thanh toán an toàn, không lo hết vé.",
  //   btnText: "GỌI ĐẶT VÉ",
  //   btnColor: "bg-[#FF6B00] hover:bg-[#e66000]",
  //   image: "/booking-bus.jpeg",
  // },
  // {
  //   id: 3,
  //   title1: "ĐẶT HOMESTAY ĐẸP",
  //   title2: "TRẢI NGHIỆM TUYỆT VỜI",
  //   title2Color: "text-[#FF6B00]",
  //   desc: "Khám phá hàng trăm homestay, villa view đẹp, giá tốt trên toàn quốc. Đặt phòng dễ dàng, hỗ trợ 24/7, mang đến kỳ nghỉ hoàn hảo.",
  //   btnText: "GỌI ĐẶT PHÒNG",
  //   btnColor: "bg-[#FF6B00] hover:bg-[#e66000]",
  //   image: "/booking-homestay.jpeg",
  // },
];

export default function PromoSlider() {
  return (
    <div className="w-full relative mb-6 group promo-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col lg:flex-row w-full h-auto min-h-[380px]">
              {/* Left Side (Text Content) */}
              <div className="w-full lg:w-[40%] p-6 md:p-12 lg:pr-8 flex flex-col justify-center z-10 shrink-0 bg-white">
                <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-3 uppercase leading-tight">
                  {slide.title1} <br />
                  <span className={slide.title2Color}>{slide.title2}</span>
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed max-w-[95%]">
                  {slide.desc}
                </p>
                
              </div>

              {/* Right Side (Visuals) */}
              <div className=" w-full  relative min-h-[260px] md:min-h-[300px]   items-center justify-center p-4">
                <div className="relative w-full h-[240px] md:h-[280px] lg:h-full  overflow-hidden shadow-sm">
                  <Image 
                    src={slide.image!} 
                    alt={slide.title1}
                    fill
                    className="object-contain"
                    unoptimized={true}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles */}
      <style jsx global>{`
        .promo-slider .swiper-button-next,
        .promo-slider .swiper-button-prev {
          color: #111 !important;
          background-color: rgba(255, 255, 255, 0.9);
          width: 44px !important;
          height: 44px !important;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s;
          opacity: 0;
        }
        .promo-slider:hover .swiper-button-next,
        .promo-slider:hover .swiper-button-prev {
          opacity: 1;
        }
        .promo-slider .swiper-button-next:hover,
        .promo-slider .swiper-button-prev:hover {
          background-color: white;
          transform: scale(1.1);
        }
        .promo-slider .swiper-button-next:after,
        .promo-slider .swiper-button-prev:after {
          font-size: 16px !important;
          font-weight: 900;
        }
        .promo-slider .swiper-pagination-bullet {
          background-color: #cbd5e1 !important;
          opacity: 0.6 !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s;
        }
        .promo-slider .swiper-pagination-bullet-active {
          background-color: #FF6B00 !important;
          opacity: 1 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
        .promo-slider .swiper-pagination {
          bottom: 15px !important;
        }
      `}</style>
    </div>
  );
}
