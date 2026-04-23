import { useMutation } from '@tanstack/react-query';
import api from '@/app/lib/axios';

interface TrackPageViewPayload {
  path: string;
  sessionId: string;
  referrer: string;
  userId: string | null;
}

/** Ghi nhận lượt xem trang (POST /tracking/pageview) — fire-and-forget */
export function useTrackPageView() {
  return useMutation<void, Error, TrackPageViewPayload>({
    mutationFn: async (payload) => {
      await api.post('/tracking/pageview', payload);
    },
    // Fire-and-forget: không hiển thị lỗi tracking cho user
    onError: (error) => {
      console.error('Tracking error:', error);
    },
  });
}
