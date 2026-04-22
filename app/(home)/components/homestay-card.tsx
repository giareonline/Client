"use client";

import Image from "next/image";
import { MapPin, Calendar, Phone, CheckCircle2, ArrowRight } from "lucide-react";

interface HomestayOrderProps {
  order: {
    _id: string;
    propertyLocation: string;
    checkInDate: string;
    brand: string;
    phone: string;
    priceTicket: string;
    amenities: string[];
  };
}

export default function HomestayCard({ order }: HomestayOrderProps) {
  const formattedPrice = order.priceTicket
    ? Number(order.priceTicket).toLocaleString("vi-VN")
    : "0";

  return (
    <div
      className="group bg-white rounded-2xl w-full overflow-hidden
                 border border-[#E2E8F0] transition-all duration-300 ease-out
                 hover:shadow-xl hover:shadow-[#1E3A5F]/8 hover:-translate-y-0.5"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt={order.brand}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r" />
          
          {/* Location badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#1E3A5F] text-xs font-semibold px-2.5 py-1.5 rounded-lg">
            <MapPin size={12} className="text-[#EF4444]" />
            {order.propertyLocation}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-5">
          {/* Top */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    Homestay
                  </span>
                </div>
                <h3 className="font-bold text-[#1E3A5F] text-lg leading-tight">
                  {order.brand}
                </h3>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-extrabold text-[#FF6B35] tracking-tight">
                  {formattedPrice}
                  <span className="text-sm font-medium text-[#94A3B8] ml-0.5">
                    đ
                  </span>
                </p>
                <p className="text-[10px] text-[#94A3B8] font-medium">
                  /đêm
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
              <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                <Calendar size={14} className="text-[#3B82F6]" />
                <span className="font-medium">
                  {new Date(order.checkInDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                <Phone size={14} className="text-[#00C853]" />
                <span className="font-medium">{order.phone}</span>
              </div>
            </div>

            {/* Amenities */}
            {order.amenities && order.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {order.amenities.slice(0, 4).map((amenity, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 text-[11px] bg-[#F8FAFF] text-[#64748B] px-2.5 py-1 rounded-md border border-[#E2E8F0] font-medium"
                  >
                    <CheckCircle2 size={10} className="text-[#00C853]" />
                    {amenity}
                  </span>
                ))}
                {order.amenities.length > 4 && (
                  <span className="text-[11px] text-[#94A3B8] px-1.5 py-1 font-medium">
                    +{order.amenities.length - 4} khác
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E8F0]">
            <button className="text-[#2D5A8E] text-xs font-semibold hover:underline transition-colors flex items-center gap-1">
              Chi tiết phòng
              <ArrowRight size={12} />
            </button>
            <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md glow-hover cursor-pointer">
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
