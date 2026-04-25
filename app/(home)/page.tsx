"use client";

import React, { Suspense } from "react";
import FiltersForm from "./components/filters-form";
import PromoSlider from "./components/promo-slider";
import BusCard from "./components/bus-card";
import HomestayCard from "./components/homestay-card";
import BottomAdStack from "../components/BottomAdStack";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Bus, Home, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { usePublicOrders } from "@/app/hooks/api/useOrders";

const HomePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const serviceType = searchParams.get("serviceType") || "bus";

  // Build params with defaults for initial load
  const apiParams = new URLSearchParams(searchParams.toString());
  if (!apiParams.has("serviceType")) {
    apiParams.set("serviceType", "bus");
  }

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const todayStr = `${y}-${m}-${d}`;

  if (serviceType === "bus" && !apiParams.has("fromDate")) {
    apiParams.set("fromDate", todayStr);
  } else if (serviceType === "homestay" && !apiParams.has("checkInDate")) {
    apiParams.set("checkInDate", todayStr);
  }

  const { data, isLoading, error } = usePublicOrders(apiParams);

  const orders = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.totalPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-5">
      <FiltersForm />

      {/* Results Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {serviceType === "bus" ? (
            <Bus size={18} className="text-[#1E3A5F]" />
          ) : (
            <Home size={18} className="text-[#1E3A5F]" />
          )}
          <h2 className="text-lg font-bold text-[#1E3A5F]">
            {serviceType === "bus" ? "Chuyến xe hiện có" : "Homestay nổi bật"}
          </h2>
        </div>
        {meta && (
          <span className="text-xs text-[#94A3B8] font-medium bg-[#F8FAFF] border border-[#E2E8F0] px-3 py-1.5 rounded-lg">
            {meta.totalRecords || orders.length} kết quả
          </span>
        )}
      </div>

      {/* Loading State - Shimmer */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shimmer rounded-2xl h-44 w-full border border-[#E2E8F0]"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#EF4444]/20">
          <div className="w-12 h-12 mx-auto bg-[#EF4444]/10 rounded-full flex items-center justify-center mb-3">
            <SearchX size={24} className="text-[#EF4444]" />
          </div>
          <p className="text-[#EF4444] font-semibold">
            {error.message || "Đã xảy ra lỗi, vui lòng thử lại"}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0]">
          <div className="w-16 h-16 mx-auto bg-[#F8FAFF] rounded-2xl flex items-center justify-center mb-4 border border-[#E2E8F0]">
            <SearchX size={28} className="text-[#94A3B8]" />
          </div>
          <h3 className="text-base font-bold text-[#1E3A5F]">
            Không tìm thấy {serviceType === "bus" ? "chuyến xe" : "Homestay"}{" "}
            nào
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1.5">
            Vui lòng thử thay đổi bộ lọc tìm kiếm.
          </p>
        </div>
      )}

      {/* Render Orders with stagger animation */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-4">
          {orders.map((order: any, index: number) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              {serviceType === "bus" ? (
                <BusCard order={order} />
              ) : (
                <HomestayCard order={order} />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4 mb-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFF] hover:border-[#CBD5E1] transition-all font-medium cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>

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
                    onClick={() => handlePageChange(page)}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-md shadow-[#1E3A5F]/20"
                        : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFF] hover:border-[#CBD5E1]"
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
                    className="flex items-center justify-center w-8 h-10 text-[#94A3B8] font-medium text-sm"
                  >
                    ···
                  </span>
                );
              }

              return null;
            },
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === meta.totalPage}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFF] hover:border-[#CBD5E1] transition-all font-medium cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Bottom Ads Mobile */}
      <BottomAdStack />
    </div>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-5">
          <div className="shimmer rounded-2xl h-64 w-full" />
          <div className="shimmer rounded-2xl h-44 w-full" />
          <div className="shimmer rounded-2xl h-44 w-full" />
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
