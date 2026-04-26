"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  X, Check, ChevronLeft, ChevronRight, 
  Droplets, Hammer, Tv, BatteryCharging, 
  BedDouble, Wifi, Wind, Box, Car, Bath, Coffee
} from "lucide-react";

interface OrderDetailsTabsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    images?: string[];
    amenities?: string[];
    type: "bus" | "homestay";
  };
}

const getAmenityConfig = (name: string) => {
  const norm = name.toLowerCase();
  
  // Trùng khớp với Screenshot (Có description)
  if (norm.includes("nước uống") || norm.includes("nước suối") || norm.includes("nước")) {
    return { icon: Droplets, desc: "Nhà xe có phục vụ nước cho hành khách." };
  }
  if (norm.includes("búa phá kính")) {
    return { icon: Hammer, desc: "Dùng để phá kính ô tô thoát hiểm trong trường hợp khẩn cấp." };
  }

  // Tiện ích bình thường
  if (norm.includes("tivi")) return { icon: Tv };
  if (norm.includes("sạc")) return { icon: BatteryCharging };
  if (norm.includes("chăn")) return { icon: BedDouble };
  if (norm.includes("wifi")) return { icon: Wifi };
  if (norm.includes("điều hòa") || norm.includes("điều hoà")) return { icon: Wind };
  if (norm.includes("khăn lạnh")) return { icon: Box };
  if (norm.includes("bãi đỗ xe")) return { icon: Car };
  if (norm.includes("tắm") || norm.includes("nước nóng") || norm.includes("vệ sinh")) return { icon: Bath };
  if (norm.includes("ăn") || norm.includes("bữa")) return { icon: Coffee };
  
  return { icon: Check };
};

