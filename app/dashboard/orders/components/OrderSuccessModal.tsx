"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
  remainingStars?: number;
  orderType: "bus" | "homestay";
};

export default function OrderSuccessModal({
  open,
  onClose,
  remainingStars,
  orderType,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            {/* Header gradient */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 px-8 pt-10 pb-8 text-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)]" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4"
              >
                <CheckCircle size={44} className="text-white" strokeWidth={2.5} />
              </motion.div>
              <h2 className="text-white text-xl font-bold">
                Tạo đơn hàng thành công!
              </h2>
            </div>

            {/* Content */}
            <div className="px-8 pt-5 pb-8">
              {/* Star info card */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Star size={20} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-800">
                      Đã trừ 10 ⭐
                    </p>
                    {remainingStars !== undefined && (
                      <p className="text-xs text-amber-600 mt-0.5">
                        Số dư còn lại: <span className="font-bold">{remainingStars} ⭐</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Wait info card */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-800">
                      Chờ xét duyệt
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      Đơn hàng sẽ được duyệt trong <span className="font-bold">30 giây - 1 phút</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard/orders"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98]"
                  onClick={onClose}
                >
                  Xem danh sách đơn hàng
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-gray-500 font-semibold text-sm hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Tiếp tục tạo đơn {orderType === "bus" ? "vé xe" : "homestay"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
