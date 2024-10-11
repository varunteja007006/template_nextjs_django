import React from "react";

import { ModeToggle } from "@/components/ui/custom/theme-toggle";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/store/context/auth.context";

export default function UserNavbar() {
  const { userData } = useAuthContext();

  return (
    <div className="flex items-center gap-5">
      <div className="flex flex-row items-center">
        {userData?.email ? (
          <div className="flex gap-1 items-center">
            <Button variant={"link"} asChild>
              <Link href="/user-profile" className="text-base">
                {userData?.full_name ?? "USER"}
              </Link>
            </Button>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {userData?.full_name?.[0] || "USER"}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <Button variant={"default"} asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
      <ModeToggle />
    </div>
  );
}
