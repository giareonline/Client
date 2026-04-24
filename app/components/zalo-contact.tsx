"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ZaloContact() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed  cursor-pointer bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 group"
        style={{
          animation: "avatar-grow 2s infinite ease-in-out",
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-40 animate-ping group-hover:animate-none"></div>

        {/* Main avatar */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-[3px] border-white bg-[#0068FF] shadow-lg z-10 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 h-10 md:w-12 md:h-12 translate-y-[2px]"
          >
            <path
              fill="#ffffff"
              d="M12 2C6.48 2 2 5.94 2 10.5c0 2.54 1.4 4.8 3.6 6.3-.2.8-.8 2.4-1.2 3.2-.2.4.2.8.6.6.8-.4 2.4-1.2 3.2-1.6 1.2.3 2.5.5 3.8.5 5.52 0 10-3.94 10-8.5S17.52 2 12 2z"
            />
            <circle cx="8" cy="10.5" r="1.2" fill="#0068FF" />
            <circle cx="12" cy="10.5" r="1.2" fill="#0068FF" />
            <circle cx="16" cy="10.5" r="1.2" fill="#0068FF" />
          </svg>
        </div>
      </button>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes avatar-grow {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      {/* Modal Popup with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 flex items-center justify-between shadow-md">
                <h3 className="text-white font-extrabold text-xl flex items-center gap-3 drop-shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-10 h-10 md:w-12 md:h-12 translate-y-[2px]"
                  >
                    <path
                      fill="#ffffff"
                      d="M12 2C6.48 2 2 5.94 2 10.5c0 2.54 1.4 4.8 3.6 6.3-.2.8-.8 2.4-1.2 3.2-.2.4.2.8.6.6.8-.4 2.4-1.2 3.2-1.6 1.2.3 2.5.5 3.8.5 5.52 0 10-3.94 10-8.5S17.52 2 12 2z"
                    />
                    <circle cx="8" cy="10.5" r="1.2" fill="#0068FF" />
                    <circle cx="12" cy="10.5" r="1.2" fill="#0068FF" />
                    <circle cx="16" cy="10.5" r="1.2" fill="#0068FF" />
                  </svg>
                  Liên hệ GiaReViet
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 cursor-pointer rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col items-center">
                <div className="w-64 h-64 relative mb-6 rounded-2xl overflow-hidden border-2 border-orange-100 shadow-lg bg-white hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/zalo.jpg"
                    alt="Zalo QR Code"
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="text-center space-y-3 w-full">
                  <p className="font-extrabold text-slate-800 text-xl tracking-tight">
                    Quét mã QR để liên hệ qua Zalo
                  </p>
                  <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-base border border-orange-200 shadow-inner w-full">
                    <p className="font-semibold leading-relaxed">
                      Liên hệ với mục đích report báo cáo sai phạm, lừa đảo,
                      hoặc hợp tác với các nhãn hàng.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-8 w-full py-3.5 cursor-pointer bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
