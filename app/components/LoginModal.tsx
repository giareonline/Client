"use client";

import { useEffect, useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    } else {
      setTimeout(() => setShow(false), 300); // Allow animation to finish
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="mb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Chào mừng trở lại</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Đăng nhập bằng tài khoản Google của bạn để tiếp tục đặt vé
        </p>

        <div className="flex justify-center flex-col items-center w-full">
          <GoogleLoginButton />
        </div>
        
         <div className="mt-8 text-xs text-gray-400">
          Bằng việc đăng nhập, bạn đồng ý với <a href="#" className="underline hover:text-green-600">Điều khoản</a> và <a href="#" className="underline hover:text-green-600">Chính sách bảo mật</a> của chúng tôi.
        </div>
      </div>
    </div>
  );
}
