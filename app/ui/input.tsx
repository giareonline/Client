import * as React from "react";
import { cn } from "../utils/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        {...ref}
        className={cn(
          "w-full border border-gray-200 rounded-lg   px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
          className
        )}
        
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
