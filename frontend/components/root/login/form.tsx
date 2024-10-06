"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { LoginFormSchema } from "@/schema/auth/login";
import { useMutation } from "react-query";
import { loginUser } from "@/api/user/user.api";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import _ from "lodash";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const { loginUserStore } = useStore(
    useShallow((state) => ({
      loginUserStore: state.loginUserStore,
    }))
  );

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  });

  function onSuccess(response: User | undefined) {
    // If response failed
    if (!response) {
      toast({
        title: "Login Failed",
        description: `Oops something went wrong!`,
        variant: "destructive",
      });
      return;
    }

    // if response success
    loginUserStore(response);
    toast({
      title: "Login Successful",
      description: `Welcome ${response.full_name}!`,
      variant: "success",
    });
    router.push("/user-profile");
  }

  function onError(error: AxiosError) {
    toast({
      title: `${error.response?.statusText ?? ""}`,
      description:
        (error.response?.data as string) || `Oops something went wrong!`,
      variant: "destructive",
    });

    console.error(error.message);
  }

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess,
    onError,
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    login.mutate(data);
  }

  return (
    <Card className="flex flex-col items-start justify-start gap-2 h-fit max-w-[280px] p-5">
      <div className="text-lg font-semibold">Login</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="success">
            Submit
          </Button>
        </form>
      </Form>
    </Card>
  );
}
