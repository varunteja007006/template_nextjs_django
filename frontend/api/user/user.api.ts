import axios from "@/lib/axios";
import { LoginFormSchema } from "@/schema/auth/login";
import { User } from "@/types/user";
import { z } from "zod";

export const loginUser = async (data: z.infer<typeof LoginFormSchema>) => {
  try {
    const response = await axios.post<User>("/api/v1/auth/login", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post("/api/v1/auth/logout");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
