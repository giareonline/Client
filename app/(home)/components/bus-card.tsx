"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, Phone, X, Copy, Check, Info, Flame, Sparkles } from "lucide-react";
import OrderDetailsTabsModal from "./OrderDetailsTabsModal";
import { formatCurrency } from "@/app/utils/formatCurrency";
import NoImage from "@/app/components/NoImage";
import { useProvinceLookup } from "@/app/hooks/api/useProvinces";

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
    phone: string;
    busCategory: string;
    priceTicket: string;
    listTop?: string;
    images?: string[];
  };
}

export default function BusCard({ order }: BusOrderProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const provinceLookup = useProvinceLookup();

  const fromName = provinceLookup.get(order.fromLocation?.trim()) || order.fromLocation;
  const toName = provinceLookup.get(order.toLocation?.trim()) || order.toLocation;

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
        {/* Top: Brand header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-linear-to-r from-[#F8FAFF] to-white border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E8F0] bg-white shrink-0">
              {order.images?.[0] ? (
                <Image
                  src={order.images[0]}
                  alt={order.brand}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <NoImage className="w-full h-full rounded-lg" />
              )}
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
          <div className="flex items-center gap-2">
            {order.listTop === "hot" && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] text-white text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider shadow-sm shadow-[#FF4500]/20 animate-pulse">
                <Flame size={12} />
                Hot
              </span>
            )}
            {order.listTop === "goodCar" && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider shadow-sm shadow-[#F59E0B]/20">
                <Sparkles size={12} />
                Xe xịn
              </span>
            )}
           
          </div>
        </div>

        {/* Main body — ticket style */}
        <div className="relative flex flex-col sm:flex-row">
          {/* Left: Route info */}
          <div className="flex-1 px-5 py-4">
            <div className="flex items-start gap-4">
              {/* Timeline dots */}
              <div className="flex flex-col items-center pt-1.5">
                <div className="w-3 h-3 rounded-full bg-[#00C853] ring-4 ring-[#00C853]/15" />
                <div className="w-0.5 flex-1 bg-linear-to-b from-[#00C853]/30 via-[#E2E8F0] to-[#EF4444]/30 my-1.5 min-h-[36px]" />
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
                      {fromName}
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
                      {toName}
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
              </p>
            </div>

            <button
              onClick={() => setShowPhone(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-linear-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md glow-hover cursor-pointer whitespace-nowrap"
            >
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
              {fromName} → {toName}
            </span>
          </div>
          <button 
            onClick={() => setShowDetails(true)}
            className="text-[#2D5A8E] text-xs font-semibold hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            Chi tiết
            <ArrowRight size={12} />
          </button>
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
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 bg-white">
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
                  <p className="text-white/70 text-xs">{order.busCategory} • {fromName} → {toName}</p>
                </div>
              </div>
            </div>

            {/* Phone section */}
            <div className="px-6 py-5">
              <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2">Số điện thoại đặt vé</p>
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
                  <p className="font-bold mb-1">Hướng dẫn đặt vé:</p>
                  <ul className="space-y-1 list-disc list-inside text-amber-600">
                    <li>Gọi trực tiếp số điện thoại trên để đặt vé</li>
                    <li>Cung cấp tuyến đường: <span className="font-semibold">{fromName} → {toName}</span></li>
                    <li>Thời gian khởi hành: <span className="font-semibold">{order.fromTime}</span></li>
                    <li>Giá vé tham khảo: <span className="font-semibold text-[#FF6B35]">{formattedPrice}</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <a
                href={`tel:${primaryPhone}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#FF6B35]/20 active:scale-[0.98]"
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
        order={{ ...order, type: "bus" }} 
      />
    </>
  );
}
