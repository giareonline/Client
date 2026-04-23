import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/axios';

// ─── Types ───
interface Transaction {
  _id: string;
  paymentId: string;
  amount: number;
  stars: number;
  status: 'pending' | 'completed' | 'failed';
  referenceCode?: string;
  createdAt: string;
}

interface HistoryResponse {
  success: boolean;
  data: Transaction[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

interface DepositResponse {
  success: boolean;
  data: {
    transaction: Transaction;
    qrUrl: string;
    paymentId: string;
  };
}

interface PaymentStatusResponse {
  success: boolean;
  status: string;
  stars: number;
}

// ─── Queries ───

/** Lấy lịch sử giao dịch (GET /payments/history) */
export function usePaymentHistory(page: number = 1, limit: number = 10) {
  return useQuery<HistoryResponse>({
    queryKey: ['paymentHistory', page],
    queryFn: async () => {
      const { data } = await api.get<HistoryResponse>('/payments/history', {
        params: { page, limit },
      });
      return data;
    },
  });
}

/** Polling trạng thái thanh toán (GET /payments/status/:paymentId) */
export function usePaymentStatus(paymentId: string | null) {
  return useQuery<PaymentStatusResponse | null>({
    queryKey: ['paymentStatus', paymentId],
    queryFn: async () => {
      if (!paymentId) return null;
      const { data } = await api.get<PaymentStatusResponse>(`/payments/status/${paymentId}`);
      return data;
    },
    enabled: !!paymentId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'completed') return false;
      return 3000; // Poll mỗi 3 giây
    },
  });
}

// ─── Mutations ───

/** Tạo yêu cầu nạp tiền (POST /payments/deposit) */
export function useCreateDeposit() {
  const queryClient = useQueryClient();

  return useMutation<DepositResponse, Error, number>({
    mutationFn: async (amount: number) => {
      const { data } = await api.post<DepositResponse>('/payments/deposit', { amount });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
  });
}

/** Giả lập thanh toán thành công — DEV only (POST /payments/webhook) */
export function useSimulatePayment() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (paymentId: string) => {
      const { data } = await api.post('/payments/webhook', {
        paymentId,
        status: 'success',
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
  });
}
