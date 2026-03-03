"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "#ORD001",
    customer: "Nguyễn Văn A",
    date: "03/03/2026",
    total: "2.500.000đ",
    status: "completed",
  },
  {
    id: "#ORD002",
    customer: "Trần Thị B",
    date: "02/03/2026",
    total: "1.200.000đ",
    status: "pending",
  },
  {
    id: "#ORD003",
    customer: "Lê Văn C",
    date: "01/03/2026",
    total: "950.000đ",
    status: "cancelled",
  },
];

export default function OrderTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Danh sách đơn hàng
        </h2>

        <Link
          href="/dashboard/orders/bus"
          className="flex items-center gap-2 
    bg-blue-600 hover:bg-blue-700 
    text-white text-sm font-medium 
    px-3 md:px-4 py-2 rounded-xl 
    transition-all duration-200"
        >
          <Plus size={18} />
          <span className="hidden md:inline">Tạo đơn hàng</span>
        </Link>
      </div>
      {/* Table wrapper (responsive) */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Ngày</th>
              <th className="px-6 py-4">Tổng tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600">{order.date}</td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {order.total}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline text-sm">
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-600",
  };

  const labels: Record<string, string> = {
    completed: "Hoàn thành",
    pending: "Đang xử lý",
    cancelled: "Đã huỷ",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
