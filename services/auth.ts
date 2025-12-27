import axios from "@/lib/axios";
import { User } from "@/types/user";

export const authService = {
  login: async (body: LoginRequest): Promise<Response<LoginResponse>> => {
    const response = await axios.post("/auth/login", body);
    if (response?.data?.accessToken) {
      localStorage.setItem("access_token", response.data.accessToken);
    }
    return response;
  },
  register: async (
    body: RegisterRequest
  ): Promise<Response<RegisterResponse>> => {
    return await axios.post("/auth/register", body);
  },
  me: async (): Promise<Response<User>> => {
    return await axios.get("/auth/me");
  },
  logout: async () => {
    localStorage.removeItem("access_token");
    return await axios.post("/auth/logout");
  },
};

export default authService;
