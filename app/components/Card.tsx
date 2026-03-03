import React from "react";
import { cn } from "../utils/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: Props) => {
  return (
    <div className={cn(`bg-white p-6 shadow rounded`, className)}>{children}</div>
  );
};

export default Card;
