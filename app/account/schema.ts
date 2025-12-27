import z from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .nonempty({ message: "Vui lòng nhập họ và tên" })
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự"),
  email: z
    .string()
    .nonempty({ message: "Vui lòng nhập email" })
    .email({ message: "Email không hợp lệ" }),
  phoneNumber: z
    .string()
    .nonempty({ message: "Vui lòng nhập số điện thoại" })
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  dob: z.string().nonempty({ message: "Vui lòng chọn ngày sinh" }),
  gender: z.string().nonempty({ message: "Vui lòng chọn giới tính" }),
  avatar: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .nonempty({ message: "Vui lòng nhập mật khẩu cũ" }),
    newPassword: z
      .string()
      .nonempty({ message: "Vui lòng nhập mật khẩu mới" })
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu không được quá 50 ký tự"),
    confirmPassword: z
      .string()
      .nonempty({ message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

