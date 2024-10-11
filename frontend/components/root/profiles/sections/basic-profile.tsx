"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { useMutation } from "react-query";
import { logoutUser } from "@/api/login/login.api";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function BasicProfile() {
  const { toast } = useToast();
  const router = useRouter();

  const { email, full_name, logoutUserStore } = useStore(
    useShallow((state) => ({
      email: state.email,
      full_name: state.full_name,
      logoutUserStore: state.logoutUserStore,
    }))
  );

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
    logoutUserStore();
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

  return (
    <Card className="w-full">
      <CardHeader className="flex-row justify-between items-start">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>This is your profile information</CardDescription>
        </div>
        <div>
          <Button variant={"destructive"} onClick={() => logout.mutate()}>
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <p>Full Name:</p>
          <p>{full_name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p>Email:</p>
          <p>{email}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p>Phone Number:</p>
          <p>-</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p>Address:</p>
          <p>-</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p>Remember login:</p>
          <Checkbox defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}
