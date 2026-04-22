"use client";

import { useEffect, useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setShow(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-[#1E3A5F]/15 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F8FAFF] rounded-xl transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-3">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8E] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#1E3A5F]/20">
                <LogIn size={28} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-[#1E3A5F]">
              Chào mừng trở lại
            </h2>
            <p className="text-[#94A3B8] mb-8 text-sm">
              Đăng nhập bằng tài khoản Google để tiếp tục đặt vé
            </p>

            <div className="flex justify-center flex-col items-center w-full">
              <GoogleLoginButton />
            </div>

            <div className="mt-8 text-xs text-[#94A3B8]">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <a
                href="#"
                className="underline hover:text-[#1E3A5F] transition-colors"
              >
                Điều khoản
              </a>{" "}
              và{" "}
              <a
                href="#"
                className="underline hover:text-[#1E3A5F] transition-colors"
              >
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
