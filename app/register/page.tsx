import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormRegister from "./form-register";

const RegisterPage = () => {
  return (
    <div className="flex flex-col justify-center items-center px-4 w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="mx-auto w-full max-w-md shadow-lg border-2">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Đăng ký
          </CardTitle>
          <CardDescription className="text-base">
            Tạo tài khoản mới để bắt đầu sử dụng dịch vụ
          </CardDescription>
        </CardHeader>
        <FormRegister />
      </Card>
    </div>
  );
};

export default RegisterPage;

