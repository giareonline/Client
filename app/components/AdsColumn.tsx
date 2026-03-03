"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
type Props = {
  side: "left" | "right";
};

export default function AdsColumn({ side }: Props) {
  const leftImages = [
    { id: 1, image: "/quang-cao.png" },
    { id: 2, image: "/quang-cao-old.png" },
  ];

  const rightImages = [
    { id: 5, image: "/quang-cao.png" },
    { id: 6, image: "/quang-cao-old.png" },
  ];

  const images = side === "left" ? leftImages : rightImages;

  return (
    <aside className="hidden lg:block w-full">
      <div className="sticky top-20 ">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
        >
          {images.map((item) => (
            <SwiperSlide key={item.id}>
              <img
                src={item.image}
                alt="Quảng cáo"
                className="w-full  object-cover rounded-lg shadow"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-3">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
          >
            {images.map((item) => (
              <SwiperSlide key={item.id}>
                <img
                  src={item.image}
                  alt="Quảng cáo"
                  className="w-full  object-cover rounded-lg shadow"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </aside>
  );
}
