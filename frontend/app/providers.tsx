"use client";

import * as React from "react";

import { ThemeProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "react-query";

import { UserContextProvider } from "@/store/context/user.context";

// Create a client
const queryClient = new QueryClient();

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </UserContextProvider>
  );
}
