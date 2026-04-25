"use client";

import React, { useState, useEffect, useRef } from "react";
import Card from "../../components/Card";
import Button from "@/app/ui/button";
import { useAlert } from "@/app/components/AlertContext";
import { 
    CreditCard, 
    Star, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    History, 
    Clock, 
    CheckCircle, 
    XCircle,
    Wallet,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { usePaymentHistory, usePaymentStatus, useCreateDeposit, useSimulatePayment } from "@/app/hooks/api/usePayments";
import { refreshUserData } from "@/app/hooks/api/useAuth";

const AMOUNTS = [
 
  { label: "10.000đ", value: 10000, stars: 10 },
  { label: "100.000đ", value: 100000, stars: 100 },
  { label: "200.000đ", value: 200000, stars: 200 },
  { label: "500.000đ", value: 500000, stars: 500 },
  { label: "1.000.000đ", value: 1000000, stars: 1000 },
];

type TabType = "deposit" | "history";

export default function DepositPage() {
  const [activeTab, setActiveTab] = useState<TabType>("deposit");
  const [selectedAmount, setSelectedAmount] = useState(AMOUNTS[0]);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [qrTimeLeft, setQrTimeLeft] = useState(120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const alert = useAlert();

  // QR countdown timer
  useEffect(() => {
    if (paymentData) {
      setQrTimeLeft(120);
      timerRef.current = setInterval(() => {
        setQrTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setPaymentData(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paymentData?.paymentId]);

  // ─── React Query Hooks ───
  const { data: historyData, isLoading: isHistoryLoading } = usePaymentHistory(currentPage);
  const { data: statusData } = usePaymentStatus(paymentData?.paymentId ?? null);
  const depositMutation = useCreateDeposit();
  const simulateMutation = useSimulatePayment();

  // Handle success when polling detects completed status
  React.useEffect(() => {
    if (statusData?.status === 'completed' && paymentData) {
        const handleSuccess = async () => {
            await refreshUserData();
            queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
            alert.success(`🎉 Nạp ${paymentData?.transaction?.stars || ''} sao thành công! Số dư đã được cập nhật.`);
            setPaymentData(null);
            setActiveTab("history");
        };
        handleSuccess();
    }
  }, [statusData, paymentData, queryClient, alert]);

  const handleDeposit = () => {
    depositMutation.mutate(selectedAmount.value, {
      onSuccess: (data) => {
        setPaymentData(data.data);
      },
    });
  };

//   const simulateSuccess = async () => {
//     if (!paymentData) return;
//     simulateMutation.mutate(paymentData.paymentId, {
//       onSuccess: async () => {
//         await refreshUserData();
//         alert.success(`🎉 Nạp sao thành công! Số dư đã được cập nhật.`);
//         setPaymentData(null);
//         setActiveTab("history");
//       },
//       onError: () => {
//         alert.error("Lỗi khi giả lập nạp tiền");
//       },
//     });
//   };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase w-fit"><CheckCircle size={10} /> Thành công</span>;
      case "failed":
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase w-fit"><XCircle size={10} /> Thất bại</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase w-fit"><Clock size={10} /> Đang chờ</span>;
    }
  };

  const pagination = historyData?.pagination;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Nạp Sao</h2>
          <p className="text-gray-500 mt-2 text-lg">Nạp sao để sử dụng các dịch vụ cao cấp trên Giareonline.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-fit self-start md:self-end">
            <button
                onClick={() => setActiveTab("deposit")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-semibold whitespace-nowrap ${
                    activeTab === "deposit"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                }`}
            >
                <Wallet size={18} />
                Nạp tiền
            </button>
            <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-semibold whitespace-nowrap ${
                    activeTab === "history"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                }`}
            >
                <History size={18} />
                Lịch sử
            </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === "deposit" ? (
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                {/* Left: Amount Selection */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-500/5 p-0 overflow-hidden">
                        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-50 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <CreditCard size={20} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-800 tracking-tight">Chọn mệnh giá</h3>
                        </div>
                        <div className="p-5 sm:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-5 text-center">
                                {AMOUNTS.map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => {
                                            setSelectedAmount(item);
                                            setPaymentData(null);
                                        }}
                                        className={`w-full p-4 sm:p-6 rounded-[24px] border-2 transition-all group relative overflow-hidden ${
                                            selectedAmount.value === item.value
                                                ? "border-blue-500 bg-blue-50/20 shadow-lg shadow-blue-500/10"
                                                : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`text-2xl font-black ${selectedAmount.value === item.value ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {item.label}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-blue-500/80 font-bold bg-blue-50/50 px-3 py-1 rounded-full text-sm">
                                                <Star size={14} fill="currentColor" />
                                                <span>Nhận {item.stars} sao</span>
                                            </div>
                                        </div>
                                        {selectedAmount.value === item.value && (
                                            <div className="absolute top-4 right-4 text-blue-600 bg-white rounded-full p-0.5 shadow-md">
                                                <CheckCircle2 size={22} fill="currentColor" className="text-blue-600 fill-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-10 p-5 bg-yellow-50/50 rounded-2xl border border-yellow-100/50 flex gap-4 ring-1 ring-yellow-200/50">
                                <Star className="text-yellow-500 shrink-0" size={24} fill="currentColor" />
                                <div className="text-gray-700 leading-relaxed">
                                    <span className="font-bold text-gray-900 block mb-1">Quy tắc nạp:</span>
                                    <p className="text-sm">Tỷ lệ chuyển đổi: <span className="font-bold text-blue-600">1.000 VNĐ = 1 Sao</span>. 
                                    Sao sẽ được cộng ngay sau khi giao dịch thành công.</p>
                                </div>
                            </div>

                            {!paymentData && (
                                <Button
                                    onClick={handleDeposit}
                                    disabled={depositMutation.isPending}
                                    className="w-full h-16 mt-10 text-xl font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-transform"
                                >
                                    {depositMutation.isPending ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            Đang khởi tạo...
                                        </div>
                                    ) : (
                                        "TIẾP TỤC NẠP NGAY"
                                    )}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right: QR or Instructions */}
                <div className="space-y-8">
                    {paymentData ? (
                        <Card className="border-none shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 ring-4 ring-blue-500/10 p-0">
                            <div className="p-5 sm:p-8 text-center space-y-6">
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 text-xl tracking-tight uppercase">Quét mã thanh toán</h4>
                                    <p className={`text-sm font-medium ${qrTimeLeft <= 30 ? 'text-red-500' : 'text-gray-500'}`}>
                                      Hết hạn sau {Math.floor(qrTimeLeft / 60)}:{String(qrTimeLeft % 60).padStart(2, '0')}
                                    </p>
                                </div>
                                
                                <div className="relative w-full aspect-square bg-white rounded-3xl border-2 border-dashed border-gray-100 p-4 shadow-inner group">
                                    <Image 
                                        src={paymentData.qrUrl} 
                                        alt="Payment QR" 
                                        fill 
                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none rounded-3xl"></div>
                                </div>

                                <div className="space-y-3 bg-gray-50/80 p-5 rounded-2xl">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Mã giao dịch</span>
                                        <span className="font-black text-blue-700 font-mono tracking-tighter">{paymentData.paymentId}</span>
                                    </div>
                                    <div className="w-full h-px bg-gray-200"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-medium">Số tiền nạp</span>
                                        <span className="font-black text-gray-900 text-lg">{selectedAmount.label}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-xs text-blue-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <p className="text-left font-medium leading-relaxed">Dùng ứng dụng ngân hàng quét mã và <span className="underline font-bold">giữ nguyên</span> nội dung chuyển khoản.</p>
                                </div>
                                
                                {/* <button 
                                    onClick={simulateSuccess}
                                    disabled={simulateMutation.isPending}
                                    className="w-full py-2 text-[10px] text-gray-300 hover:text-blue-400 font-bold uppercase tracking-widest transition-colors"
                                >
                                    {simulateMutation.isPending ? "Đang xử lý..." : "[ DEV: Bấm để giả lập thành công ]"}
                                </button> */}
                            </div>
                        </Card>
                    ) : (
                        <Card className="border-none shadow-xl bg-gradient-to-br from-white to-gray-50/50 p-0">
                            <div className="p-5 sm:p-8">
                                <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                    Hướng dẫn nạp
                                </h4>
                                <ul className="space-y-6">
                                    {[
                                        "Chọn gói sao bạn muốn nạp vào tài khoản. Tỷ lệ Star cực kỳ ưu đãi.",
                                        "Bấm 'Tiếp tục nạp ngay' để lấy mã QR thanh toán cá nhân.",
                                        "Sử dụng bất kỳ app Ngân hàng hoặc Ví điện tử nào để quét QR."
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-black shrink-0 shadow-lg shadow-blue-600/20">
                                                {i + 1}
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium pt-1">
                                                {step}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-10 pt-8 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 italic text-center">Hệ thống xử lý tự động 24/7</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <Card className="border-none shadow-2xl overflow-hidden p-0">
                    <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-50 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <History size={20} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-800 tracking-tight">Lịch sử giao dịch</h3>
                        </div>
                        <div className="text-sm text-gray-400 italic hidden sm:block">Hiển thị 10 giao dịch mỗi trang</div>
                    </div>
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                                        <th className="px-8 py-5">Mã Giao Dịch</th>
                                        <th className="px-8 py-5 text-right">Mệnh giá</th>
                                        <th className="px-8 py-5 text-center">Số lượng Sao</th>
                                        <th className="px-8 py-5">Trạng thái</th>
                                        <th className="px-8 py-5 text-right">Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isHistoryLoading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={5} className="px-8 py-6">
                                                    <div className="h-5 bg-gray-100 rounded-full w-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : historyData?.data?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4 text-gray-300">
                                                    <History size={64} className="opacity-20" />
                                                    <p className="text-gray-400 font-medium font-lg">Bạn chưa có giao dịch nạp sao nào</p>
                                                    <button 
                                                        onClick={() => setActiveTab("deposit")}
                                                        className="text-blue-600 font-bold hover:underline"
                                                    >
                                                        Nạp sao ngay bây giờ →
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        historyData?.data?.map((tx: any) => (
                                            <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-6 font-mono text-xs text-blue-600 font-bold tracking-tight">
                                                    {tx.paymentId}
                                                </td>
                                                <td className="px-8 py-6 text-right font-black text-gray-900">
                                                    {formatCurrency(tx.amount)}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="inline-flex items-center gap-1.5 font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">
                                                        <Star size={12} fill="currentColor" />
                                                        {tx.stars}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {getStatusBadge(tx.status)}
                                                </td>
                                                <td className="px-8 py-6 text-right text-gray-400 text-sm font-medium">
                                                    {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                                                    <span className="block text-[10px] text-gray-300">
                                                        {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>

                {/* Pagination Controls */}
                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="flex items-center gap-1 overflow-x-auto px-2">
                            {[...Array(pagination.pages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 min-w-[40px] rounded-xl font-bold transition-all ${
                                        currentPage === i + 1
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                            disabled={currentPage === pagination.pages}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
