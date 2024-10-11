import * as React from "react";

import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LOGIN_ROUTES, UNPROTECTED_ROUTES } from "@/constants/routes.constant";
import { useMutation, UseMutationResult } from "react-query";
import { logoutUser } from "@/api/login/login.api";
import { useToast } from "@/hooks/use-toast";

type UserState = {
  full_name: string;
  email: string;
};

type authContextType = {
  userData: UserState | null;
  setUserData: React.Dispatch<React.SetStateAction<UserState | null>>;
  reset: () => void;
  logout:  UseMutationResult<unknown, Error, void, unknown>;
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
    Cookies.remove("token");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setUserData(null);
  }, []);

  const token = Cookies.get("token");
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  function onSuccess(response: unknown) {
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
    reset();
    toast({
      title: "Logout Successful",
      variant: "success",
    });
    router.push("/login");
  }

  function onError(error: Error) {
    console.error(error);
  }

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess,
    onError,
  });

  React.useEffect(() => {
    // If user has token and is going to login routes then redirect to home
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

  const authObj = React.useMemo(
    () => ({ reset, setUserData, userData, logout }),
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
