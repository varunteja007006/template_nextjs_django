"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

function DebouncedInput({
  value: initialValue, // renamed value prop to initialValue
  onChange,
  debounce = 500,
  ...props
}: Readonly<
  | {
      value: string;
      onChange: (value: string) => void;
      debounce?: number;
    }
  | any
>) {
  const [value, setValue] = useState(initialValue); // local value state to track input

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default DebouncedInput;
