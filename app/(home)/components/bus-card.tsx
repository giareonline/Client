"use client";

import Image from "next/image";
import { MapPin, Clock, ArrowRight, Phone } from "lucide-react";

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
    images?: string[];
  };
}

export default function BusCard({ order }: BusOrderProps) {
  const formattedPrice = order.priceTicket
    ? Number(order.priceTicket).toLocaleString("vi-VN")
    : "0";

  return (
    <div
      className="group bg-white rounded-2xl w-full overflow-hidden
                 border border-[#E2E8F0] transition-all duration-300 ease-out
                 hover:shadow-xl hover:shadow-[#1E3A5F]/8 hover:-translate-y-0.5"
    >
      {/* Top: Brand header bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#F8FAFF] to-white border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E8F0] bg-white flex-shrink-0">
            <Image
              src={order.images?.[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIsKyMK29ESgcgkC_XcUOt7jHzU6oOX5-jFw&s"}
              alt={order.brand}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="font-bold text-[#1E3A5F] text-base leading-tight">
              {order.brand}
            </h3>
            <span className="text-xs text-[#94A3B8] font-medium">
              {order.busCategory}
            </span>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 bg-[#1E3A5F]/5 text-[#1E3A5F] text-xs px-2.5 py-1 rounded-lg font-semibold">
          🚐 Tuyến xe
        </span>
      </div>

      {/* Main body — ticket style */}
      <div className="relative flex flex-col sm:flex-row">
        {/* Left: Route info */}
        <div className="flex-1 px-5 py-4">
          <div className="flex items-start gap-4">
            {/* Timeline dots */}
            <div className="flex flex-col items-center pt-1.5">
              <div className="w-3 h-3 rounded-full bg-[#00C853] ring-4 ring-[#00C853]/15" />
              <div className="w-0.5 flex-1 bg-gradient-to-b from-[#00C853]/30 via-[#E2E8F0] to-[#EF4444]/30 my-1.5 min-h-[36px]" />
              <div className="w-3 h-3 rounded-full bg-[#EF4444] ring-4 ring-[#EF4444]/15" />
            </div>

            {/* Route details */}
            <div className="flex flex-col justify-between gap-5 flex-1">
              {/* Departure */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#1E3A5F]">
                    {order.fromTime}
                  </span>
                  <span className="text-xs text-[#94A3B8]">•</span>
                  <span className="text-sm font-semibold text-[#64748B]">
                    {order.fromLocation}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <MapPin size={11} />
                  {order.fromDestination}
                </p>
              </div>

              {/* Arrival */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#1E3A5F]">
                    {order.toTime}
                  </span>
                  <span className="text-xs text-[#94A3B8]">•</span>
                  <span className="text-sm font-semibold text-[#64748B]">
                    {order.toLocation}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <MapPin size={11} />
                  {order.toDestination}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket notch + dashed separator (desktop) */}
        <div className="hidden sm:block ticket-notch ticket-dash self-stretch" />

        {/* Mobile separator */}
        <div className="sm:hidden border-t border-dashed border-[#E2E8F0] mx-5" />

        {/* Right: Price + CTA */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 px-5 py-4 sm:min-w-[180px]">
          <div className="text-right">
            <p className="text-xs text-[#94A3B8] font-medium">Giá từ</p>
            <p className="text-2xl font-extrabold text-[#FF6B35] tracking-tight">
              {formattedPrice}
              <span className="text-sm font-medium text-[#94A3B8] ml-0.5">
                đ
              </span>
            </p>
          </div>

          <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md glow-hover cursor-pointer whitespace-nowrap">
            <Phone size={14} />
            Gọi đặt vé
          </button>
        </div>
      </div>

      {/* Bottom: Tags */}
      <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFF]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#00C853]/8 text-[#00C853] text-[11px] font-semibold px-2.5 py-1 rounded-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
            Còn chỗ
          </span>
          <span className="text-xs text-[#94A3B8]">
            {order.fromLocation} → {order.toLocation}
          </span>
        </div>
        <button className="text-[#2D5A8E] text-xs font-semibold hover:underline transition-colors flex items-center gap-1">
          Chi tiết
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
