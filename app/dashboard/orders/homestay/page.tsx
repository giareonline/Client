"use client";

import { useState } from "react";
import {
  ChevronLeft,
  CalendarClock,
  CreditCard,
  Building,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "@/app/components/hook-form";
import { PROVINCE_OPTIONS } from "@/app/utils/provinces";
import Button from "@/app/ui/button";
import { useAlert } from "@/app/components/AlertContext";
import OrderSuccessModal from "../components/OrderSuccessModal";
import ImageUploader from "../components/ImageUploader";
import Card from "@/app/components/Card";
import { useUserProfile } from "@/app/hooks/api/useAuth";
import { useCreateHomestayOrder } from "@/app/hooks/api/useOrders";

const schema = zod.object({
  propertyLocation: zod.string().min(1, "Khu vực là bắt buộc"),
  checkInDate: zod
    .any()
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Ngày nhận phòng là bắt buộc",
    }),
  brand: zod.string().min(1, "Tên Homestay là bắt buộc"),
  phone: zod.string().min(10, "Số điện thoại không hợp lệ"),
  priceTicket: zod.string().min(1, "Giá tiền là bắt buộc"),
  amenities: zod.array(zod.string()).optional(),
  listTop: zod.string().optional(),
  duration: zod.string().optional(),
});

type SchemaType = zod.infer<typeof schema>;

export default function HomestayPage() {
  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyLocation: "",
      checkInDate: undefined,
      brand: "",
      phone: "",
      priceTicket: "",
      amenities: [],
      listTop: "",
      duration: "1",
    },
  });
  const { handleSubmit, reset } = methods;
  const { error: showError } = useAlert();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [remainingStars, setRemainingStars] = useState<number | undefined>();
  const [deductedStars, setDeductedStars] = useState<number | undefined>();
  const [images, setImages] = useState<string[]>([]);

  // ─── React Query Hooks ───
  const { data: profileData } = useUserProfile();
  const userStars = profileData?.user?.stars ?? 0;

  const mutation = useCreateHomestayOrder();

  const { watch } = methods;
  const listTop = watch("listTop");
  const duration = watch("duration") || "1";

  let adCost = 0;
  if (listTop === "hot") adCost = 5;
  if (listTop === "niceRoom") adCost = 10;

  const durationMultiplier = parseInt(duration, 10);
  const durationCost = durationMultiplier * 10;
  const requiredStars = durationCost + adCost;

  const hasEnoughStars = userStars >= requiredStars;

  const onSubmit = (data: SchemaType) => {
    if (images.length === 0) {
      showError("Hình ảnh homestay là bắt buộc");
      return;
    }

    const formattedData = {
      ...data,
      images,
      checkInDate:
        data.checkInDate instanceof Date
          ? data.checkInDate.toISOString()
          : data.checkInDate,
    };

    mutation.mutate(formattedData, {
      onSuccess: (responseData) => {
        setRemainingStars(responseData.remainingStars);
        setDeductedStars(responseData.deductedStars);
        setShowSuccessModal(true);
        reset();
        setImages([]);
      },
      onError: (err) => {
        showError(err.message || "Đã xảy ra lỗi khi tạo đặt phòng");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Tạo đơn Homestay mới
          </h2>
          <p className="text-gray-500 mt-1">
            Nhập thông tin chi tiết để tạo hóa đơn đặt phòng Homestay.
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Quay lại</span>
        </Link>
      </div>

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Section 1: Thông tin cơ bản */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <Building size={18} className="text-blue-500" />
              <h3 className="font-semibold text-gray-800">Thông tin cơ sở</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field.Text
                  name="brand"
                  label={{ text: "Tên Homestay/Villa", icon: "*" }}
                />

                <Field.Select
                  name="propertyLocation"
                  label={{ text: "Khu vực", icon: "*" }}
                  options={[...PROVINCE_OPTIONS]}
                  searchable
                />

                <Field.Text
                  name="phone"
                  label={{ text: "Số điện thoại liên hệ", icon: "*" }}
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Lịch trình */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <CalendarClock size={18} className="text-purple-500" />
              <h3 className="font-semibold text-gray-800">Thời gian lưu trú</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ngày nhận phòng */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="w-1.5 h-12 bg-purple-500 rounded-full shrink-0" />
                    <div className="flex-1">
                      <Field.DatePicker
                        name="checkInDate"
                        label={{ text: "Ngày nhận phòng", icon: "*" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Giá & Tiện ích */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <CreditCard size={18} className="text-green-500" />
              <h3 className="font-semibold text-gray-800">
                Thanh toán & Chi tiết
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Field.Text
                    name="priceTicket"
                    label={{ text: "Giá phòng/Đêm (VNĐ)", icon: "*" }}
                  />
                </div>
                <div>
                  <Field.MultiSelect
                    name="amenities"
                    label={{ text: "Tiện ích nổi bật" }}
                    options={[
                      { label: "Hồ bơi riêng", value: "Hồ bơi riêng" },
                      { label: "BBQ nướng", value: "BBQ nướng" },
                      { label: "Miễn phí ăn sáng", value: "Miễn phí ăn sáng" },
                      {
                        label: "Thiết kế sân vườn",
                        value: "Thiết kế sân vườn",
                      },
                    ]}
                    placeholder="Chọn tiện ích..."
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
              <Field.Select
                name="listTop"
                label={{ text: "Quảng cáo" }}
                options={[
                  { value: "hot", label: "Hot (+5 ⭐)" },
                  { value: "niceRoom", label: "Phòng đẹp (+10 ⭐)" },
                ]}
              />
              <Field.Select
                name="duration"
                label={{ text: "Thời gian hiển thị" }}
                options={[
                  { value: "1", label: `1 ngày (${10} ⭐)` },
                  { value: "7", label: `7 ngày (${70} ⭐)` },
                  { value: "30", label: `1 tháng (${300} ⭐)` },
                ]}
              />
            </div>
          </Card>
          {/* Image upload */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Hình ảnh homestay <span className="text-red-500">*</span>
            </h3>
            <ImageUploader value={images} onChange={setImages} maxFiles={4} />
          </Card>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-3 mt-8">
          <Button
            type="submit"
            disabled={mutation.isPending || !hasEnoughStars}
            className={`flex items-center justify-center gap-2 w-full ${mutation.isPending || !hasEnoughStars ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {mutation.isPending ? (
              "Đang xử lý..."
            ) : (
              <>
                Xác nhận tạo phòng
                <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                  <Star size={12} className="fill-current" />
                  {requiredStars} sao
                </span>
              </>
            )}
          </Button>
          {!hasEnoughStars && (
            <p className="text-center text-sm text-red-500 font-semibold">
              ⚠️ Bạn chỉ có {userStars} ⭐ — cần tối thiểu {requiredStars} ⭐ để
              tạo đơn
            </p>
          )}
        </div>
      </Form>

      <OrderSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        remainingStars={remainingStars}
        deductedStars={deductedStars}
        orderType="homestay"
      />
    </div>
  );
}
