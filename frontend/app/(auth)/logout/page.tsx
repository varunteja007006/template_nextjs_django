"use client";
import { useAuthContext } from "@/store/context/auth.context";
import React from "react";

export default function LogoutPage() {
  const { logout } = useAuthContext();

  React.useEffect(() => {
    logout.mutate();
  }, [logout]);

  return <div>LogoutPage</div>;
}
