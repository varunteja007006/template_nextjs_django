import React from "react";

import { Button } from "@/components/ui/button";

import { FaGoogle } from "react-icons/fa6";
import MyTooltip from "@/components/ui/custom/MyTooltip";

import { loginWithGoogle } from "@/features/auth/api/login.api";

export default function OtherLogins() {
  return (
    <div className="p-2 md:pl-3 md:pr-0 h-full border-l dark:border-none">
      <MyTooltip text={"Sign in with Google"}>
        <Button
          type="button"
          onClick={loginWithGoogle}
          variant={"outline"}
          size={"icon"}
        >
          <FaGoogle />
        </Button>
      </MyTooltip>
    </div>
  );
}
