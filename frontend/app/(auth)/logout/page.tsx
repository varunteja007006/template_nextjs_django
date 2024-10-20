"use client";
import { useAuthContext } from "@/features/auth/context/auth.context";
import React from "react";

export default function LogoutPage() {
  const { logout } = useAuthContext();

  React.useEffect(() => {
    if (!logout.isLoading) {
      logout.mutate();
    }
  }, []);

  return <div>LogoutPage</div>;
}
