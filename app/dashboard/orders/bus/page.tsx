"use client";
import Card from "@/app/components/Card";
import { Field, Form } from "@/app/components/hook-form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Star } from "lucide-react";
import { PROVINCE_OPTIONS } from "@/app/utils/provinces";
import Button from "@/app/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAlert } from "@/app/components/AlertContext";
import OrderSuccessModal from "../components/OrderSuccessModal";
import ImageUploader from "../components/ImageUploader";

const schema = zod.object({
  fromLocation: zod.string().min(1, "Điểm xuất phát là bắt buộc"),
  toLocation: zod.string().min(1, "Điểm đến là bắt buộc"),
  fromDate: zod.any().refine((val) => val !== null && val !== undefined && val !== "", "Ngày khởi hành là bắt buộc"),
  fromTime: zod.string().min(1, "Giờ khởi hành là bắt buộc"),
  toTime: zod.string().min(1, "Giờ đến là bắt buộc"),
  fromDestination: zod.string().min(1, "Bến đi là bắt buộc"),
  toDestination: zod.string().min(1, "Bến đến là bắt buộc"),
  brand: zod.string().min(1, "Nhà xe là bắt buộc"),
  phone: zod.string().min(1, "Số điện thoại là bắt buộc"),
  busCategory: zod.string().min(1, "Loại xe là bắt buộc"),
  amenities: zod.array(zod.string()).optional(),
  priceTicket: zod.string().min(1, "Giá vé là bắt buộc"),
  listTop: zod.string().optional(),
  duration: zod.string().optional(),
});
const BusPage = () => {
  type SchemaType = zod.infer<typeof schema>;
  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromLocation: "",
      toLocation: "",
      fromDate: "",
      fromTime: "",
      toTime: "",
      fromDestination: "",
      toDestination: "",
      brand: "",
      phone: "",
      busCategory: "",
      amenities: [],
      priceTicket: "",
      listTop: "",
      duration: "",
    },
  });
  const { handleSubmit, reset } = methods;
  const { error: showError } = useAlert();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [remainingStars, setRemainingStars] = useState<number | undefined>();
  const [images, setImages] = useState<string[]>([]);

  // Fetch user profile to get star balance
  const { data: profileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
  const userStars = profileData?.user?.stars ?? 0;
  const hasEnoughStars = userStars >= 10;

  const mutation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập trước khi mua vé");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/orders/bus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          images,
          fromDate: data.fromDate instanceof Date ? data.fromDate.toISOString() : data.fromDate
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể tạo đơn hàng");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setRemainingStars(data.remainingStars);
      setShowSuccessModal(true);
      reset();
      setImages([]);
    },
    onError: (err: any) => {
      showError(err.message || "Đã xảy ra lỗi");
    }
  });

  const onSubmit = (data: SchemaType) => {
    mutation.mutate(data);
  };

  return (
    <>
    <Form
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <Card>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Select
            name="fromLocation"
            label={{ text: "Xuất phát" }}
            InputProps={{
              startAdornment: <MapPin size={16} className="text-green-500" />,
            }}
            options={[...PROVINCE_OPTIONS]}
          />
          <Field.Select
            name="toLocation"
            label={{ text: "Điểm dừng" }}
            InputProps={{
              startAdornment: <MapPin size={16} className="text-red-500" />,
            }}
            options={[...PROVINCE_OPTIONS]}
          />
          <Field.DatePicker
            label={{ text: "Ngày xuất phát" }}
            name="fromDate"
          />
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Text
            label={{ text: "Giờ xuất phát" }}
            name="fromTime"
            placeholder="Ví dụ: 8:00 "
          />
          <Field.Text
            label={{ text: "Giờ tới nơi" }}
            name="toTime"
            placeholder="Ví dụ: 20:00"
          />
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Text
            label={{ text: "Điểm đón" }}
            name="fromDestination"
            placeholder="43/3 Hoàng Văn Thụ"
          />
          <Field.Text
            label={{ text: "Điểm trả khách" }}
            name="toDestination"
            placeholder="43/56 Nguyễn Văn Trỗi"
          />
        </div>
      </Card>
      <Card>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Text
            label={{ text: "Nhà Xe" }}
            name="brand"
            placeholder="Hoàng Long"
          />
          <Field.Text
            label={{ text: "Số điện thoại" }}
            name="phone"
            placeholder="0987 123 433, 0773 ..."
          />
          <Field.Text
            label={{ text: "Loại xe" }}
            name="busCategory"
            placeholder="Ghế ngồi 16 chỗ"
          />
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.MultiSelect
            label={{ text: "Tiện ích" }}
            options={[
              { value: "wifi", label: "Wifi" },
              { value: "tv", label: "TV" },
              { value: "charger", label: "Sạc điện thoại" },
              { value: "toilet", label: "Nhà vệ sinh" },
            ]}
            name="amenities"
          />
          <Field.Text
            label={{ text: "Giá vé" }}
            name="priceTicket"
            placeholder="Ví dụ: 1.000.000"
          />
        </div>
      </Card>
      <Card>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Select
            name="listTop"
            label={{ text: "Quảng cáo" }}
            options={[
              { value: "hot", label: "Hot" },
              { value: "goodCar", label: "Xe xịn" },
            ]}
          />
          <Field.Select
            name="duration"
            label={{ text: "Thời gian hiển thị" }}
            options={[
              { value: "1", label: "1 ngày" },
              { value: "7", label: "7 ngày" },
              { value: "30", label: "1 tháng" },
            ]}
          />
        </div>
      </Card>
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Hình ảnh nhà xe</h3>
        <ImageUploader value={images} onChange={setImages} maxFiles={4} />
      </Card>
      <Card>
        <div className="flex flex-col gap-3">
          <Button 
            type="submit" 
            disabled={mutation.isPending || !hasEnoughStars}
            className={`flex items-center justify-center gap-2 w-full ${(mutation.isPending || !hasEnoughStars) ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {mutation.isPending ? "Đang xử lý..." : (
              <>
                Đồng ý
                <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                  <Star size={12} className="fill-current" />
                  10 sao
                </span>
              </>
            )}
          </Button>
          {!hasEnoughStars && (
            <p className="text-center text-sm text-red-500 font-semibold">
              ⚠️ Bạn chỉ có {userStars} ⭐ — cần tối thiểu 10 ⭐ để tạo đơn
            </p>
          )}
        </div>
      </Card>
    </Form>

    <OrderSuccessModal 
      open={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      remainingStars={remainingStars}
      orderType="bus"
    />
    </>
  );
};

export default BusPage;
