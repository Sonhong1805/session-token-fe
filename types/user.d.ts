import type { LOGIN_TYPE, GENDER } from "@/constants/user";

type LOGIN_TYPE = (typeof LOGIN_TYPE)[keyof typeof LOGIN_TYPE];
type GENDER = (typeof GENDER)[keyof typeof GENDER];

interface User extends Base {
  id: number;
  fullName: string;
  username: string;
  email: string;
  loginType: LOGIN_TYPE;
  gender?: GENDER;
  phoneNumber?: string;
  dob?: Date | null;
  refreshToken?: string | null;
  avatar?: string | null;
  isEmailVerified?: boolean;
  deletedAt: Date | null;
}

interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: Date;
  gender: GENDER;
  avatar: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
