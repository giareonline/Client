"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AccountDropdown from "../(home)/components/account-dropdown";
import Link from "next/link";
import LoginModal from "./LoginModal";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Read the user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-green-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={"/"} className="flex items-center">
          <Image alt="logo" width={40} height={30} src="/logo.png" />
        </Link>

        {/* Account Dropdown */}
        <div className="flex items-center">
          {" "}
          <Link href="#" className="hover:underline text-sm">
            Hướng dẫn đặt vé
          </Link>
          {user ? (
            <AccountDropdown user={user} setUser={setUser} />
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="ml-2 px-3 py-1.5 bg-white text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm font-medium"
            >
              Login
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
