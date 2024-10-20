"use client";

import * as React from "react";

import { ThemeProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "react-query";

import { AuthContextProvider } from "@/features/auth/context/auth.context";

// Create a client
const queryClient = new QueryClient();

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
