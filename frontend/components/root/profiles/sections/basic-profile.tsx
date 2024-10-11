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
import { Checkbox } from "@/components/ui/checkbox";

import { useAuthContext } from "@/store/context/auth.context";

export default function BasicProfile() {
  const { userData, logout } = useAuthContext();

  return (
    <Card className="w-full">
      <CardHeader className="flex-row justify-between items-start">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>This is your profile information</CardDescription>
        </div>
        <div>
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => logout.mutate()}
            disabled={logout.isLoading}
          >
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <p>Full Name:</p>
          <p>{userData?.full_name ?? ""}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p>Email:</p>
          <p>{userData?.email ?? ""}</p>
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
