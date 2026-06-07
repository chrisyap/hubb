import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "file:text-foreground flex h-10 w-full rounded-xs border border-slate-300 px-4 text-sm text-slate-900 placeholder-slate-500 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "bg-slate-100 dark:bg-slate-800",
          "dark:border-slate-600 dark:text-slate-100",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
