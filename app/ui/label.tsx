import * as React from "react";
import { cn } from "../utils/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        {...props}
        {...ref}
        className={cn("text-sm text-gray-500", className)}
      />
    );
  }
);
Label.displayName = "Label";

export default Label;
