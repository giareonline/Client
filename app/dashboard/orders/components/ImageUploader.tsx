"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Loader2, Star } from "lucide-react";
import Image from "next/image";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
};

export default function ImageUploader({
  value = [],
  onChange,
  maxFiles = 4,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE = 1 * 1024 * 1024; // 1MB

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxFiles - value.length;
    if (remaining <= 0) return;

    const selected = Array.from(files).slice(0, remaining);

    // Validate file type
    const invalidType = selected.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalidType) {
      alert(`File "${invalidType.name}" không phải định dạng ảnh hợp lệ.\nChỉ chấp nhận: JPG, PNG, WebP, GIF`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Validate file size
    const tooBig = selected.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      alert(`File "${tooBig.name}" vượt quá 1MB (${(tooBig.size / 1024 / 1024).toFixed(1)}MB).\nVui lòng chọn ảnh nhỏ hơn 1MB.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const filesToUpload = selected;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      filesToUpload.forEach((file) => formData.append("images", file));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.success) {
        onChange([...value, ...data.data]);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* Note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Star size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">
          <span className="font-bold">Lưu ý:</span> Ảnh đầu tiên sẽ được dùng
          làm ảnh đại diện (background) khi hiển thị ở danh sách. Tối đa{" "}
          {maxFiles} ảnh. Chỉ chấp nhận <span className="font-bold">JPG, PNG, WebP, GIF</span> — tối đa <span className="font-bold">1MB</span>/ảnh.
        </p>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {value.map((url, idx) => (
          <div
            key={url}
            className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 group ${
              idx === 0
                ? "border-amber-400 shadow-md shadow-amber-100"
                : "border-gray-200"
            }`}
          >
            <Image
              src={url}
              alt={`Ảnh ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            {/* Badge for first image */}
            {idx === 0 && (
              <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                Ảnh đại diện
              </div>
            )}
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Upload button */}
        {value.length < maxFiles && (
          <label
            className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              uploading
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={24} className="text-gray-400 animate-spin" />
                <span className="text-xs text-gray-400">Đang tải...</span>
              </>
            ) : (
              <>
                <ImagePlus size={24} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">
                  Thêm ảnh ({value.length}/{maxFiles})
                </span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
