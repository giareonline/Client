import * as React from "react";
import { cn } from "../utils/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFA060] text-white font-semibold shadow-md glow-hover",
      outline:
        "border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white font-semibold",
      ghost:
        "text-[#1E3A5F] hover:bg-[#1E3A5F]/5 font-medium",
    };

    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          "px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 text-sm",
          variants[variant],
          className
        )}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
