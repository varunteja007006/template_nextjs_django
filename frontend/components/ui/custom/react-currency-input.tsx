import { cn } from "@/lib/utils";
import React from "react";
import CurrencyInput from "react-currency-input-field";

const InputCurrency = React.forwardRef(
  ({ className, onChange, ...props }: any, ref) => {
    return (
      <CurrencyInput
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        intlConfig={{ locale: "en-US", currency: "GBP" }}
        onChange={(value) => onChange?.(value || "")}
        {...props}
      />
    );
  }
);
InputCurrency.displayName = "InputCurrency";
export default InputCurrency;
