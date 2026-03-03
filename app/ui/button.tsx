import * as React from "react";
import { cn } from "../utils/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        {...props}
        {...ref}
        className={cn(
          "w-full bg-yellow-400 hover:bg-yellow-500 text-black  px-4 py-2 rounded-lg cursor-pointer",
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
