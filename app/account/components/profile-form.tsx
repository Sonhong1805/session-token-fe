"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/user";
import { updateProfileSchema } from "../schema";
import { useUserStore } from "@/stores/userStore";
import { User, Mail, Phone, Calendar, UserCircle, Loader2, Camera } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";

const ProfileForm = () => {
  const user = useUserStore((s) => s.user);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      dob: user?.dob
        ? new Date(user.dob).toISOString().split("T")[0]
        : "",
      gender: user?.gender || "",
      avatar: user?.avatar || "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("avatar", file.name);
    }
  };

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    try {
      const avatarFile = fileInputRef.current?.files?.[0] || null;
      const result = await updateProfile({
        profile: {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          dob: new Date(values.dob),
          gender: values.gender as any,
          avatar: values.avatar || "",
        },
        avatarFile,
      });
      // Update avatar preview after successful upload
      if (result?.data?.avatar) {
        setAvatarPreview(result.data.avatar);
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  }

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .slice(-2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || "U";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage src={avatarPreview || user?.avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
              <Camera className="size-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <p className="text-sm text-muted-foreground text-center">
            Click vào icon camera để thay đổi ảnh đại diện
          </p>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="fullName" className="text-base font-medium">
                Họ và tên
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fullName"
                    placeholder="Nguyễn Văn A"
                    className="pl-10 h-11"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="email" className="text-base font-medium">
                Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nguyenvana@example.com"
                    className="pl-10 h-11"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="phoneNumber" className="text-base font-medium">
                Số điện thoại
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="0123456789"
                    className="pl-10 h-11"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="dob" className="text-base font-medium">
                  Ngày sinh
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="dob"
                      type="date"
                      className="pl-10 h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="gender" className="text-base font-medium">
                  Giới tính
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <UserCircle className="size-4 mr-2" />
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full h-11 text-base font-semibold shadow-sm hover:shadow-md transition-all">
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật thông tin"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;

