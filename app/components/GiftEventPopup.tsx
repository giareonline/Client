"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Gift, Sparkles } from "lucide-react";
import api from "../lib/axios";

export default function GiftEventPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkEventStatus = async () => {
      // Check if user already dismissed it this session
      const dismissed = sessionStorage.getItem("giftPopupDismissed");
      if (dismissed === "true") return;

      try {
        const { data } = await api.get("/auth/event-status");
        if (data.success && data.isEventActive) {
          setRemainingSpots(data.remainingSpots);
          
          // Delay popup slightly for better UX
          setTimeout(() => {
            setIsOpen(true);
            document.body.style.overflow = "hidden";
          }, 1500);
        }
      } catch (error) {
        console.error("Failed to fetch event status:", error);
      }
    };

    checkEventStatus();

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("giftPopupDismissed", "true");
    document.body.style.overflow = "unset";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white overflow-hidden rounded-[2rem] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Background effects */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 opacity-90" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1] 
                }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[50%] -left-[20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="relative pt-10 px-8 pb-10 text-center flex flex-col items-center">
              
              {/* Icon / Avatar */}
              <motion.div 
                animate={isHovered ? { y: -5, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative z-10 w-28 h-28 bg-gradient-to-tr from-yellow-300 to-amber-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-6"
              >
                <Gift className="text-white w-14 h-14" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-[3px] border-dashed border-white/30"
                />
              </motion.div>

              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                Sự Kiện Đặc Biệt! <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                  Tặng 50 Sao Miễn Phí
                </span>
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 font-medium">
                Chào mừng bạn đến với chúng tôi! Đăng ký tài khoản ngay hôm nay để nhận ngay phần quà 50 sao cực giá trị.
              </p>

              <div className="flex items-center justify-center gap-3 bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl font-bold mb-8 w-full border border-orange-100 shadow-inner">
                <Star className="fill-orange-500 w-6 h-6" />
                <span className="text-xl">Chỉ còn <span className="text-2xl text-red-600 mx-1">{remainingSpots}</span> suất cuối cùng!</span>
                <Sparkles className="text-orange-500 w-5 h-5" />
              </div>

              <button 
                onClick={handleClose}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-[1px] shadow-lg transition-all hover:shadow-orange-500/30"
              >
                <div className="relative flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-orange-600 transition-all group-hover:bg-transparent group-hover:text-white">
                  <span>Khám Phá Ngay</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </button>
              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
