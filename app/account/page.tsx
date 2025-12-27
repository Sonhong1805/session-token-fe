"use client";

import { useUserStore } from "@/stores/userStore";
import { useLogout } from "@/hooks/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, LogOut, Loader2 } from "lucide-react";

const AccountPage = () => {
  const user = useUserStore((s) => s.user);
  const isLogin = useUserStore((s) => s.isLogin);
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();

  if (!isLogin || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Vui lòng đăng nhập</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {user.username}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/" className="block">
              <Button
                variant="default"
                size="lg"
                className="w-full h-11 text-base font-semibold shadow-sm hover:shadow-md transition-all">
                <Home className="mr-2 size-4" />
                Trang chủ
              </Button>
            </Link>
            <Button
              onClick={() => handleLogout()}
              disabled={isLoggingOut}
              variant="outline"
              size="lg"
              className="w-full h-11 text-base font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 size-4" />
                  Đăng xuất
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;

