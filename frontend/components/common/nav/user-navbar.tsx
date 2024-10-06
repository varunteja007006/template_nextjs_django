import React from "react";

import { ModeToggle } from "@/components/ui/custom/theme-toggle";

import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store/store";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserNavbar() {
  const { email, full_name } = useStore(
    useShallow((state) => ({
      email: state.email,
      full_name: state.full_name,
    }))
  );

  return (
    <div className="flex items-center gap-5">
      <div className="flex flex-row items-center">
        {email ? (
          <div className="flex gap-1 items-center">
            <Button variant={"link"} asChild>
              <Link href="/user-profile" className="text-base">
                {full_name}
              </Link>
            </Button>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{full_name?.[0]}</AvatarFallback>
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
