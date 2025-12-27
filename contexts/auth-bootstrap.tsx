"use client";

import { useEffect, useRef } from "react";
import authService from "@/services/auth";
import { useUserStore } from "@/stores/userStore";

export default function AuthBootstrap() {
  const didRunRef = useRef(false);
  const login = useUserStore((s) => s.login);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) return;

    (async () => {
      try {
        const res = await authService.me();
        if (res?.data) {
          login(res.data);
        }
      } catch {
        // Silently ignore; interceptors will handle invalid tokens if needed
      }
    })();
  }, []);

  return null;
}
