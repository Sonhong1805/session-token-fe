import z from "zod";

export const loginFormSchema = z.object({
  username: z.string().nonempty({ message: "Vui lòng nhập tên đăng nhập" }),
  password: z.string().nonempty({ message: "Vui lòng nhập mật khẩu" }),
});

export const loginGoogleSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Vui lòng nhập tên đăng nhập" })
    .min(2, "Tên đăng nhập phải có ít nhất 2 ký tự")
    .max(50, "Tên đăng nhập không được quá 50 ký tự")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    ),
  fullName: z.string().optional(),
  email: z.string().optional(),
  avatar: z.string().optional(),
  emailVerified: z.boolean(),
});
