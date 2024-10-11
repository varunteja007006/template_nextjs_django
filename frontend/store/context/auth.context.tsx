import * as React from "react";

import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LOGIN_ROUTES, UNPROTECTED_ROUTES } from "@/constants/routes.constant";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

const authContext = React.createContext({});

export function AuthContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const { email, full_name, logoutUserStore } = useStore(
    useShallow((state) => ({
      email: state.email,
      full_name: state.full_name,
      logoutUserStore: state.logoutUserStore,
    }))
  );

  const token = Cookies.get("token");
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  console.log(access_token);
  console.log(refresh_token);

  React.useEffect(() => {
    // If user has token and is going to login routes then redirect to home
    if (
      (!!token || !!access_token || !!refresh_token) &&
      LOGIN_ROUTES.includes(pathname)
    ) {
      return router.push("/user-profile");
    }

    // If user has no token and is not going to protected routes then redirect to login
    else if (!token && !access_token && !refresh_token) {
      if (email && full_name) {
        logoutUserStore();
      }

      if (!UNPROTECTED_ROUTES.includes(pathname)) {
        return router.push("/login");
      }
    }
  }, [pathname, token]);

  return <authContext.Provider value={{}}>{children}</authContext.Provider>;
}

export function useAuthContext() {
  const context = React.useContext(authContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }

  return context;
}
