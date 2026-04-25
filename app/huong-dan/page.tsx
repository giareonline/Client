"use client";
import React, { useState } from "react";

import Link from "next/link";
import { 
  Bus, Home, Search, MapPin, Calendar, 
  PhoneCall, User, CheckCircle2, Star,
  Info, ArrowRight, MousePointerClick, ArrowLeft
} from "lucide-react";
import Header from "../components/header";

export default function HuongDanPage() {
  const [activeTab, setActiveTab] = useState("tong-quan");

  const tabs = [
    { id: "tong-quan", label: "Tổng quan", icon: <Info size={18} /> },
    { id: "ve-xe", label: "Đặt vé xe", icon: <Bus size={18} /> },
    { id: "homestay", label: "Đặt Homestay", icon: <Home size={18} /> },
    { id: "tai-khoan", label: "Tài khoản", icon: <User size={18} /> },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F8FAFF] py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md">
            <ArrowLeft size={18} />
            Quay lại trang chủ
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-[#1E3A8A] mb-4 uppercase">
            Hướng Dẫn Sử Dụng GiaReViet
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá cách tìm kiếm, đặt chỗ và tận hưởng trải nghiệm tuyệt vời cùng nền tảng du lịch GiaReViet.
          </p>
        </div>

        {/* Layout with Sidebar on Desktop */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-24">
              <nav className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                      activeTab === tab.id
                        ? "bg-[#1E3A8A] text-white shadow-md shadow-[#1E3A8A]/20"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#1E3A8A]"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
            
            {/* Tổng quan */}
            {activeTab === "tong-quan" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Info size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tổng quan về GiaReViet</h2>
                    <p className="text-gray-500 text-sm">Nền tảng đặt vé xe & homestay hàng đầu</p>
                  </div>
                </div>
                
                <div className="prose max-w-none text-gray-600">
                  <p className="mb-4">
                    <strong>GiaReViet</strong> là nền tảng trực tuyến giúp bạn dễ dàng tìm kiếm và đặt chỗ cho chuyến đi của mình. Chúng tôi cung cấp hai dịch vụ chính:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-3">
                        <Bus size={20} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Vé Xe Khách</h3>
                      <p className="text-sm">So sánh giá và đặt vé từ hàng trăm nhà xe uy tín trên toàn quốc.</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center mb-3">
                        <Home size={20} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Homestay & Villa</h3>
                      <p className="text-sm">Lựa chọn không gian lưu trú hoàn hảo cho kỳ nghỉ của bạn.</p>
                    </div>
                  </div>
                  <p className="mt-6">
                    Hệ thống được thiết kế thân thiện, hoạt động tốt trên cả máy tính và điện thoại di động, mang lại trải nghiệm mượt mà từ lúc tìm kiếm đến lúc hoàn tất chuyến đi.
                  </p>
                </div>
              </div>
            )}

            {/* Đặt vé xe */}
            {activeTab === "ve-xe" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Bus size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cách Tìm & Đặt Vé Xe</h2>
                    <p className="text-gray-500 text-sm">4 bước đơn giản để có vé xe ưng ý</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <StepCard 
                    number={1} 
                    title="Nhập thông tin tìm kiếm" 
                    desc="Tại trang chủ, chọn tab 'Vé Xe Khách'. Nhập điểm đi, điểm đến và ngày khởi hành mong muốn. Sau đó nhấn nút 'Tìm kiếm'."
                    icon={<Search size={20} />}
                  />
                  <StepCard 
                    number={2} 
                    title="Lựa chọn chuyến xe" 
                    desc="Hệ thống sẽ hiển thị danh sách các chuyến xe hiện có. Bạn có thể xem thông tin nhà xe, giờ đi, loại xe (Limousine, Giường nằm) và giá vé."
                    icon={<MousePointerClick size={20} />}
                  />
                  <StepCard 
                    number={3} 
                    title="Xem chi tiết & Tiện ích" 
                    desc="Click vào 'Xem chi tiết' để xem các điểm đón/trả, chính sách hủy vé và các tiện ích trên xe (Wifi, Sạc, TV...)."
                    icon={<Info size={20} />}
                  />
                  <StepCard 
                    number={4} 
                    title="Tiến hành đặt vé" 
                    desc="Khi đã chọn được chuyến xe ưng ý, nhấn nút 'Gọi đặt vé' (màu cam). Tổng đài viên của GiaReViet sẽ hỗ trợ bạn xuất vé và thanh toán nhanh chóng."
                    icon={<PhoneCall size={20} />}
                  />
                </div>
              </div>
            )}

            {/* Đặt Homestay */}
            {activeTab === "homestay" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Home size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cách Tìm & Đặt Homestay</h2>
                    <p className="text-gray-500 text-sm">Lưu trú tiện nghi, giá cả hợp lý</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <StepCard 
                    number={1} 
                    title="Chọn khu vực" 
                    desc="Tại trang chủ, chuyển sang tab 'Homestay'. Nhập tên Thành phố / Điểm du lịch (VD: Đà Lạt, Vũng Tàu) và ngày nhận phòng."
                    icon={<MapPin size={20} />}
                  />
                  <StepCard 
                    number={2} 
                    title="Duyệt danh sách Homestay" 
                    desc="Xem qua các homestay nổi bật với hình ảnh thực tế, mức giá mỗi đêm và các tiện ích đi kèm (Hồ bơi, BBQ, Bãi đậu xe...)."
                    icon={<Search size={20} />}
                  />
                  <StepCard 
                    number={3} 
                    title="Xem hình ảnh & Đánh giá" 
                    desc="Click vào một Homestay để mở thư viện ảnh chi tiết và tìm hiểu kỹ hơn về không gian lưu trú của bạn."
                    icon={<Info size={20} />}
                  />
                  <StepCard 
                    number={4} 
                    title="Liên hệ đặt phòng" 
                    desc="Nhấn 'Gọi đặt phòng' để liên hệ trực tiếp giữ phòng. Chúng tôi cam kết hỗ trợ bạn xuyên suốt kỳ nghỉ."
                    icon={<PhoneCall size={20} />}
                  />
                </div>
              </div>
            )}

            {/* Tài khoản */}
            {activeTab === "tai-khoan" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý Tài Khoản</h2>
                    <p className="text-gray-500 text-sm">Trải nghiệm cá nhân hóa & Ưu đãi</p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-600">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-green-500" />
                      Đăng nhập nhanh chóng
                    </h3>
                    <p className="text-sm">Nhấn nút "Đăng nhập" ở góc phải màn hình. GiaReViet hỗ trợ đăng nhập trực tiếp qua tài khoản Google một cách an toàn và bảo mật, không cần nhớ mật khẩu.</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Star size={18} className="text-yellow-500" />
                      Tích điểm G-Stars
                    </h3>
                    <p className="text-sm">Khi hoàn thành các chuyến đi hoặc đặt phòng, bạn sẽ được tích lũy điểm G-Stars. Sử dụng điểm này để đổi voucher hoặc nhận ưu đãi đặc biệt cho các lần đặt sau.</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar size={18} className="text-blue-500" />
                      Theo dõi lịch sử đơn hàng
                    </h3>
                    <p className="text-sm">Click vào Avatar {'>'} Chọn "Đơn hàng của tôi" để xem lại các chuyến xe đã đi hoặc các homestay đã lưu trú trong Bảng điều khiển (Dashboard).</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// Sub-component for Steps
function StepCard({ number, title, desc, icon }: { number: number, title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm z-10">
          {number}
        </div>
        <div className="w-px h-full bg-gray-200 mt-1" />
      </div>
      <div className="pb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1.5 flex items-center gap-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
