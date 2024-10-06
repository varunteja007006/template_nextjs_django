import * as React from "react";

import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LOGIN_ROUTES, UNPROTECTED_ROUTES } from "@/constants/routes.constant";

const userContext = React.createContext({});

export function UserContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const token = Cookies.get("token");

  React.useEffect(() => {
    // If user has token and is going to login routes then redirect to home
    if (!!token && LOGIN_ROUTES.includes(pathname)) {
      return router.push("/user-profile");
    }

    // If user has no token and is not going to protected routes then redirect to login
    else if (
      !token &&
      // !access_token &&
      // !refresh_token &&
      !UNPROTECTED_ROUTES.includes(pathname)
    ) {
      return router.push("/login");
    }
  }, [pathname, token]);

  return <userContext.Provider value={{}}>{children}</userContext.Provider>;
}

export function useUserContext() {
  const context = React.useContext(userContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
}
