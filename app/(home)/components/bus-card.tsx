"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import Button from "@/app/ui/button";

interface BusOrderProps {
  order: {
    _id: string;
    fromLocation: string;
    toLocation: string;
    fromDate: string;
    fromTime: string;
    toTime: string;
    fromDestination: string;
    toDestination: string;
    brand: string;
    busCategory: string;
    priceTicket: string;
  };
}

export default function BusCard({ order }: BusOrderProps) {
  return (
    <div
      className="bg-white rounded-2xl p-4 w-full
               shadow-sm border border-gray-100
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
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                🚐 Tuyến Xe
              </span>
              <h3 className="font-semibold text-lg text-gray-800">{order.brand}</h3>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-gray-500 text-sm">{order.busCategory}</div>
              <div className="text-green-600 text-lg font-bold">
                {order.priceTicket}đ
              </div>
            </div>
          </div>

          {/* Time section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 md:mt-3 gap-4 md:gap-0">
            {/* Departure */}
            <div className="flex gap-4">
              {/* Timeline Graphic */}
              <div className="flex flex-col items-center mt-1">
                {/* Start dot */}
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="w-0.5 h-full bg-gray-200 my-1 min-h-[40px]" />
                {/* End dot */}
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>

              {/* Content timeline */}
              <div className="flex flex-col justify-between gap-6">
                {/* Departure */}
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Clock size={16} className="text-green-500" />
                    {order.fromTime}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mt-0.5">
                    {order.fromLocation}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.fromDestination}
                  </div>
                </div>

                {/* Arrival */}
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <MapPin size={16} className="text-red-500" />
                    {order.toTime}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mt-0.5">
                    {order.toLocation}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.toDestination}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-3 mt-4 md:mt-0">
              <button className="text-blue-600 text-sm font-medium hover:underline text-right">
                Thông tin chi tiết
              </button>
              <Button className="w-full md:w-auto px-6 whitespace-nowrap">
                Gọi đặt vé
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-green-600 font-semibold text-xs tracking-wide">
          THEO DÕI HÀNH TRÌNH XE
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
            Thông báo
          </span>
          <button className="text-blue-600 text-sm hover:underline font-medium">
            Thông báo nhà xe {order.brand}
          </button>
        </div>
      </div>
    </div>
  );
}
