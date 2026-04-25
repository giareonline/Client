"use client";
import Card from "@/app/components/Card";
import { Field, Form } from "@/app/components/hook-form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Star } from "lucide-react";
import { useProvinces } from "@/app/hooks/api/useProvinces";
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
      fromDate: new Date() as any,
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ─── React Query Hooks ───
  const { data: profileData } = useUserProfile();
  const userStars = profileData?.user?.stars ?? 0;
  
  const mutation = useCreateBusOrder();
  const { data: provinceOptions = [] } = useProvinces();

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
            options={provinceOptions}
            searchable
          />
          <Field.Select
            name="toLocation"
            label={{ text: "Điểm dừng", icon: "*" }}
            InputProps={{
              startAdornment: <MapPin size={16} className="text-red-500" />,
            }}
            options={provinceOptions}
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
          Hình ảnh nhà xe
        </h3>
        <ImageUploader value={images} onChange={setImages} maxFiles={4} />
      </Card>
      <Card>
        <div className="flex flex-col gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3 items-start">
            <div className="text-orange-500 shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div className="text-sm text-orange-800">
              <p className="font-bold mb-1">Chính sách đăng bài trên GiaReViet</p>
              <ul className="list-disc pl-4 space-y-1 text-orange-700">
                <li>Bạn cam kết mọi thông tin chuyến xe, giá vé và hình ảnh là <strong>hoàn toàn chính xác</strong> và không vi phạm bản quyền.</li>
                <li>Nếu phát hiện thông tin sai sự thật hoặc hình ảnh ảo, bài đăng sẽ bị gỡ và tài khoản sẽ bị <strong>trừ sao phạt</strong>.</li>
                <li>Trường hợp vi phạm nghiêm trọng (như hành vi lừa đảo người dùng), tài khoản của bạn sẽ bị <strong>khoá vĩnh viễn</strong>.</li>
              </ul>
            </div>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" 
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span className="text-sm font-semibold text-slate-700">
              Tôi đã đọc, hiểu rõ rủi ro và đồng ý với các chính sách trên.
            </span>
          </label>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3">
          <Button 
            type="submit" 
            disabled={mutation.isPending || !hasEnoughStars || !agreedToTerms}
            className={`flex items-center justify-center gap-2 w-full ${(mutation.isPending || !hasEnoughStars || !agreedToTerms) ? "opacity-70 cursor-not-allowed" : ""}`}
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
