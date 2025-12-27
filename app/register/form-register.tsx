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
import { useRegister } from "@/hooks/auth";
import { registerFormSchema } from "./shema";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";

const FormRegister = () => {
  const { mutateAsync: register, isPending } = useRegister();
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
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
                  Tên đăng nhập
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="username"
                      placeholder="nguyenvana"
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
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="email" className="text-base font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      placeholder="nguyenvana@example.com"
                      type="email"
                      autoComplete="email"
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
                <FormLabel htmlFor="password" className="text-base font-medium">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <PasswordInput
                      id="password"
                      placeholder="Nhập mật khẩu của bạn"
                      autoComplete="new-password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  htmlFor="confirmPassword"
                  className="text-base font-medium"
                >
                  Xác nhận mật khẩu
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
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
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium transition-colors">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default FormRegister;

