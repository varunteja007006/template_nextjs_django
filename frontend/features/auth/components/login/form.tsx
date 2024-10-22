"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { LoginFormSchema } from "@/features/auth/schema/login.schema";
import { useAuthContext } from "@/features/auth/context/auth.context";
import OtherLogins from "@/features/auth/components/login/other-logins";

export default function LoginForm() {
  const { login, loginV2 } = useAuthContext();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    if (form.getValues("rememberLogin")) {
      loginV2.mutate(data);
      return;
    }
    login.mutate(data);
  }

  return (
    <Card className="w-[380px] p-5">
      <div className="flex flex-col md:flex-row gap-1 items-stretch justify-around">
        <div className="flex-1 pr-3">
          <div className="text-lg font-semibold mb-3">Login</div>
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
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
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
        </div>
        <div>
          <OtherLogins />
        </div>
      </div>
    </Card>
  );
}
