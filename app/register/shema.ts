import z from "zod";

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .nonempty({ message: "Vui lòng nhập tên đăng nhập" })
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(30, "Tên đăng nhập không được quá 30 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
      ),
    email: z
      .string()
      .nonempty({ message: "Vui lòng nhập email" })
      .email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .nonempty({ message: "Vui lòng nhập mật khẩu" })
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu không được quá 50 ký tự"),
    confirmPassword: z
      .string()
      .nonempty({ message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

