"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import Button from "@/app/ui/button";

export default function BusCard() {
  return (
    <div
      className="bg-white rounded-2xl p-4 w-full
               shadow-sm
               transition-shadow duration-300 ease-in-out
               hover:shadow-xl"
    >
      <div className="flex gap-4 ">
        <div className="w-32 h-32 hidden sm:block relative rounded-xl overflow-hidden border">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIsKyMK29ESgcgkC_XcUOt7jHzU6oOX5-jFw&s"
            alt="Xe khách"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Top row */}
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded-lg font-semibold">
                🚐 Xe Xịn
              </span>
              <h3 className="font-semibold text-lg">Anh Huy Travel</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm mt-1">Ghế ngồi 16 chỗ</div>

              <div className="text-gray-600 text-sm font-medium">
                Chưa có giá chính thức
              </div>
            </div>
          </div>

          {/* Time section */}
          <div className="flex  items-center justify-between mt-3">
            {/* Departure */}
            <div className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                {/* Start dot */}
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="w-0.5 flex-1 bg-gray-300 my-1" />
                {/* End dot */}
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between gap-6">
                {/* Departure */}
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Clock size={16} className="text-green-500" />
                    10:20
                  </div>
                  <div className="text-sm text-gray-500">
                    Văn phòng 42 Đường ABC
                  </div>
                </div>

                {/* Arrival */}
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <MapPin size={16} className="text-red-500" />
                    12:40
                  </div>
                  <div className="text-sm text-gray-500">
                    Văn phòng 97 Hùng Vương
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {" "}
              {/* Detail */}
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Thông tin chi tiết
              </button>
              {/* Button */}
              <Button className="w-full mt-2 sm:mt-0 sm:ml-2">
                {" "}
                Gọi đặt vé
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom row */}

      <div className="mt-4 border-t pt-3">
        <p className="text-green-600 font-semibold text-sm">
          THEO DÕI HÀNH TRÌNH XE
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
            Thông báo
          </span>

          <button className="text-blue-600 text-sm hover:underline">
            Thông báo nhà xe Anh Huy
          </button>
        </div>
      </div>
    </div>
  );
}
