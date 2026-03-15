"use client";

import React from "react";
import FiltersForm from "./components/filters-form";
import BusCard from "./components/bus-card";
import BottomAdStack from "../components/BottomAdStack";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Fetcher Function
const fetchBuses = async (searchParams: URLSearchParams) => {
  const query = searchParams.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders/bus/all?${query}`);
  if (!res.ok) {
    throw new Error("Lỗi tải danh sách chuyến xe");
  }
  return res.json();
};

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Current Page
  const currentPage = parseInt(searchParams.get("page") || "1");

  const { data, isLoading, error } = useQuery({
    queryKey: ["allBuses", searchParams.toString()],
    queryFn: () => fetchBuses(searchParams),
  });

  const orders = data?.data || [];
  const meta = data?.meta; // { totalRecords, totalPage, currentPage, limit }

  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.totalPage) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3">
      <FiltersForm />

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col gap-4 mt-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-48 w-full"></div>
            ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-10 bg-white rounded-2xl border border-red-100 text-red-500 mt-2">
           {error.message || "Đã xảy ra lỗi, vui lòng thử lại"}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
         <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-2">
            <h3 className="text-lg font-semibold text-gray-700">Không tìm thấy chuyến xe nào</h3>
            <p className="text-gray-500 mt-1">Vui lòng thử thay đổi bộ lọc tìm kiếm.</p>
         </div>
      )}

      {/* Render Buses */}
      {!isLoading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            {orders.map((order: any) => (
                <BusCard key={order._id} order={order} />
            ))}
          </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6 mb-4">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-medium"
              >
                  <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((page) => {
                  // Hiển thị: Trang đầu, trang cuối, trang hiện tại, và +- 1 trang cạnh trang hiện tại
                  if (
                    page === 1 ||
                    page === meta.totalPage ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border font-semibold text-sm transition-colors ${
                          currentPage === page
                            ? "bg-[#3B82F6] text-white border-[#3B82F6]" // Active state
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900" // Inactive state
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  // Hiển thị dấy "...": Chỉ render 1 cái ở mỗi bên nếu khoảng cách đủ xa
                  if (
                    (page === currentPage - 2 && page > 1) ||
                    (page === currentPage + 2 && page < meta.totalPage)
                  ) {
                    return (
                      <span key={`dots-${page}`} className="flex items-center justify-center w-10 h-10 text-gray-500 font-medium">
                        ...
                      </span>
                    );
                  }

                  return null;
              })}

              <button 
                 onClick={() => handlePageChange(currentPage + 1)}
                 disabled={currentPage === meta.totalPage}
                 className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-medium"
              >
                  <ChevronRight size={20} />
              </button>
          </div>
      )}

      {/* Bottom Ads Mobile */}
      <BottomAdStack />
    </div>
  );
};

export default Home;
