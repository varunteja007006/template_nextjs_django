import axios from "@/lib/axios";
import { LoginFormSchema } from "@/features/auth/schema/login.schema";
import { User } from "@/types/user.types";
import { z } from "zod";
import { validateTokenType } from "../types/auth.types";

export const loginUser = async (data: z.infer<typeof LoginFormSchema>) => {
  const response = await axios.post<User>("/api/v1/auth/login", data);
  return response.data;
};

export const loginUserV2 = async (data: z.infer<typeof LoginFormSchema>) => {
  const response = await axios.post<{ success: boolean }>(
    "/api/v1/auth/login/token/v2",
    data
  );
  return response.data;
};

export const loginUserRefreshV2 = async (data: {} = {}) => {
  const response = await axios.post<{ success: boolean }>(
    "/api/v1/auth/login/token/refresh/v2",
    data
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post<{ success: boolean }>(
    "/api/v1/auth/logout"
  );
  return response.data;
};

export const validateToken = async () => {
  const response = await axios.get<validateTokenType>(
    "/api/v1/auth/validate-token"
  );
  return response.data;
};

export async function loginWithGoogle(): Promise<void> {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  // Parameters to pass to OAuth 2.0 endpoint.
  const params: Record<string, string> = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    redirect_uri: "http://localhost:3000",
    response_type: "token",
    // Multiple scopes separated by space
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    include_granted_scopes: "true",
    state: "",
  };

  // Build the full URL with query params for the redirection
  const urlParams = new URLSearchParams(params).toString();
  const authUrl = `${oauth2Endpoint}?${urlParams}`;

  // Redirect the user to Google's OAuth 2.0 endpoint
  window.location.href = authUrl;
}
