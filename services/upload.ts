import axios from "@/lib/axios";

export const uploadService = {
  uploadAvatar: async (file: File): Promise<Response<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    return await axios.post("/upload/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

