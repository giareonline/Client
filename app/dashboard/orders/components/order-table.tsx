"use client";

import {
  Plus,
  ChevronDown,
  Bus,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { formatCurrency } from "@/app/utils/formatCurrency";

const fetchOrders = async (
  type: "bus" | "homestay",
  page: number,
): Promise<{ data: any[]; meta: any }> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Vui lòng đăng nhập");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/orders/${type}?page=${page}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Không thể lấy danh sách đơn hàng ${type}`);
  }

  const result = await res.json();
  return { data: result.data, meta: result.meta };
};

export default function OrderTable() {
  const [filterType, setFilterType] = useState<"bus" | "homestay">("bus");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Đơn hàng
          </h2>

          {/* Filter Tabs */}
          <div className="flex items-center bg-gray-100/80 p-1 rounded-2xl ring-1 ring-gray-200/50">
            <button
              onClick={() => handleFilterChange("bus")}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all ${filterType === "bus" ? "bg-white text-blue-600 shadow-md ring-1 ring-gray-100" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Bus size={16} />
              <span>Vé Xe</span>
            </button>
            <button
              onClick={() => handleFilterChange("homestay")}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all ${filterType === "homestay" ? "bg-white text-green-600 shadow-md ring-1 ring-gray-100" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Home size={16} />
              <span>Homestay</span>
            </button>
          </div>
        </div>

        {/* Create Order Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} />
            <span>TẠO ĐƠN HÀNG</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 left-0 sm:left-auto mt-3 w-full sm:w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <Link
                href="/dashboard/orders/bus"
                className="flex items-center gap-4 px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Bus size={18} />
                </div>
                Vé Xe Khách
              </Link>

              <Link
                href="/dashboard/orders/homestay"
                className="flex items-center gap-4 px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                  <Home size={18} />
                </div>
                Phòng Homestay
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-gray-100">
            <tr>
              <th className="px-8 py-5">Mã đơn</th>
              <th className="px-8 py-5">Dịch vụ</th>
              {filterType === "bus" ? (
                <th className="px-8 py-5">Hành trình</th>
              ) : (
                <th className="px-8 py-5">Khu vực / Check-in</th>
              )}
              <th className="px-8 py-5">Ngày tạo</th>
              <th className="px-8 py-5">Tổng tiền</th>
              <th className="px-8 py-5">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-7">
                    <div className="h-5 bg-gray-100 rounded-full w-full"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-red-500">
                    <AlertCircle size={40} className="opacity-20" />
                    <p className="font-bold">Lỗi lấy danh sách đơn hàng</p>
                  </div>
                </td>
              </tr>
            ) : orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-6 font-mono font-bold text-blue-600 text-xs">
                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                  </td>
                  <td
                    className={`px-8 py-6 font-black ${filterType === "bus" ? "text-gray-900" : "text-gray-900"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${filterType === "bus" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
                      >
                        {filterType === "bus" ? (
                          <Bus size={14} />
                        ) : (
                          <Home size={14} />
                        )}
                      </div>
                      {order.brand}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-600">
                    {filterType === "bus" ? (
                      <div className="flex items-center gap-2 font-medium">
                        <span>{order.fromLocation}</span>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span>{order.toLocation}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">
                          {order.propertyLocation || "?"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                          In:{" "}
                          {order.checkInDate
                            ? new Date(order.checkInDate).toLocaleDateString(
                                "vi-VN",
                              )
                            : "?"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900 text-base">
                    {formatCurrency(order.priceTicket)}
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={order.status || "pending"} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center gap-5 text-gray-300">
                    <div className="p-6 bg-gray-50 rounded-full">
                      {filterType === "bus" ? (
                        <Bus size={48} className="opacity-20" />
                      ) : (
                        <Home size={48} className="opacity-20" />
                      )}
                    </div>
                    <p className="font-bold text-gray-400">
                      Bạn chưa có đơn{" "}
                      {filterType === "bus" ? "xe khách" : "homestay"} nào.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Info */}
      {!isLoading && orders.length > 0 && (
        <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Trạng thái: Tự động cập nhật</span>
          <span>
            Trang {currentPage} / {meta?.totalPage || 1}
          </span>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 py-8 border-t border-gray-50 bg-white">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-11 h-11 rounded-2xl border border-gray-200 bg-white text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto px-2">
            {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(
              (page) => {
                if (
                  page === 1 ||
                  page === meta.totalPage ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center w-11 h-11 min-w-[44px] rounded-2xl border font-black text-sm transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25 scale-110"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
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
                    <span
                      key={`dots-${page}`}
                      className="flex items-center justify-center w-11 h-11 text-gray-300 font-black"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              },
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, meta.totalPage))
            }
            disabled={currentPage === meta.totalPage}
            className="flex items-center justify-center w-11 h-11 rounded-2xl border border-gray-200 bg-white text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    approved: "Đã duyệt",
    completed: "Hoàn tất",
    pending: "Chờ duyệt",
    rejected: "Từ chối",
    cancelled: "Đã huỷ",
  };

  const dotColor: Record<string, string> = {
    approved: "bg-green-500 ",
    completed: "bg-green-500 ",
    pending: "bg-yellow-500 ",
    rejected: "bg-red-500 ",
    cancelled: "bg-red-500 ",
  };

  return (
    <span className={`px-4 py-1.5 text-[10px] uppercase `}>
      <div className="flex items-center gap-1.5">
        <div
          className={`w-1.5 h-1.5 rounded-full ${dotColor[status] || dotColor.pending}`}
        ></div>
        {labels[status] || status}
      </div>
    </span>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
