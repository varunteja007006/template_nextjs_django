import { AxiosError } from "axios";

type ToastObj = {
  title: string;
  description: string;
  variant: "destructive" | "default" | "success" | null | undefined;
};

export function getErrors(error: AxiosError) {
  console.error(error);
  const errorObj: ToastObj = {
    title: `${error.response?.statusText ?? ""}`,
    description:
      (error.response?.data as string) || `Oops something went wrong!`,
    variant: "destructive",
  };
  return errorObj;
}
