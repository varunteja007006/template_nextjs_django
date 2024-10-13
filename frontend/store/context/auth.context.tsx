import * as React from "react";

import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LOGIN_ROUTES, UNPROTECTED_ROUTES } from "@/constants/routes.constant";
import { useMutation, UseMutationResult } from "react-query";
import { loginUser, loginUserV2, logoutUser } from "@/api/login/login.api";
import { useToast } from "@/hooks/use-toast";
import { LoginFormSchema } from "@/schema/auth/login.schema";
import { AxiosError } from "axios";
import { User } from "@/types/user.types";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

type UserState = {
  full_name: string;
  email: string;
  rememberLogin: boolean;
};

type DecodedAccessToken = {
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  user: {
    email: string;
    username: string;
  };
  token_type: "access";
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

let refreshTokenTimer: NodeJS.Timeout | null = null;
const REFRESH_TOKEN_INTERVAL = 10 * 60 * 1000;

export function AuthContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  // Tokens from cookies
  const token = Cookies.get("token");
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  const [userData, setUserData] = React.useState<UserState | null>(null);

  const reset = React.useCallback(() => {
    // remove cookies
    Cookies.remove("token");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    // clear storage
    localStorage.clear();
    sessionStorage.clear();
    // reset the user state
    setUserData(null);
    // redirect to login page
    router.push("/login");
    // reset timer
    if (refreshTokenTimer) {
      clearTimeout(refreshTokenTimer);
    }
  }, []);

  function setTheUserData(decoded: DecodedAccessToken) {
    setUserData({
      email: decoded.user.email,
      full_name: decoded.user.username,
      rememberLogin: true,
    });
  }

  function onLogoutSettled() {
    reset();
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
      title: "Logout Successful",
      variant: "success",
    });
  }

  function onSuccessV2(response: { success: boolean } | undefined) {
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
      const decoded: DecodedAccessToken = jwtDecode(
        Cookies.get("access_token") ?? ""
      );
      setTheUserData(decoded);

      toast({
        title: "Login Successful",
        description: `Welcome!`,
        variant: "success",
      });
      router.push("/user-profile");
    }
  }

  function onSuccess(response: User | undefined) {
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
    };

    setUserData(decoded);

    localStorage.setItem("userData", JSON.stringify(decoded));

    toast({
      title: "Login Successful",
      description: `Welcome ${response.full_name}!`,
      variant: "success",
    });
    router.push("/user-profile");
  }

  function onError(error: AxiosError) {
    toast({
      title: `${error.response?.statusText ?? ""}`,
      description:
        (error.response?.data as string) || `Oops something went wrong!`,
      variant: "destructive",
    });
    console.error(error);
  }

  function onLogoutError(error: AxiosError) {
    console.error(error);
  }

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: onLogoutSuccess,
    onError: onLogoutError,
    onSettled: onLogoutSettled,
  });

  const login = useMutation<User, AxiosError, z.infer<typeof LoginFormSchema>>({
    mutationFn: loginUser,
    onSuccess,
    onError,
  });

  const loginV2 = useMutation<
    { success: boolean },
    AxiosError,
    z.infer<typeof LoginFormSchema>
  >({
    mutationFn: loginUserV2,
    onSuccess: onSuccessV2,
    onError,
  });

  React.useEffect(() => {
    // If user has token and is going to login routes then redirect to home
    // also check if user has access and refresh tokens
    if (
      (!!token || !!access_token || !!refresh_token) &&
      LOGIN_ROUTES.includes(pathname)
    ) {
      return router.push("/user-profile");
    }

    // If user has no token and is not going to protected routes then redirect to login
    else if (!token) {
      if (!!access_token || !!refresh_token) {
        // also check if he has access token
        return;
      }

      reset();

      if (!UNPROTECTED_ROUTES.includes(pathname)) {
        return router.push("/login");
      }
    }
  }, [pathname, token, access_token, refresh_token]);

  React.useEffect(() => {
    if (userData?.rememberLogin) {
      refreshTokenTimer = setInterval(() => {
        console.log("calling refresh token");
      }, REFRESH_TOKEN_INTERVAL);
    }

    return () => {
      if (refreshTokenTimer) {
        clearInterval(refreshTokenTimer);
      }
    };
  }, [userData?.rememberLogin]);

  React.useEffect(() => {
    if (token) {
      const decoded = localStorage.getItem("userData");
      if (decoded) {
        setUserData(JSON.parse(decoded));
      }
    }

    if (access_token) {
      const decoded: DecodedAccessToken = jwtDecode(access_token);
      setTheUserData(decoded);
    }
  }, [token, access_token]);

  const authObj = React.useMemo(
    () => ({ reset, setUserData, userData, logout, login, loginV2 }),
    [userData]
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
