import { Suspense } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormLogin from "./form-login";

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center items-center px-4 w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="mx-auto w-full max-w-md shadow-lg border-2">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-base">
            Nhập thông tin đăng nhập để truy cập vào tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <Suspense fallback={<div className="p-6">Đang tải...</div>}>
          <FormLogin />
        </Suspense>
      </Card>
    </div>
  );
};

export default LoginPage;
