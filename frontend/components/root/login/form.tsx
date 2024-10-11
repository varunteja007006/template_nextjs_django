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
import { Checkbox } from "@/components/ui/checkbox";

import { LoginFormSchema } from "@/schema/auth/login";
import { useMutation } from "react-query";
import { loginUser, loginUserV2 } from "@/api/login/login.api";
import { User } from "@/types/user.types";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "@/store/context/auth.context";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const { setUserData } = useAuthContext();

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

    setUserData({ email: response.email, full_name: response.full_name });

    toast({
      title: "Login Successful",
      description: `Welcome ${response.full_name}!`,
      variant: "success",
    });
    router.push("/user-profile");
  }

  function onSuccessV2(response: { success: boolean } | undefined) {
    // If response failed
    if (!response) {
      toast({
        title: "Login Failed",
        description: `Oops something went wrong!`,
        variant: "destructive",
      });
      return;
    }

    if (response.success) {
      toast({
        title: "Login Successful",
        description: `Welcome!`,
        variant: "success",
      });
      router.push("/user-profile");
    }
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

  const login = useMutation<User, AxiosError, z.infer<typeof LoginFormSchema>>({
    mutationFn: loginUser,
    onSuccess,
    onError,
  });

  const loginV2 = useMutation<
    { success: boolean },
    AxiosError,
    z.infer<typeof LoginFormSchema>
  >({
    mutationFn: loginUserV2,
    onSuccess: onSuccessV2,
    onError,
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    if (form.getValues("rememberLogin")) {
      loginV2.mutate(data);
      return;
    }
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberLogin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember Login</FormLabel>
                </div>
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
