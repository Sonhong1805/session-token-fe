import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/contexts/query-provider";
import AuthBootstrap from "@/contexts/auth-bootstrap";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Event Ticket - Platform bán vé sự kiện",
  description:
    "Nền tảng bán vé sự kiện trực tuyến, quản lý sự kiện và tổ chức hiệu quả",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
      <QueryProvider>
            <AuthBootstrap />
            {children}
          </QueryProvider>
      </body>
    </html>
  );
}
