"use client";

import { Plus, ChevronDown, Bus, Home, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

const fetchOrders = async (type: "bus" | "homestay", page: number): Promise<{ data: any[], meta: any }> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/orders/${type}?page=${page}&limit=10`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error(`Không thể lấy danh sách đơn hàng ${type}`);
  }

  const result = await res.json();
  return { data: result.data, meta: result.meta }; 
};

export default function OrderTable() {
  const [filterType, setFilterType] = useState<"bus" | "homestay">("bus");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["orders", filterType, currentPage],
    queryFn: () => fetchOrders(filterType, currentPage),
  });

  const orders = response?.data || [];
  const meta = response?.meta;

  const handleFilterChange = (type: "bus" | "homestay") => {
    setFilterType(type);
    setCurrentPage(1); // Reset page to 1 when changing tabs
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách đơn hàng</h2>
            
            {/* Filter Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => handleFilterChange("bus")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filterType === "bus" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Bus size={14} />
                <span className="hidden sm:inline">Xe Khách</span>
              </button>
              <button 
                onClick={() => handleFilterChange("homestay")}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filterType === "homestay" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Home size={14} />
                <span className="hidden sm:inline">Homestay</span>
              </button>
            </div>
        </div>
        
        {/* Create Order Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Tạo đơn hàng</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <Link
                href="/dashboard/orders/bus"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                   <Bus size={16} />
                </div>
                Vé Xe Khách
              </Link>
              
              <Link
                href="/dashboard/orders/homestay"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                   <Home size={16} />
                </div>
                Phòng Homestay
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Dịch vụ</th>
              {filterType === "bus" ? (
                 <th className="px-6 py-4">Hành trình</th>
              ) : (
                 <th className="px-6 py-4">Khu vực / Check-in</th>
              )}
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4">Tổng tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                  Có lỗi xảy ra khi lấy danh sách đơn hàng. Vui lòng đăng nhập lại.
                </td>
              </tr>
            ) : orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-800">
                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                  </td>
                  <td className={`px-6 py-4 font-medium ${filterType === "bus" ? "text-blue-600" : "text-green-600"}`}>
                    {filterType === "bus" ? `Xe khách: ${order.brand}` : `Homestay: ${order.brand}`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {filterType === "bus" ? (
                      <>{order.fromLocation || "?"} &rarr; {order.toLocation || "?"}</>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">{order.propertyLocation || "?"}</span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          In: {order.checkInDate ? new Date(order.checkInDate).toLocaleDateString("vi-VN") : "?"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {order.priceTicket}đ
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status="completed" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    {filterType === "bus" ? <Bus size={32} className="text-gray-300" /> : <Home size={32} className="text-gray-300" />}
                    <p>Bạn chưa có đơn {filterType === "bus" ? "xe khách" : "homestay"} nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Pagination */}
      {meta && meta.totalPage > 0 && (
          <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-medium"
              >
                  <ChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === meta.totalPage ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex items-center justify-center w-9 h-9 rounded-lg border font-semibold text-sm transition-colors ${
                          currentPage === page
                            ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  if (
                    (page === currentPage - 2 && page > 1) ||
                    (page === currentPage + 2 && page < meta.totalPage)
                  ) {
                    return (
                      <span key={`dots-${page}`} className="flex items-center justify-center w-9 h-9 text-gray-500 font-medium">
                        ...
                      </span>
                    );
                  }
                  return null;
              })}

              <button 
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, meta.totalPage))}
                 disabled={currentPage === meta.totalPage}
                 className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-medium"
              >
                  <ChevronRight size={18} />
              </button>
          </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    cancelled: "bg-red-100 text-red-600 border border-red-200",
  };

  const labels: Record<string, string> = {
    completed: "Hoàn tất",
    pending: "Đang xử lý",
    cancelled: "Đã huỷ",
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
