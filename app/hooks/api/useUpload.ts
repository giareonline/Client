import { useMutation } from '@tanstack/react-query';
import api from '@/app/lib/axios';

interface UploadResponse {
  success: boolean;
  data: string[]; // array of uploaded image URLs
}

/** Upload ảnh lên Cloudinary (POST /upload) */
export function useUploadImages() {
  return useMutation<UploadResponse, Error, File[]>({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const { data } = await api.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // Upload có thể chậm, tăng timeout lên 60s
      });
      return data;
    },
  });
}
