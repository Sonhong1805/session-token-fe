interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
  otpToken?: string;
  email?: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  email: string;
  otpToken: string;
}

interface VerifyOtpRequest {
  otpCode: string;
  otpToken: string;
}

interface ResendOtpRequest {
  email: string;
}

interface ResendOtpResponse {
  otpToken: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  email: string;
  otpToken: string;
  isEmailVerified: boolean;
}


interface ResetPasswordRequest {
  newPassword: string;
  token: string;
}

interface LoginGoogleRequest {
  email: string;
}

interface LoginGoogleResponse {
  registered: boolean;
  accessToken: string;
  user: User;
}

interface RegisterGoogleRequest {
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  emailVerified: boolean;
}

interface RegisterGoogleResponse {
  accessToken: string;
  user: User;
}
