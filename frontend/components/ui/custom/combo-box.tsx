"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormControl } from "../ui/form";
import { Button } from "../ui/button";
import { HiOutlineChevronDown } from "react-icons/hi";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { CommandList, CommandLoading } from "cmdk";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

/**
 * Render a ComboBox component with a dropdown menu for selecting options.
 * @return {JSX.Element} The ComboBox component JSX.
 */

export type ComboBoxProps = {
  options: any[];
  form: any;
  field: any;
  value: string;
  label: string;
  defaultValue?: string | number;
  cbFunc?: any;
  required?: boolean;
  disabled?: boolean;
  sizeOffset?: number;
  loading?: boolean;
};

function ComboBox(props: Readonly<ComboBoxProps>) {
  const [open, setOpen] = React.useState(false);
  const [popoverContentDimensions, setPopoverContentDimensions] =
    React.useState<{ width: string }>({ width: "280px" });
  const popupRef = React.useRef<HTMLButtonElement>(null);

  //  To check the width of the button and set the popover content width accordingly
  React.useEffect(() => {
    const refValue = popupRef?.current;
    if (refValue) {
      const width = refValue?.offsetWidth || 280;
      setPopoverContentDimensions({
        width: `${width + (props?.sizeOffset ?? 0)}px`,
      });
    }
  }, [popupRef?.current]);

  // check if selectedValue is present or not and return true or false
  const checkSelectedValue = () => {
    if (!props?.field.value) {
      return true;
    }
    return !props?.options?.find(
      (item) => item[props?.value] === props?.field.value
    )?.[props?.label];
  };

  // get select value based on selectedValue & also reset the value of this dropdown
  // if selectedValue is not present
  const getSelectedValue = () => {
    if (!props?.field.value) {
      return "Select";
    }
    const label = props?.options?.find(
      (item) => item[props?.value] === props?.field.value
    )?.[props?.label];
    return label || "Select";
  };

  const handleOnSelect = (item: any) => {
    if (props.required) {
      // if required is true then set the value and do not let user to un-select
      props?.form?.setValue(props?.field.name, item[props?.value]);
    } else {
      // if required is false then set the value and let user to un-select
      props?.form?.getValues(props?.field.name) === item[props?.value]
        ? props?.form?.setValue(props?.field.name, props?.defaultValue)
        : props?.form?.setValue(props?.field.name, item[props?.value]);
    }

    // if cbFunc is present then call it
    if (props.cbFunc && typeof props.cbFunc === "function") {
      props.cbFunc(item[props?.value]);
    }

    // clear the errors whenever the user selects an option
    props?.form?.clearErrors(props?.field.name);

    // close the popover
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="menu"
            className={cn(
              "w-full justify-between disabled:hover:bg-white/[0.7] !pointer-events-auto disabled:cursor-not-allowed",
              checkSelectedValue() && "text-muted-foreground"
            )}
            ref={popupRef}
            disabled={props?.disabled}
            id={props?.field.name}
          >
            <span className="overflow-hidden text-ellipsis">
              {getSelectedValue()}
            </span>
            <HiOutlineChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 overflow-auto"
        style={{ ...popoverContentDimensions }}
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <ScrollArea className="h-[200px]">
            <CommandList>
              <CommandEmpty>Not found</CommandEmpty>
              {props?.loading && (
                <CommandLoading>
                  <LoaderCircle className="w-6 h-6 animate-spin" />
                </CommandLoading>
              )}
              <CommandGroup>
                {props?.options
                  ? props?.options.map((item, index) => (
                      <CommandItem
                        className={cn(
                          ``,
                          props?.form?.getValues(props?.field.name) ===
                            item[props?.value] && "bg-slate-200"
                        )}
                        value={`${item[props?.label] + item[props?.value]}`}
                        key={index}
                        onSelect={() => handleOnSelect(item)}
                      >
                        {item[props?.label]}
                      </CommandItem>
                    ))
                  : []}
              </CommandGroup>
            </CommandList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboBox;
