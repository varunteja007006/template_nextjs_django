"use client";
import React from "react";
import LoginForm from "./form";

export default function LoginMain() {
  return (
    <div className="flex flex-col md:items-center h-[calc(100vh-10rem)] justify-center items-start">
      <LoginForm />
    </div>
  );
}
