"use client";
import Card from "@/app/components/Card";
import { Field, Form } from "@/app/components/hook-form";
import React from "react";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import Button from "@/app/ui/button";

const schema = zod.object({
  from: zod.string().min(1, "From is required"),
  to: zod.string().min(1, "To is required"),
});

const FiltersForm = () => {
  type SchemaType = zod.infer<typeof schema>;
  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: "",
      to: "",
    },
  });
  const { setValue, handleSubmit } = methods;
  const onSubmit = (data: SchemaType) => {};

  return (
    <Card>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
        <div className="grid    grid-cols-1 sm:grid-cols-3 items-end">
          <div className="col-span-2">
            <Field.Text
              label={{ text: "Nhà xe" }}
              name="brand"
              placeholder="Tên nhà xe..."
            />
          </div>

          <Button className="h-12 w-full mt-2 sm:mt-0 sm:ml-2">Tìm kiếm</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FiltersForm;
