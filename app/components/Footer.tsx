import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, Send, ShieldCheck, Clock, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#0F172A] text-slate-300 pt-20 pb-10 overflow-hidden mt-20" aria-label="Chân trang GiaReViet" role="contentinfo">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-t from-red-600/10 to-transparent blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-slate-800 pb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">Thanh toán an toàn</h4>
              <p className="text-sm text-slate-400 mt-1">Bảo mật giao dịch tuyệt đối</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
              <Clock size={28} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">Hỗ trợ 24/7</h4>
              <p className="text-sm text-slate-400 mt-1">Luôn sẵn sàng giải đáp</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CreditCard size={28} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">Đa dạng thanh toán</h4>
              <p className="text-sm text-slate-400 mt-1">Hỗ trợ thẻ, ví điện tử & chuyển khoản</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <Image
                  alt="GiaReViet logo"
                  width={56}
                  height={56}
                  src="/logo.png"
                  className="object-contain w-[56px] h-[56px]"
                />
                <span className="text-2xl font-black tracking-tight flex items-baseline leading-none">
                  <span className="text-white">GiaRe</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8111F] to-[#851225] ml-[1px]">Viet</span>
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Hệ thống tìm kiếm và đặt vé xe khách, homestay hàng đầu. Mang lại trải nghiệm đặt chỗ nhanh chóng, tiện lợi với mức giá tốt nhất thị trường.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Dịch vụ
            </h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Đặt vé xe khách</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Đặt phòng Homestay</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Combo Du lịch (Mới)</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Chương trình đối tác</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Hỗ trợ
            </h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Hướng dẫn đặt vé</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Chính sách hoàn tiền</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Điều khoản dịch vụ</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-transform">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Liên hệ
            </h4>
            <ul className="space-y-4">
             
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-slate-500 shrink-0" />
                <span className="text-slate-400 text-sm font-medium">086 2289 117</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-slate-500 shrink-0" />
                <span className="text-slate-400 text-sm">ngohieuez@.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} GiaReViet. Phát triển với tâm huyết.
          </p>
          <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Payment Method placeholders */}
            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[10px] font-bold text-blue-900">VISA</div>
            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[10px] font-bold text-red-600">MASTER</div>
            <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[10px] font-bold text-sky-500">JCB</div>
            <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-[10px] font-bold text-pink-600">MOMO</div>
          </div>
        </div>

      </div>
    </footer>
  );
}
