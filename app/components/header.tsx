"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AccountDropdown from "../(home)/components/account-dropdown";
import Link from "next/link";
import LoginModal from "./LoginModal";
import { HelpCircle } from "lucide-react";
import api from "@/app/lib/axios";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from local storage", e);
        }
      }
    };

    // Fetch fresh user data from API to keep stars/status in sync
    const fetchFreshUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (e) {
        console.error("Failed to fetch fresh user data", e);
      }
    };

    loadUser();
    fetchFreshUser();

    window.addEventListener("userUpdated", loadUser);
    return () => window.removeEventListener("userUpdated", loadUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1E3A5F]/95 backdrop-blur-md shadow-lg shadow-[#1E3A5F]/10"
          : "bg-gradient-to-r from-[#1E3A5F] to-[#2D5A8E]"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/10 p-1 group-hover:bg-white/20 transition-colors">
            <Image
              alt="GiaReOnline logo"
              width={40}
              height={30}
              src="/logo.png"
              className="object-contain"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-white font-bold text-lg leading-tight tracking-tight">
              GiaReOnline
            </span>
            <span className="text-blue-200/70 text-[10px] leading-tight font-medium">
              Đặt vé • Homestay
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="hidden sm:flex items-center gap-1.5 text-blue-100/80 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            <HelpCircle size={15} />
            Hướng dẫn
          </Link>

          {user ? (
            <AccountDropdown user={user} setUser={setUser} />
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="ml-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all duration-300 text-sm font-semibold backdrop-blur-sm"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
