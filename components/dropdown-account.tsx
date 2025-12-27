import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useUserStore } from '@/stores/userStore';
import { Building2, Calendar, ChevronDown, LogOut, Ticket, UserRound } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useLogout } from '@/hooks/auth';

const DropdownAccount = () => {
  const user = useUserStore((s) => s.user);
  const { mutate: doLogout, isPending } = useLogout();
  return (
    <HoverCard>
      <HoverCardTrigger
        href="javascipt:void(0)"
        className="flex items-center gap-2 cursor-pointer">
        <Avatar>
          <AvatarImage src={user?.avatar || undefined} />
          <AvatarFallback>
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .slice(-2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
        <span>{user?.fullName || user?.username || ""}</span>
        <ChevronDown size={16} />
      </HoverCardTrigger>
      <HoverCardContent align="end" className="mt-2 p-2 w-fit">
        <div className="flex flex-col gap-2">
          <Link 
            href="/account/my-tickets"
            className="flex items-center gap-2 hover:bg-muted p-1 px-2 rounded-sm">
            <Ticket size={16} />
            <span>Vé của tôi</span>
          </Link>
          <Link
            href="/organizer/events"
            className="flex items-center gap-2 hover:bg-muted p-1 px-2 rounded-sm">
            <Calendar size={16} />
            <span>Sự kiện của tôi</span>
          </Link>
          <Link
            href="/organizer/organizations"
            className="flex items-center gap-2 hover:bg-muted p-1 px-2 rounded-sm">
            <Building2 size={16} />
            <span>Tổ chức của tôi</span>
          </Link>
          <Link
            href="/account/profile"
            className="flex items-center gap-2 hover:bg-muted p-1 px-2 rounded-sm">
            <UserRound size={16} />
            <span>Tài khoản của tôi</span>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted p-1 px-2 rounded-sm w-full text-left cursor-pointer">
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Xác nhận đăng xuất
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc muốn đăng xuất không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => doLogout()}
                  disabled={isPending}>
                  {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default DropdownAccount