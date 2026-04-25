"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, Phone, CheckCircle2, ArrowRight, X, Copy, Check, Info, Flame, Sparkles } from "lucide-react";
import OrderDetailsTabsModal from "./OrderDetailsTabsModal";
import { formatCurrency } from "@/app/utils/formatCurrency";
import NoImage from "@/app/components/NoImage";
import { useProvinceLookup } from "@/app/hooks/api/useProvinces";

interface HomestayOrderProps {
  order: {
    _id: string;
    propertyLocation: string;
    checkInDate: string;
    brand: string;
    phone: string;
    priceTicket: string;
    amenities: string[];
    listTop?: string;
    images?: string[];
  };
}

export default function HomestayCard({ order }: HomestayOrderProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const provinceLookup = useProvinceLookup();

  const propertyLocationName = provinceLookup.get(order.propertyLocation?.trim()) || order.propertyLocation;

  const formattedPrice = order.priceTicket
    ? formatCurrency(order.priceTicket)
    : "0đ";

  const phoneNumbers = order.phone?.split(",").map(p => p.trim()).filter(Boolean) || [];
  const primaryPhone = phoneNumbers[0] || order.phone;

  const handleCopy = async (phoneToCopy: string) => {
    try {
      await navigator.clipboard.writeText(phoneToCopy);
      setCopied(phoneToCopy);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = phoneToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(phoneToCopy);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <>
      <div
        className="group bg-white rounded-2xl w-full overflow-hidden
                   border border-[#E2E8F0] transition-all duration-300 ease-out
                   hover:shadow-xl hover:shadow-[#1E3A5F]/8 hover:-translate-y-0.5"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
            {order.images?.[0] ? (
              <Image
                src={order.images[0]}
                alt={order.brand}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <NoImage className="w-full h-full" />
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r" />
            
            {/* Location badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#1E3A5F] text-xs font-semibold px-2.5 py-1.5 rounded-lg">
              <MapPin size={12} className="text-[#EF4444]" />
              {propertyLocationName}
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
                    {order.listTop === "hot" && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-sm shadow-[#FF4500]/20 animate-pulse">
                        <Flame size={10} />
                        Hot
                      </span>
                    )}
                    {order.listTop === "niceRoom" && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-sm shadow-[#F59E0B]/20">
                        <Sparkles size={10} />
                        Phòng đẹp
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#1E3A5F] text-lg leading-tight">
                    {order.brand}
                  </h3>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-2xl font-extrabold text-[#FF6B35] tracking-tight">
                    {formattedPrice}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] font-medium">
                    /đêm
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1 line-clamp-1">
                  <MapPin size={12} className="shrink-0 text-[#EF4444]" />
                  <span>{propertyLocationName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                  <Calendar size={14} className="text-[#3B82F6]" />
                  <span className="font-medium">
                    {new Date(order.checkInDate).toLocaleDateString("vi-VN")}
                  </span>
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
              <button 
                onClick={() => setShowDetails(true)}
                className="text-[#2D5A8E] text-xs font-semibold hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                Chi tiết phòng
                <ArrowRight size={12} />
              </button>
              <button
                onClick={() => setShowPhone(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-linear-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md glow-hover cursor-pointer whitespace-nowrap"
              >
                <Phone size={14} />
                Gọi đặt phòng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Popup */}
      {showPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowPhone(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8E] px-6 pt-6 pb-5 text-white relative">
              <button
                onClick={() => setShowPhone(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 bg-white shrink-0">
                  {order.images?.[0] ? (
                    <Image
                      src={order.images[0]}
                      alt={order.brand}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <NoImage className="w-full h-full rounded-xl" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{order.brand}</h3>
                  <p className="text-white/70 text-xs">Homestay • Khu vực {propertyLocationName}</p>
                </div>
              </div>
            </div>

            {/* Phone section */}
            <div className="px-6 py-5">
              <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2">Số điện thoại đặt phòng</p>
              <div className="flex flex-col gap-2">
                {phoneNumbers.map((phone, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#F1F5F9] rounded-xl p-3 max-w-full overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B35]/10 flex flex-shrink-0 items-center justify-center shrink-0">
                      <Phone size={14} className="text-[#FF6B35]" />
                    </div>
                    <span className="text-lg font-bold text-[#1E3A5F] tracking-wide flex-1 break-all">
                      {phone}
                    </span>
                    <button
                      onClick={() => handleCopy(phone)}
                      className={`flex flex-shrink-0 items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        copied === phone
                          ? "bg-green-100 text-green-600"
                          : "bg-[#1E3A5F] text-white hover:bg-[#2D5A8E]"
                      }`}
                    >
                      {copied === phone ? <><Check size={13} /> Đã copy</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                ))}
              </div>

              {/* Info note */}
              <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                <Info size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-700 leading-relaxed">
                  <p className="font-bold mb-1">Hướng dẫn đặt phòng:</p>
                  <ul className="space-y-1 list-disc list-inside text-amber-600">
                    <li>Gọi trực tiếp số điện thoại trên để đặt phòng</li>
                    <li>Nêu rõ loại phòng khu vực <span className="font-semibold">{propertyLocationName}</span></li>
                    <li>Ngày dự kiến nhận phòng: <span className="font-semibold">{order.checkInDate ? new Date(order.checkInDate).toLocaleDateString('vi-VN') : "Đang cập nhật"}</span></li>
                    <li>Giá tham khảo: <span className="font-semibold text-[#FF6B35]">{formattedPrice}/đêm</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <a
                href={`tel:${primaryPhone}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-linear-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#FF6B35]/20 active:scale-[0.98]"
              >
                <Phone size={16} />
                Gọi ngay
              </a>
              <button
                onClick={() => setShowPhone(false)}
                className="px-5 py-3 text-[#94A3B8] font-semibold text-sm hover:text-[#1E3A5F] hover:bg-[#F1F5F9] rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Tabs Modal */}
      <OrderDetailsTabsModal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        order={{ ...order, type: "homestay" }} 
      />
    </>
  );
}
