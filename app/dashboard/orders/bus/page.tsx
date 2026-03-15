"use client";
import Card from "@/app/components/Card";
import { Field, Form } from "@/app/components/hook-form";
import React from "react";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import Button from "@/app/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/components/AlertContext";

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
  const { setValue, handleSubmit, reset } = methods;
  const router = useRouter();
  const { success, error: showError } = useAlert();

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
          fromDate: data.fromDate instanceof Date ? data.fromDate.toISOString() : data.fromDate
        })
      });

      if (!res.ok) {
        throw new Error("Không thể tạo đơn hàng");
      }
      return res.json();
    },
    onSuccess: () => {
      success("Tạo đơn hàng vé xe khách thành công!");
      reset(); // Reset form
      setTimeout(() => {
        router.push("/dashboard/orders"); // Điều hướng đến trang quản lý
      }, 1500)
    },
    onError: (err: any) => {
      showError(err.message || "Đã xảy ra lỗi");
    }
  });

  const onSubmit = (data: SchemaType) => {
    mutation.mutate(data);
  };

  return (
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
            options={[
              { value: "HCM", label: "HCM" },
              { value: "HN", label: "Hà Nội" },
              { value: "DN", label: "Đà Nẵng" },
              {
                value: "BT",
                label: "Bình Thuận",
              },
            ]}
          />
          <Field.Select
            name="toLocation"
            label={{ text: "Điểm dừng" }}
            InputProps={{
              startAdornment: <MapPin size={16} className="text-red-500" />,
            }}
            options={[
              { value: "HCM", label: "HCM" },
              { value: "HN", label: "Hà Nội" },
              { value: "DN", label: "Đà Nẵng" },
              {
                value: "BT",
                label: "Bình Thuận",
              },
            ]}
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
        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className={mutation.isPending ? "opacity-70 cursor-not-allowed" : ""}
        >
          {mutation.isPending ? "Đang xử lý..." : "Đồng ý"}
        </Button>
      </Card>
    </Form>
  );
};

export default BusPage;
