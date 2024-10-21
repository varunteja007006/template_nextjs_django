import * as React from "react";

import { usePathname, useRouter } from "next/navigation";
import { LOGIN_ROUTES, UNPROTECTED_ROUTES } from "@/constants/routes.constant";
import { useMutation, UseMutationResult } from "react-query";
import {
  loginUser,
  loginUserV2,
  logoutUser,
} from "@/features/auth/api/login.api";
import { useToast } from "@/hooks/use-toast";
import { LoginFormSchema } from "@/features/auth/schema/login.schema";
import { AxiosError } from "axios";
import { User } from "@/types/user.types";
import { z } from "zod";
import { getErrors } from "@/utils/api.utils";
import { validateTokenQuery } from "../api/login.query";

type UserState = {
  full_name?: string;
  email: string;
  rememberLogin: boolean;
  isAuthenticated: boolean;
};

type authContextType = {
  userData: UserState | null;
  setUserData: React.Dispatch<React.SetStateAction<UserState | null>>;
  reset: () => void;
  logout: UseMutationResult<unknown, Error, void, unknown>;
  login: UseMutationResult<User, AxiosError, z.infer<typeof LoginFormSchema>>;
  loginV2: UseMutationResult<
    { success: boolean },
    AxiosError,
    z.infer<typeof LoginFormSchema>
  >;
};

const authContext = React.createContext<authContextType | null>(null);

export function AuthContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [userData, setUserData] = React.useState<UserState | null>(null);

  const reset = React.useCallback(() => {
    // clear storage
    localStorage.clear();
    sessionStorage.clear();
    // reset the user state
    setUserData(null);

    // redirect to login
    router.push("/login");
  }, []);

  const validateToken = validateTokenQuery();

  function onLoginV2Success(response: { success: boolean } | undefined) {
    // If response failed
    if (!response) {
      toast({
        title: "Login Failed",
        description: `Oops something went wrong!`,
        variant: "destructive",
      });
      return;
    }

    if (response.success) {
      toast({
        title: "Login Successful",
        description: `Welcome!`,
        variant: "success",
      });
      validateToken.refetch();
      router.push("/user-profile");
    }
  }

  function onLoginSuccess(response: User | undefined) {
    // If response failed
    if (!response) {
      toast({
        title: "Login Failed",
        description: `Oops something went wrong!`,
        variant: "destructive",
      });
      return;
    }

    const decoded = {
      email: response.email,
      full_name: response.full_name,
      rememberLogin: false,
      isAuthenticated: true,
    };

    setUserData((prev) => ({ ...prev, ...decoded }));

    localStorage.setItem("userData", JSON.stringify(decoded));

    toast({
      title: "Login Successful",
      description: `Welcome ${response.full_name}!`,
      variant: "success",
    });
    router.push("/user-profile");
  }

  function onError(error: AxiosError) {
    toast(getErrors(error));
  }

  function onLogoutSuccess(response: unknown) {
    // If response failed
    if (!response) {
      toast({
        title: "Logout Failed",
        description: `Oops something went wrong!`,
        variant: "destructive",
      });
      return;
    }
    // if response success
    toast({
      description: "Logout Successful",
      variant: "success",
    });
  }

  function onLogoutSettled() {
    reset();
  }

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: onLogoutSuccess,
    onError,
    onSettled: onLogoutSettled,
  });

  const login = useMutation<User, AxiosError, z.infer<typeof LoginFormSchema>>({
    mutationFn: loginUser,
    onSuccess: onLoginSuccess,
    onError,
  });

  const loginV2 = useMutation<
    { success: boolean },
    AxiosError,
    z.infer<typeof LoginFormSchema>
  >({
    mutationFn: loginUserV2,
    onSuccess: onLoginV2Success,
    onError,
  });

  React.useEffect(() => {
    if (validateToken.data) {
      setUserData((prev) => ({
        ...prev,
        ...validateToken.data,
        rememberLogin: true,
      }));
    }
  }, [validateToken.data]);

  const authObj = React.useMemo(
    () => ({ reset, setUserData, userData, logout, login, loginV2 }),
    [userData, logout]
  );

  return (
    <authContext.Provider value={authObj}>{children}</authContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(authContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }

  return context;
}
