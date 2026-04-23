import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/app/lib/axios';

// ─── Types ───
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  stars: number;
  isBlocked: boolean;
  blockReason?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: UserProfile;
  message?: string;
}

interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

// ─── Queries ───

/** Lấy thông tin user hiện tại (GET /auth/me) */
export function useUserProfile(options?: { enabled?: boolean; retry?: boolean | number }) {
  return useQuery<ProfileResponse>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await api.get<ProfileResponse>('/auth/me');
      return data;
    },
    retry: options?.retry ?? false,
    enabled: options?.enabled ?? true,
  });
}

// ─── Mutations ───

/** Đăng nhập bằng Google (POST /auth/google) */
export function useGoogleLogin() {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: async (credential: string) => {
      const { data } = await api.post<AuthResponse>('/auth/google', { credential });
      return data;
    },
  });
}

// ─── Helpers ───

/** Gọi API /auth/me rồi cập nhật localStorage + dispatch event cho Header */
export async function refreshUserData(): Promise<UserProfile | null> {
  try {
    const { data } = await api.get<ProfileResponse>('/auth/me');
    if (data.success && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('userUpdated'));
      return data.user;
    }
    return null;
  } catch {
    return null;
  }
}
