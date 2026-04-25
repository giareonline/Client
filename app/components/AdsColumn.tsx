"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useBanners } from "../hooks/api/useBanners";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  side: "left" | "right";
};

export default function AdsColumn({ side }: Props) {
  // Fetch all banners without position filter
  const { data: allBanners } = useBanners();

  // Filter banners based on side
  const frameTop = side === "left" ? "frame1" : "frame3";
  const frameBottom = side === "left" ? "frame2" : "frame4";

  const topBanners =
    allBanners?.filter((b: any) => b.position === frameTop) || [];
  const bottomBanners =
    allBanners?.filter((b: any) => b.position === frameBottom) || [];

  const banners1 = topBanners;
  const banners2 = bottomBanners;

  return (
    <aside className="hidden lg:block w-full">
      <div className="sticky top-20">
        {/* Top Frame Swiper */}
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
          {banners1.map((item: any) => (
            <SwiperSlide key={item._id}>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full"
                >
                  <img
                    src={item.desktopImage}
                    alt="Quảng cáo"
                    className="w-full aspect-[4/7] object-cover rounded-lg shadow"
                  />
                </a>
              ) : (
                <img
                  src={item.desktopImage}
                  alt="Quảng cáo"
                  className="w-full aspect-[4/7] object-cover rounded-lg shadow"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Frame Swiper */}
        <div className="mt-3">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            autoplay={{
              delay: 3000, // slightly different delay to stagger animations
              disableOnInteraction: false,
              reverseDirection: true,
            }}
            pagination={{ clickable: true }}
          >
            {banners2.map((item: any) => (
              <SwiperSlide key={item._id}>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full"
                  >
                    <img
                      src={item.desktopImage}
                      alt="Quảng cáo"
                      className="w-full aspect-[4/7] object-cover rounded-lg shadow"
                    />
                  </a>
                ) : (
                  <img
                    src={item.desktopImage}
                    alt="Quảng cáo"
                    className="w-full aspect-[4/7] object-cover rounded-lg shadow"
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </aside>
  );
}
