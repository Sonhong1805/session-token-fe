import axios from "@/lib/axios";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
} from "@/types/user";

export const userService = {
  updateProfile: async (
    body: UpdateProfileRequest
  ): Promise<Response<User>> => {
    return await axios.put("/user/profile", body);
  },
  changePassword: async (
    body: ChangePasswordRequest
  ): Promise<Response<null>> => {
    return await axios.put("/user/change-password", body);
  },
  search: async (q: string, params?: { organizationId?: number }): Promise<Response<User[]>> => {
    return await axios.get(`/user/search`, { params: { q, ...params } });
  },
};
