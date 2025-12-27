"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth";
import { loginFormSchema } from "./shema";
import { Mail, Lock, Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";

const FormLogin = () => {
  const { mutateAsync: login, isPending } = useLogin();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      await login(values);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <CardContent className="pt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="username" className="text-base font-medium">
                  Tên đăng nhập hoặc email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="username"
                      placeholder="nguyenvana@example.com"
                      type="text"
                      autoComplete="username"
                      className="pl-10 h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="password" className="text-base font-medium">
                    Mật khẩu
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline font-medium transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <PasswordInput
                      id="password"
                      placeholder="Nhập mật khẩu của bạn"
                      autoComplete="current-password"
                      className="pl-10 h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="w-full h-11 text-base font-semibold shadow-sm hover:shadow-md transition-all">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium transition-colors">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default FormLogin;
