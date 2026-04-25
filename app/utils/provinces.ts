import { provinces } from "../dataset/provinces";
import React from "react";
import { MapPin } from "lucide-react";

export const PROVINCE_OPTIONS = Array.from(
  new Map(
    provinces
      .filter((p) => p.pn || p.spn)
      .map((p) => {
        const isProvinceOnly = !p.spn || p.spn === p.pn;
        const name = isProvinceOnly ? p.pn : `${p.spn}, ${p.pn}`;
        const value = p.spid ? p.spid.toString() : p.pusn;
        return [
          value,
          {
            value,
            label: name,
            province: p.pn,
            icon: React.createElement(MapPin, {
              size: 14,
              className: "flex-shrink-0",
            }),
          },
        ];
      }),
  ).values(),
).sort((a, b) => a.label.localeCompare(b.label));
