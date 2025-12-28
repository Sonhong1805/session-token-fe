import authService from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useUserStore((s) => s.login);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      if (res?.data?.otpToken && res?.data?.email) {
        toast.success(res.message);
        router.push(
          `/account-verify?token=${
            res.data.otpToken
          }&email=${encodeURIComponent(res.data.email)}` as any
        );
      }else { 
        if (res?.data?.user) {
          login(res.data.user);
        }
        toast.success("Đăng nhập thành công");
        const redirectTo = searchParams.get("redirect") || "/";
        router.push(redirectTo as any);
      }
    },
    onError: (err: any) => {
      const message = err?.message || "Đăng nhập thất bại";
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (res) => {
      const message = res?.message || "Đăng ký thành công! Vui lòng đăng nhập";
      toast.success(message);
      router.push("/login" as any);
    },
    onError: (err: any) => {
      const message = err?.message || "Đăng ký thất bại";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const logout = useUserStore((s) => s.logout);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      toast.success("Đăng xuất thành công");

      const currentPath = window.location.pathname;
      const protectedPaths = ["/account", "/organizer"];
      const isProtectedPage = protectedPaths.some((path) =>
        currentPath.startsWith(path)
      );

      if (isProtectedPage) {
        // Không redirect về /organizer/:path* sau khi đăng xuất
        const isOrganizerPath = currentPath.startsWith("/organizer");
        if (isOrganizerPath) {
          router.push("/login" as any);
        } else {
          router.push(
            ("/login?redirect=" + encodeURIComponent(currentPath)) as any
          );
        }
      }
    },
    onError: (err: any) => {
      const message = err?.message || "Đăng xuất thất bại";
      toast.error(message);
    },
  });
};
