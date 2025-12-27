import { userService } from "@/services/user";
import { uploadService } from "@/services/upload";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import type { UpdateProfileRequest } from "@/types/user";

export const useUpdateProfile = () => {
  const login = useUserStore((s) => s.login);

  return useMutation({
    mutationFn: async (data: {
      profile: UpdateProfileRequest;
      avatarFile?: File | null;
    }) => {
      let avatarUrl = data.profile.avatar;

      if (data.avatarFile) {
        const uploadResponse = await uploadService.uploadAvatar(
          data.avatarFile
        );
        if (uploadResponse?.data?.url) {
          avatarUrl = uploadResponse.data.url;
        }
      }

      return await userService.updateProfile({
        ...data.profile,
        avatar: avatarUrl,
      });
    },
    onSuccess: (res) => {
      if (res?.data) {
        login(res.data);
        toast.success("Cập nhật thông tin thành công");
      }
    },
    onError: (err: any) => {
      const message = err?.message || "Cập nhật thông tin thất bại";
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
    onError: (err: any) => {
      const message = err?.message || "Đổi mật khẩu thất bại";
      toast.error(message);
    },
  });
};

export const useSearchUsers = (
  query: string,
  enabled: boolean = true,
  organizationId?: number
) => {
  return useQuery({
    queryKey: ["search-users", query, organizationId],
    queryFn: async () => {
      const response = await userService.search(
        query,
        organizationId ? { organizationId } : undefined
      );
      return response.data || [];
    },
    enabled: enabled && !!query && query.length >= 2,
  });
};
