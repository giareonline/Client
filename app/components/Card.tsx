import React from "react";
import { cn } from "../utils/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "bg-white p-6 shadow-sm rounded-2xl border border-[#E2E8F0]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
