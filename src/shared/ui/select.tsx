
import * as React from "react";
import { cn } from "@/shared/lib";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-8 rounded-lg border border-border bg-background px-2.5 text-sm outline-none transition-colors",
          "focus:border-ring focus:ring-2 focus:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-input dark:bg-input/30",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
