"use client";

import { useQuery } from "@tanstack/react-query";
import { User, Mail, ShieldCheck, Calendar, LogOut, ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/app/utils/utils";

// API fetching function
const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
};

export default function PortfolioPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: false, // Don't retry on 401 Unauthorized
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
    window.location.reload();
  };

  // Only render on client to avoid hydration mismatch with localStorage
  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="px-8 pb-8 relative">
            <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white absolute -top-16 shadow-lg"></div>
            <div className="mt-20 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Phiên đăng nhập hết hạn</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại để xem thông tin của bạn.</p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors w-full">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          {/* Header Banner - with subtle gradient */}
          <div className="h-40 bg-gradient-to-r from-green-400 to-emerald-600 relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          </div>

          <div className="px-6 sm:px-10 pb-10 relative">
            {/* Avatar Profile Picture */}
            <div className="flex justify-between items-end">
              <div className="relative -mt-20">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-500">
                      <User size={48} />
                    </div>
                  )}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="mb-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </div>

            {/* Profile Info Text */}
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{user?.name}</h1>
              <p className="text-green-600 font-medium mt-1 flex items-center">
                #{user?._id?.substring(0, 8) || "00000000"}
              </p>
            </div>

            {/* Detailed Info Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Star Balance Card */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-start space-x-4 hover:bg-yellow-50/50 transition-colors group">
                <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl group-hover:bg-yellow-200 transition-colors">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Số dư Sao</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">
                    {user?.stars || 0}
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-start space-x-4 hover:bg-green-50/50 transition-colors group">
                <div className="bg-green-100 text-green-600 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Địa chỉ Email</p>
                  <p className="text-gray-900 font-semibold mt-0.5 truncate max-w-[200px] sm:max-w-xs" title={user?.email}>
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Role Card */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-start space-x-4 hover:bg-blue-50/50 transition-colors group">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vai trò</p>
                  <p className="text-gray-900 font-semibold mt-0.5 capitalize">
                    {user?.role || "Thành viên"}
                  </p>
                </div>
              </div>

              {/* Account Status Card */}
              <div className={cn(
                "rounded-2xl p-5 border flex items-start space-x-4 transition-colors group md:col-span-2",
                user?.isBlocked
                  ? "bg-red-50 border-red-100 hover:bg-red-100/50"
                  : "bg-gray-50 border-gray-100 hover:bg-purple-50/50"
              )}>
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  user?.isBlocked
                    ? "bg-red-100 text-red-600 group-hover:bg-red-200"
                    : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                )}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái tài khoản</p>
                  {user?.isBlocked ? (
                    <div className="mt-0.5">
                      <p className="text-red-600 font-semibold flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Tài khoản đã bị khoá
                      </p>
                      {user?.blockReason && (
                        <p className="text-xs text-red-500 mt-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                          <span className="font-semibold">Lý do:</span> {user.blockReason}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900 font-semibold mt-0.5 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Đang hoạt động bình thường
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
