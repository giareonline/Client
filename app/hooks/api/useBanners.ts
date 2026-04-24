import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useBanners = (position?: string) => {
  return useQuery({
    queryKey: ['banners', position],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('isActive', 'true');
      if (position) {
        params.append('position', position);
      }
      const response = await axios.get(`${API_URL}/banners?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
