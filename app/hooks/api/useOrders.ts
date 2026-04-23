import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/app/lib/axios';

// ─── Types ───
interface OrderMeta {
  totalRecords: number;
  totalPage: number;
  currentPage: number;
  limit: number;
}

interface OrdersResponse {
  data: any[];
  meta: OrderMeta;
}

interface CreateOrderResponse {
  success: boolean;
  remainingStars: number;
  deductedStars: number;
  data: any;
}

// ─── Queries ───

/** Lấy đơn hàng của user (GET /orders/:type) — cần auth */
export function useMyOrders(type: 'bus' | 'homestay', page: number = 1) {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', type, page],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${type}`, {
        params: { page, limit: 10 },
      });
      return { data: data.data, meta: data.meta };
    },
  });
}

/** Lấy danh sách đơn hàng công khai cho trang chủ (không cần auth) */
export function usePublicOrders(searchParams: URLSearchParams) {
  const serviceType = searchParams.get('serviceType') || 'bus';
  const endpoint = serviceType === 'bus' ? '/orders/bus/all' : '/homestays';
  const query = searchParams.toString();

  return useQuery({
    queryKey: ['allOrders', query],
    queryFn: async () => {
      const { data } = await api.get(`${endpoint}?${query}`);
      return data;
    },
  });
}

// ─── Mutations ───

/** Tạo đơn vé xe (POST /orders/bus) */
export function useCreateBusOrder() {
  return useMutation<CreateOrderResponse, Error, any>({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post<CreateOrderResponse>('/orders/bus', orderData);
      return data;
    },
  });
}

/** Tạo đơn Homestay (POST /orders/homestay) */
export function useCreateHomestayOrder() {
  return useMutation<CreateOrderResponse, Error, any>({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post<CreateOrderResponse>('/orders/homestay', orderData);
      return data;
    },
  });
}
