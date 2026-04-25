"use client";
import { Field, Form } from "@/app/components/hook-form";
import React from "react";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Search, Bus, Home, Filter, X } from "lucide-react";
import { PROVINCE_OPTIONS } from "@/app/utils/provinces";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isMobileModalOpen, setIsMobileModalOpen] = React.useState(false);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: (searchParams.get("serviceType") as any) || "bus",
      fromLocation: searchParams.get("fromLocation") || "210",
      toLocation: searchParams.get("toLocation") || "294",
      fromDate: searchParams.get("fromDate") || new Date(),
      propertyLocation: searchParams.get("propertyLocation") || "369",
      checkInDate: searchParams.get("checkInDate") || new Date(),
      brand: searchParams.get("brand") || "",
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const serviceType = watch("serviceType");

  React.useEffect(() => {
    reset({
      serviceType: (searchParams.get("serviceType") as any) || "bus",
      fromLocation: searchParams.get("fromLocation") || "297",
      toLocation: searchParams.get("toLocation") || "224",
      fromDate: searchParams.get("fromDate") || new Date(),
      propertyLocation: searchParams.get("propertyLocation") || "369",
      checkInDate: searchParams.get("checkInDate") || new Date(),
      brand: searchParams.get("brand") || "",
    });
  }, [searchParams, reset]);

  const handleTabChange = (type: "bus" | "homestay") => {
    setValue("serviceType", type);
    const currentData = methods.getValues();

    // Sync dates between tabs
    if (type === "homestay") {
      currentData.checkInDate = currentData.fromDate;
    } else {
      currentData.fromDate = currentData.checkInDate;
    }

    currentData.serviceType = type;
    onSubmit(currentData);
  };

  const onSubmit = (data: SchemaType) => {
    const params = new URLSearchParams();
    params.set("serviceType", data.serviceType);
    if (data.serviceType === "bus") {
      if (data.fromLocation) params.set("fromLocation", data.fromLocation);
      if (data.toLocation) params.set("toLocation", data.toLocation);
      if (data.fromDate) {
        let dateStr = "";
        if (data.fromDate instanceof Date) {
          const y = data.fromDate.getFullYear();
          const m = String(data.fromDate.getMonth() + 1).padStart(2, "0");
          const d = String(data.fromDate.getDate()).padStart(2, "0");
          dateStr = `${y}-${m}-${d}`;
        } else {
          dateStr = data.fromDate;
        }
        params.set("fromDate", dateStr.split("T")[0]);
      }
    } else {
      if (data.propertyLocation)
        params.set("propertyLocation", data.propertyLocation);
      if (data.checkInDate) {
        let dateStr = "";
        if (data.checkInDate instanceof Date) {
          const y = data.checkInDate.getFullYear();
          const m = String(data.checkInDate.getMonth() + 1).padStart(2, "0");
          const d = String(data.checkInDate.getDate()).padStart(2, "0");
          dateStr = `${y}-${m}-${d}`;
        } else {
          dateStr = data.checkInDate;
        }
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

      {/* Helper function to render form content for both Desktop and Mobile */}
      {(() => {
        const FormContent = () => (
          <Form methods={methods} onSubmit={handleSubmit((data) => {
            onSubmit(data);
            setIsMobileModalOpen(false);
          })}>
            {serviceType === "bus" ? (
              <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                <Field.Select
                  name="fromLocation"
                  label={{ text: "Xuất phát" }}
                  InputProps={{
                    startAdornment: (
                      <MapPin size={16} className="text-[#00C853]" />
                    ),
                  }}
                  options={[...PROVINCE_OPTIONS]}
                  searchable
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
                  searchable
                />
                <Field.DatePicker
                  label={{ text: "Ngày xuất phát" }}
                  name="fromDate"
                />
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                <Field.Select
                  name="propertyLocation"
                  label={{ text: "Khu vực" }}
                  InputProps={{
                    startAdornment: (
                      <MapPin size={16} className="text-[#3B82F6]" />
                    ),
                  }}
                  options={[...PROVINCE_OPTIONS]}
                  searchable
                />
                <Field.DatePicker
                  label={{ text: "Ngày nhận phòng" }}
                  name="checkInDate"
                />
              </div>
            )}

            <div className="flex flex-wrap items-end gap-3 mt-4">
              <div className="flex-1 min-w-[200px]">
                <Field.Text
                  label={{
                    text: serviceType === "bus" ? "Nhà xe" : "Tên Homestay",
                  }}
                  name="brand"
                  placeholder={
                    serviceType === "bus"
                      ? "Tên nhà xe..."
                      : "Tên Homestay/Villa..."
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 h-[46px] px-8 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-semibold rounded-xl transition-all duration-300 shadow-md glow-hover cursor-pointer whitespace-nowrap flex-none"
              >
                <Search size={18} />
                Tìm kiếm
              </button>
            </div>
          </Form>
        );

        return (
          <>
            {/* Desktop Form */}
            <motion.div
              key={serviceType}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden sm:block bg-white rounded-2xl p-5 shadow-lg"
            >
              <FormContent />
            </motion.div>

            {/* Mobile Form Bottom Sheet */}
            <AnimatePresence>
              {isMobileModalOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileModalOpen(false)}
                    className="sm:hidden fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#F8FAFF] rounded-t-[32px] z-[101] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-extrabold text-[#1E3A5F]">Bộ lọc tìm kiếm</h3>
                      <button 
                        onClick={() => setIsMobileModalOpen(false)} 
                        className="p-2 bg-white text-gray-500 rounded-full shadow-sm border border-gray-100 active:scale-95 transition-transform"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <FormContent />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Floating Filter Button (Mobile only) */}
            <div className="sm:hidden fixed bottom-6 left-6 z-[90]">
              <button
                onClick={() => setIsMobileModalOpen(true)}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(255,107,53,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                <Filter size={24} />
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );
}
