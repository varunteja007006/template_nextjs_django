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

import { useAuthContext } from "@/features/auth/context/auth.context";
import { CircleCheck, CircleX } from "lucide-react";

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
          >
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <p>Full Name:</p>
          <p>{userData?.full_name ?? ""}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p>Email:</p>
          <p>{userData?.email ?? ""}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p>Remember login:</p>
          {userData?.rememberLogin ? (
            <CircleCheck className="text-green-500" />
          ) : (
            <CircleX className="text-red-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
