"use client";

import { ChevronLeft, CalendarClock, CreditCard, Building } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Form } from "@/app/components/hook-form";
import Button from "@/app/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/components/AlertContext";
import Card from "@/app/components/Card";

const schema = zod.object({
  propertyLocation: zod.string().min(1, "Khu vực là bắt buộc"),
  checkInDate: zod.any().refine((val) => val !== null && val !== undefined && val !== "", {
    message: "Ngày nhận phòng là bắt buộc",
  }),
  brand: zod.string().min(1, "Tên Homestay là bắt buộc"),
  phone: zod.string().min(10, "Số điện thoại không hợp lệ"),
  priceTicket: zod.string().min(1, "Giá tiền là bắt buộc"),
  amenities: zod.array(zod.string()).optional(),
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
    },
  });
  const { handleSubmit, reset } = methods;
  const router = useRouter();
  const { success, error: showError } = useAlert();

  const mutation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const token = localStorage.getItem("token");

      // Format Date if they are Date objects
      const formattedData = {
        ...data,
        checkInDate: data.checkInDate instanceof Date ? data.checkInDate.toISOString() : data.checkInDate,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/orders/homestay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Tạo đơn hàng thất bại");
      }
      return res.json();
    },
    onSuccess: () => {
      success("Tạo đơn đặt phòng Homestay thành công!");
      reset(); // Reset form
      setTimeout(() => {
        router.push("/dashboard/orders"); // Điều hướng về Order list
      }, 1500)
    },
    onError: (err: any) => {
      showError(err.message || "Đã xảy ra lỗi khi tạo đặt phòng");
    }
  });

  const onSubmit = (data: SchemaType) => {
    mutation.mutate(data);
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
          <Card >
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <Building size={18} className="text-blue-500" />
              <h3 className="font-semibold text-gray-800">Thông tin cơ sở</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field.Text
                  name="brand"
                  label={{ text: "Tên Homestay/Villa" }}
                />

                <Field.Select
                  name="propertyLocation"
                  label={{ text: "Khu vực" }}
                  options={[
                    { value: "Đà Lạt", label: "Đà Lạt" },
                    { value: "Sapa", label: "Sapa" },
                    { value: "Vũng Tàu", label: "Vũng Tàu" },
                    { value: "Nha Trang", label: "Nha Trang" },
                    { value: "Tam Đảo", label: "Tam Đảo" },
                  ]}
                />

                <Field.Text
                  name="phone"
                  label={{ text: "Số điện thoại liên hệ" }}
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Lịch trình */}
          <Card >
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
                        label={{ text: "Ngày nhận phòng" }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Card>

          {/* Section 3: Giá & Tiện ích */}
          <Card >
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <CreditCard size={18} className="text-green-500" />
              <h3 className="font-semibold text-gray-800">Thanh toán & Chi tiết</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Field.Text
                    name="priceTicket"
                    label={{ text: "Giá phòng/Đêm (VNĐ)" }}
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
                      { label: "Thiết kế sân vườn", value: "Thiết kế sân vườn" },
                    ]}
                    placeholder="Chọn tiện ích..."
                  />
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 mt-8">

          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Đang xử lý..." : "Xác nhận tạo phòng"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
