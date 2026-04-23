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
import { useAlert } from "@/app/components/AlertContext";
import OrderSuccessModal from "../components/OrderSuccessModal";
import ImageUploader from "../components/ImageUploader";
import { useUserProfile } from "@/app/hooks/api/useAuth";
import { useCreateBusOrder } from "@/app/hooks/api/useOrders";

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

type SchemaType = zod.infer<typeof schema>;

const BusPage = () => {
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
  
  const mutation = useCreateBusOrder();

  const { watch } = methods;
  const listTop = watch("listTop");
  const duration = watch("duration") || "1";
  
  let adCost = 0;
  if (listTop === "hot") adCost = 5;
  if (listTop === "goodCar") adCost = 10;
  
  const durationMultiplier = parseInt(duration, 10);
  const durationCost = durationMultiplier * 10;
  const requiredStars = durationCost + adCost;

  const hasEnoughStars = userStars >= requiredStars;

  const onSubmit = (data: SchemaType) => {
    if (images.length === 0) {
      showError("Hình ảnh nhà xe là bắt buộc");
      return;
    }
    mutation.mutate(
      {
        ...data,
        images,
        fromDate: (function() {
          if (data.fromDate instanceof Date) {
            const y = data.fromDate.getFullYear();
            const m = String(data.fromDate.getMonth() + 1).padStart(2, "0");
            const d = String(data.fromDate.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
          }
          return data.fromDate;
        })(),
      },
      {
        onSuccess: (responseData) => {
          setRemainingStars(responseData.remainingStars);
          setDeductedStars(responseData.deductedStars);
          setShowSuccessModal(true);
          reset();
          setImages([]);
        },
        onError: (err) => {
          showError(err.message || "Đã xảy ra lỗi");
        },
      }
    );
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
            label={{ text: "Xuất phát" ,icon:"*"}}
            InputProps={{
              startAdornment: <MapPin size={16} className="text-green-500" />,
            }}
            options={[...PROVINCE_OPTIONS]}
            searchable
          />
          <Field.Select
            name="toLocation"
            label={{ text: "Điểm dừng", icon: "*" }}
            InputProps={{
              startAdornment: <MapPin size={16} className="text-red-500" />,
            }}
            options={[...PROVINCE_OPTIONS]}
            searchable
          />
          <Field.DatePicker
            label={{ text: "Ngày xuất phát", icon: "*" }}
            name="fromDate"
          />
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Text
            label={{ text: "Giờ xuất phát", icon: "*" }}
            name="fromTime"
            placeholder="Ví dụ: 8:00 "
          />
          <Field.Text
            label={{ text: "Giờ tới nơi", icon: "*" }}
            name="toTime"
            placeholder="Ví dụ: 20:00"
          />
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Text
            label={{ text: "Điểm đón", icon: "*" }}
            name="fromDestination"
            placeholder="43/3 Hoàng Văn Thụ"
          />
          <Field.Text
            label={{ text: "Điểm trả khách", icon: "*" }}
            name="toDestination"
            placeholder="43/56 Nguyễn Văn Trỗi"
          />
        </div>
      </Card>
      <Card>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
          <Field.Text
            label={{ text: "Nhà Xe", icon: "*" }}
            name="brand"
            placeholder="Hoàng Long"
          />
          <Field.Text
            label={{ text: "Số điện thoại", icon: "*" }}
            name="phone"
            placeholder="0987 123 433, 0773 ..."
          />
          <Field.Text
            label={{ text: "Loại xe", icon: "*" }}
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
            label={{ text: "Giá vé", icon: "*" }}
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
              { value: "hot", label: "Hot (+5 ⭐)" },
              { value: "goodCar", label: "Xe xịn (+10 ⭐)" },
            ]}
          />
          <Field.Select
            name="duration"
            label={{ text: "Thời gian hiển thị" }}
            options={[
              { value: "1", label: `1 ngày (${10 } ⭐)` },
              { value: "7", label: `7 ngày (${70 } ⭐)` },
              { value: "30", label: `1 tháng (${300 } ⭐)` },
            ]}
          />
        </div>
      </Card>
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Hình ảnh nhà xe <span className="text-red-500">*</span>
        </h3>
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
                  {requiredStars} sao
                </span>
              </>
            )}
          </Button>
          {!hasEnoughStars && (
            <p className="text-center text-sm text-red-500 font-semibold">
              ⚠️ Bạn chỉ có {userStars} ⭐ — cần tối thiểu {requiredStars} ⭐ để tạo đơn
            </p>
          )}
        </div>
      </Card>
    </Form>

    <OrderSuccessModal 
      open={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      remainingStars={remainingStars}
      deductedStars={deductedStars}
      orderType="bus"
    />
    </>
  );
};

export default BusPage;
