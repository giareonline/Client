"use client";
import { Field, Form } from "@/app/components/hook-form";
import React from "react";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Search, Bus, Home } from "lucide-react";
import { PROVINCE_OPTIONS } from "@/app/utils/provinces";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const schema = zod.object({
  serviceType: zod.enum(["bus", "homestay"]),
  fromLocation: zod.string().optional(),
  toLocation: zod.string().optional(),
  fromDate: zod.any().optional(),
  propertyLocation: zod.string().optional(),
  checkInDate: zod.any().optional(),
  brand: zod.string().optional(),
});

type SchemaType = zod.infer<typeof schema>;

export default function FiltersForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: (searchParams.get("serviceType") as any) || "bus",
      fromLocation: searchParams.get("fromLocation") || "TP. Hồ Chí Minh",
      toLocation: searchParams.get("toLocation") || "",
      fromDate: searchParams.get("fromDate") || "",
      propertyLocation: searchParams.get("propertyLocation") || "Lâm Đồng",
      checkInDate: searchParams.get("checkInDate") || "",
      brand: searchParams.get("brand") || "",
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const serviceType = watch("serviceType");

  React.useEffect(() => {
    reset({
      serviceType: (searchParams.get("serviceType") as any) || "bus",
      fromLocation: searchParams.get("fromLocation") || "TP. Hồ Chí Minh",
      toLocation: searchParams.get("toLocation") || "",
      fromDate: searchParams.get("fromDate") || "",
      propertyLocation: searchParams.get("propertyLocation") || "Lâm Đồng",
      checkInDate: searchParams.get("checkInDate") || "",
      brand: searchParams.get("brand") || "",
    });
  }, [searchParams, reset]);

  const handleTabChange = (type: "bus" | "homestay") => {
    setValue("serviceType", type);
    const params = new URLSearchParams();
    params.set("serviceType", type);
    if (type === "bus") {
      params.set("fromLocation", "TP. Hồ Chí Minh");
    } else {
      params.set("propertyLocation", "Lâm Đồng");
    }
    router.push(`/?${params.toString()}`);
  };

  const onSubmit = (data: SchemaType) => {
    const params = new URLSearchParams();
    params.set("serviceType", data.serviceType);
    if (data.serviceType === "bus") {
      if (data.fromLocation) params.set("fromLocation", data.fromLocation);
      if (data.toLocation) params.set("toLocation", data.toLocation);
      if (data.fromDate) {
        const dateStr =
          data.fromDate instanceof Date
            ? data.fromDate.toISOString()
            : data.fromDate;
        params.set("fromDate", dateStr.split("T")[0]);
      }
    } else {
      if (data.propertyLocation)
        params.set("propertyLocation", data.propertyLocation);
      if (data.checkInDate) {
        const dateStr =
          data.checkInDate instanceof Date
            ? data.checkInDate.toISOString()
            : data.checkInDate;
        params.set("checkInDate", dateStr.split("T")[0]);
      }
    }
    if (data.brand) params.set("brand", data.brand);
    router.push(`/?${params.toString()}`);
  };

  const tabs = [
    { key: "bus" as const, label: "Vé Xe", icon: <Bus size={16} /> },
    { key: "homestay" as const, label: "Homestay", icon: <Home size={16} /> },
  ];

  return (
    <div className="hero-gradient rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#1E3A5F]/10">
      {/* Tagline */}
      <div className="text-center mb-6">
        <h1 className="text-white text-xl sm:text-2xl font-bold mb-1.5 tracking-tight">
          Tìm chuyến xe & homestay giá tốt nhất
        </h1>
        <p className="text-blue-200/70 text-sm">
          So sánh hàng trăm nhà xe, homestay uy tín trên toàn quốc
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-white/10 backdrop-blur-sm rounded-xl w-fit mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              serviceType === tab.key
                ? "bg-white text-[#1E3A5F] shadow-md"
                : "text-blue-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <motion.div
        key={serviceType}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl p-5 shadow-lg"
      >
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {serviceType === "bus" ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              <Field.Select
                name="fromLocation"
                label={{ text: "Xuất phát" }}
                InputProps={{
                  startAdornment: (
                    <MapPin size={16} className="text-[#00C853]" />
                  ),
                }}
                options={[...PROVINCE_OPTIONS]}
              />
              <Field.Select
                name="toLocation"
                label={{ text: "Điểm đến" }}
                InputProps={{
                  startAdornment: (
                    <MapPin size={16} className="text-[#EF4444]" />
                  ),
                }}
                options={[...PROVINCE_OPTIONS]}
              />
              <Field.DatePicker
                label={{ text: "Ngày xuất phát" }}
                name="fromDate"
              />
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <Field.Select
                name="propertyLocation"
                label={{ text: "Khu vực" }}
                InputProps={{
                  startAdornment: (
                    <MapPin size={16} className="text-[#3B82F6]" />
                  ),
                }}
                options={[...PROVINCE_OPTIONS]}
              />
              <Field.DatePicker
                label={{ text: "Ngày nhận phòng" }}
                name="checkInDate"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-end gap-3 mt-4">
            <Field.Text
              label={{
                text:
                  serviceType === "bus" ? "Nhà xe" : "Tên Homestay",
              }}
              name="brand"
              placeholder={
                serviceType === "bus"
                  ? "Tên nhà xe..."
                  : "Tên Homestay/Villa..."
              }
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 h-[46px] px-8 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-semibold rounded-xl transition-all duration-300 shadow-md glow-hover cursor-pointer whitespace-nowrap"
            >
              <Search size={18} />
              Tìm kiếm
            </button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
