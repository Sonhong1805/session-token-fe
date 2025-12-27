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
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/user";
import { changePasswordSchema } from "../schema";
import { Lock, Loader2 } from "lucide-react";

const ChangePasswordForm = () => {
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      form.reset();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="oldPassword" className="text-base font-medium">
                Mật khẩu cũ
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <PasswordInput
                    id="oldPassword"
                    placeholder="Nhập mật khẩu cũ"
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

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="newPassword" className="text-base font-medium">
                Mật khẩu mới
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <PasswordInput
                    id="newPassword"
                    placeholder="Nhập mật khẩu mới"
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
                Xác nhận mật khẩu mới
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
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
              Đang đổi mật khẩu...
            </>
          ) : (
            "Đổi mật khẩu"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;

