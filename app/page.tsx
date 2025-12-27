"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { useLogout } from "@/hooks/auth";
import { LogOut, Loader2 } from "lucide-react";

export default function Home() {
  const user = useUserStore((s) => s.user);
  const isLogin = useUserStore((s) => s.isLogin);
  const displayName = user?.fullName || user?.username || "world";
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Hello{" "}
            {isLogin && displayName ? (
              <Link
                href="/account"
                className="text-primary hover:underline transition-colors underline">
                {displayName}
              </Link>
            ) : (
              "world"
            )}
          </h1>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {!isLogin ? (
            <Link
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="/login"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              Login Now
            </Link>
          ) : (
            <button
              onClick={() => handleLogout()}
              disabled={isLoggingOut}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px] disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoggingOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <LogOut className="size-4" />
                  Logout Now
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