export default function OrderDetailsTabsModal({ isOpen, onClose, order }: OrderDetailsTabsModalProps) {
  const [activeTab, setActiveTab] = useState<"policy" | "images" | "amenities">("policy");
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const actualAmenities = useMemo(() => {
    return order.amenities && order.amenities.length > 0
      ? order.amenities 
      : order.type === "bus" 
        ? ["Nước uống", "Búa phá kính", "Tivi LED", "Sạc điện thoại", "Chăn đắp", "Wifi", "Điều hòa", "Khăn lạnh"]
        : ["Wifi miễn phí", "Điều hoà", "Tivi", "Máy nước nóng", "Đồ vệ sinh cá nhân", "Bãi đỗ xe", "Ăn sáng"];
  }, [order.amenities, order.type]);

  const { fullWidthItems, gridItems } = useMemo(() => {
    const full = actualAmenities.filter(a => getAmenityConfig(a).desc);
    const grid = actualAmenities.filter(a => !getAmenityConfig(a).desc);
    return { fullWidthItems: full, gridItems: grid };
  }, [actualAmenities]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 px-2 pt-2 relative">
          <div className="flex gap-6 px-4">
            <button
              onClick={() => setActiveTab("policy")}
              className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "policy" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Chính sách
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "images" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Hình ảnh
            </button>
            <button
              onClick={() => setActiveTab("amenities")}
              className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "amenities" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Tiện ích
            </button>
          </div>
          <button onClick={onClose} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors absolute right-4 top-3">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto w-full">
          {activeTab === "policy" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-lg">{order.type === "bus" ? "Nhà xe quy định" : "Quy định chỗ nghỉ"}</h4>
                <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Phí hủy</span>
                    <span className="text-sm font-bold text-red-600">Không được huỷ</span>
                  </div>
                  <div className="w-full h-px bg-amber-200 my-2" />
                  <p className="text-xs font-semibold text-gray-700">
                    Vé/Phòng đã đặt không được phép hủy, hoàn tiền.
                  </p>
                </div>
              </div>

              {order.type === "bus" && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 mb-2">Yêu cầu khi lên xe</h5>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-600 leading-relaxed">
                      <li>Có mặt tại quầy vé/bến xe trước 30 phút để làm thủ tục lên xe</li>
                      <li>Lấy vé giấy trước khi lên xe</li>
                      <li>Không mang đồ ăn có mùi lên xe</li>
                      <li>Không hút thuốc, uống rượu, sử dụng chất kích thích trên xe</li>
                      <li>Không mang vật dễ cháy nổ lên xe</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 mb-2">Hành lý mang theo</h5>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-600 leading-relaxed">
                      <li>Tổng trọng lượng hành lý không vượt quá 20 kg</li>
                      <li>Không mang hàng hóa cồng kềnh</li>
                      <li>Trong trường hợp huỷ đơn hàng do vi phạm các quy định sẽ không được hoàn tiền</li>
                    </ul>
                  </div>
                </div>
              )}

              {order.type === "homestay" && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 mb-2">Yêu cầu nhận phòng</h5>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-600 leading-relaxed">
                      <li>Mang theo CMND/CCCD hoặc Hộ chiếu để nhận phòng</li>
                      <li>Giữ gìn vệ sinh chung, không hút thuốc trong phòng</li>
                      <li>Không tổ chức tiệc tùng ồn ào ảnh hưởng xung quanh</li>
                      <li>Không mang theo vật nuôi (trừ khi có thoả thuận trước)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "images" && (
            <div className="w-full">
              {order.images && order.images.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {/* Main Large Image */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#F1F5F9] group shadow-inner">
                    <Image 
                      src={order.images[currentImgIndex]} 
                      alt={`Gallery main ${currentImgIndex + 1}`} 
                      fill 
                      priority
                      sizes="(max-width: 768px) 100vw, 800px"
                      unoptimized={true}
                      className="object-contain" // Keep aspect ratio but fit inside the box
                    />
                    {order.images.length > 1 && (
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 md:px-5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setCurrentImgIndex(i => (i - 1 + order.images!.length) % order.images!.length)} 
                          className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white text-gray-600 hover:text-blue-600 transition-all active:scale-95"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={() => setCurrentImgIndex(i => (i + 1) % order.images!.length)} 
                          className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white text-gray-600 hover:text-blue-600 transition-all active:scale-95"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </div>
                    )}
                    {/* Badge e.g. 1/9 */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      {currentImgIndex + 1} / {order.images.length}
                    </div>
                  </div>

                  {/* Thumbnails row */}
                  {order.images.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 snap-x px-1" style={{ scrollbarWidth: 'none' }}>
                      {order.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImgIndex(idx)}
                          className={`relative w-[88px] h-[88px] rounded-xl overflow-hidden shrink-0 transition-all snap-center shadow-sm ${
                            currentImgIndex === idx 
                            ? 'ring-2 ring-blue-500 ring-offset-2 opacity-100' 
                            : 'ring-1 ring-gray-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt={`Thumb ${idx + 1}`} fill sizes="88px" unoptimized={true} loading="lazy" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIsKyMK29ESgcgkC_XcUOt7jHzU6oOX5-jFw&s" width={80} height={80} alt="Empty" className="opacity-30 mb-4 grayscale" />
                  <span className="text-sm font-medium">Chưa có hình ảnh nào được cập nhật.</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "amenities" && (
            <div className="space-y-6">
              {/* Box descriptions (Full Width) */}
              {fullWidthItems.length > 0 && (
                <div className="flex flex-col bg-[#F9FAFB] rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  {fullWidthItems.map((amenity, idx) => {
                    const cfg = getAmenityConfig(amenity);
                    const Icon = cfg.icon;
                    return (
                      <div key={idx} className={`p-4 md:p-5 ${idx !== fullWidthItems.length - 1 ? 'border-b border-gray-200/60' : ''}`}>
                         <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                               <Icon size={16} strokeWidth={2.5} />
                            </div>
                            <span className="font-semibold text-gray-800 text-sm md:text-base">{amenity}</span>
                         </div>
                         <p className="text-sm text-gray-600 leading-relaxed ml-11">{cfg.desc}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Grid Icons (1/3 Width) */}
              {gridItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {gridItems.map((amenity, idx) => {
                    const cfg = getAmenityConfig(amenity);
                    const Icon = cfg.icon;
                    return (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 p-3 bg-[#F9FAFB] hover:bg-gray-100 transition-colors rounded-xl border border-gray-100/50 shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center text-amber-500 shrink-0">
                          <Icon size={16} strokeWidth={2} />
                        </div>
                        <span className="text-gray-800 text-sm font-medium line-clamp-2 leading-tight">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
