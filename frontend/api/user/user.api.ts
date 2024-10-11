import axios from "@/lib/axios";
import { LoginFormSchema } from "@/schema/auth/login";
import { User } from "@/types/user.types";
import { z } from "zod";

export const loginUser = async (data: z.infer<typeof LoginFormSchema>) => {
  const response = await axios.post<User>("/api/v1/auth/login", data);
  return response.data;
};

export const loginUserV2 = async (data: z.infer<typeof LoginFormSchema>) => {
  const response = await axios.post<User>("/api/v1/auth/login/token/v2", data);
  return response.data;
};

export const loginUserRefreshV2 = async (
  data: z.infer<typeof LoginFormSchema>
) => {
  const response = await axios.post<User>(
    "/api/v1/auth/login/token/refresh/v2",
    data
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post("/api/v1/auth/logout");
  return response.data;
};
