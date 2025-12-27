"use client";

import Link from "next/link";
import { Clock, MapPin, User, CreditCard, Building2, ChevronsUpDown, Check, Tickets } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { UserTicket } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { BANKS } from "@/constants/banks";
import Image from "next/image";
import { useState } from "react";
import { useRefund, useCheckRefund, useCancelRefund } from "@/hooks/ticket";
import { REFUND_TICKET_STATUS } from "@/constants/event";
import { Badge } from "@/components/ui/badge";

interface Props {
  ticket: UserTicket;
}

const TicketCard = ({ ticket }: Props) => {
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isCancelRefundDialogOpen, setIsCancelRefundDialogOpen] = useState(false);
  const [refundReason, setRefundReason] = useState<string>("");
  const [accountHolderName, setAccountHolderName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankId, setBankId] = useState<number>(0);
  const [bankOpen, setBankOpen] = useState(false);

  const refundMutation = useRefund();
  const cancelRefundMutation = useCancelRefund();
  const { data: refundData } = useCheckRefund(ticket.id);

  const event = ticket.areaTicket.event;
  const eventDate = event?.startDate ? new Date(event.startDate) : new Date();
  const day = format(eventDate, "dd", { locale: vi });
  const month = format(eventDate, "MM", { locale: vi });
  const year = format(eventDate, "yyyy", { locale: vi });

  const startTime = event?.startDate
    ? format(new Date(event.startDate), "HH:mm", { locale: vi })
    : "";
  const endTime = event?.endDate
    ? format(new Date(event.endDate), "HH:mm", { locale: vi })
    : "";
  const dateText = event?.startDate
    ? format(new Date(event.startDate), "dd 'tháng' MM, yyyy", { locale: vi })
    : "";

  // Kiểm tra xem sự kiện đã kết thúc chưa
  const now = new Date();
  const hasEnded = event?.endDate && new Date(event.endDate) < now;

  // Kiểm tra xem đã qua 24 giờ kể từ khi mua vé chưa
  const isWithin24Hours = () => {
    if (!ticket.createdAt) return false;
    
    // Parse date string (có thể là "2025-12-01 19:30:10" hoặc ISO string)
    let purchaseDate: Date;
    if (typeof ticket.createdAt === 'string') {
      // Nếu là format "YYYY-MM-DD HH:mm:ss", cần replace space bằng T và thêm timezone
      let dateStr = ticket.createdAt;
      if (!dateStr.includes('T') && !dateStr.includes('Z') && !dateStr.includes('+')) {
        // Format: "2025-12-01 19:30:10" -> "2025-12-01T19:30:10"
        dateStr = dateStr.replace(' ', 'T');
        // Thêm timezone nếu chưa có (giả sử là local time)
        if (!dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-', 10)) {
          // Không thêm timezone, để browser tự parse theo local timezone
        }
      }
      purchaseDate = new Date(dateStr);
    } else {
      purchaseDate = new Date(ticket.createdAt);
    }
    
    // Kiểm tra date hợp lệ
    if (isNaN(purchaseDate.getTime())) {
      console.error('Invalid createdAt date:', ticket.createdAt);
      return false;
    }
    
    const hoursDiff = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60);
    // Cho phép hoàn vé trong vòng 24 giờ (từ 0 đến < 24 giờ)
    // Ví dụ: mua lúc 2025-12-01 19:30:10, sau 2025-12-02 19:30:10 (> 24h) mới không được hoàn vé
    const isWithin = hoursDiff >= 0 && hoursDiff < 24;
    
    // Debug log
    console.log('Refund check:', {
      createdAt: ticket.createdAt,
      purchaseDate: purchaseDate.toISOString(),
      now: now.toISOString(),
      hoursDiff: hoursDiff.toFixed(2),
      isWithin24Hours: isWithin,
      canRefund: event?.isRefund === true && !hasEnded && isWithin,
      hasEnded,
      isRefund: event?.isRefund,
      refundData: refundData?.isRefund,
      showRefundButton: event?.isRefund === true && !hasEnded && isWithin && !refundData?.isRefund
    });
    
    return isWithin;
  };

  // Hiển thị button hoàn vé nếu event cho phép hoàn tiền VÀ chưa kết thúc VÀ trong vòng 24h
  const canRefund = event?.isRefund === true && !hasEnded && isWithin24Hours();

  // Kiểm tra refund status
  const isRefundPending = refundData?.isRefund === true && refundData?.status === REFUND_TICKET_STATUS.PENDING;
  const isRefundSeenOrProcessing = refundData?.status === REFUND_TICKET_STATUS.SEEN || refundData?.status === REFUND_TICKET_STATUS.PROCESSING;
  const isRefundReject = refundData?.status === REFUND_TICKET_STATUS.REJECT;
  const isRefundRefunded = refundData?.status === REFUND_TICKET_STATUS.REFUNDED;
  const isRefundCancel = refundData?.status === REFUND_TICKET_STATUS.CANCEL;
  
  // Chỉ hiển thị button "Yêu cầu hoàn vé" nếu chưa có refund hoặc không phải pending
  const showRefundButton = canRefund && !refundData?.isRefund;
  
  // Chỉ hiển thị button "Yêu cầu huỷ hoàn vé" nếu trong vòng 24h
  const showCancelRefundButton = isRefundPending && isWithin24Hours();

  const handleRefundSubmit = () => {
    refundMutation.mutate(
      {
        ticketId: ticket.id,
        reason: refundReason,
        accountHolderName,
        accountNumber,
        bankId,
      },
      {
        onSuccess: () => {
          // Reset form và đóng dialog
          setRefundReason("");
          setAccountHolderName("");
          setAccountNumber("");
          setBankId(0);
          setIsRefundDialogOpen(false);
        },
      }
    );
  };

  const handleCancelRefund = () => {
    if (!refundData?.refundTicketId) {
      console.error("Không tìm thấy refundTicketId trong refundData:", refundData);
      return;
    }
    
    cancelRefundMutation.mutate(refundData.refundTicketId, {
      onSuccess: () => {
        setIsCancelRefundDialogOpen(false);
      },
    });
  };

  return (
    <div className="flex gap-[2px]">
      <Link href={`/account/ticket/${ticket.id}`} className="flex gap-[2px] flex-1">
      <div className="relative bg-muted p-2 rounded-sm w-[180px] text-center">
        <div className="-top-3 -right-3 absolute bg-background rounded-full size-6"></div>
        <div className="-right-3 -bottom-3 absolute bg-background rounded-full size-6"></div>
        <h3 className="mt-6 font-semibold text-4xl tracking-tight scroll-m-20">
          {day}
        </h3>
        <div>Tháng</div>
        <div>{month}</div>
        <div>{year}</div>
      </div>
      <div className="flex bg-muted p-2 px-5 rounded-sm w-full">
        <div className="flex-1">
          <h4 className="mb-1 font-semibold text-xl tracking-tight scroll-m-20">
            {event?.title || "Chưa có tiêu đề"}
          </h4>
          <div className="flex items-center gap-2 mb-1">
              <Tickets size={16} />
            <span className="text-muted-foreground">
                Số lượng vé: {ticket.quantity}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} />
            <span className="text-muted-foreground">
              {startTime} - {endTime}, {dateText}
            </span>
          </div>
          {event?.venueType === "offline" ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} />
                <span className="text-muted-foreground">
                  {event?.venueName || "Chưa có địa điểm"}
                </span>
              </div>
              <p className="text-muted-foreground">
                {event?.commune}, {event?.district}, {event?.province}
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} />
              <span className="text-muted-foreground">Trực tuyến</span>
            </div>
          )}
        </div>
      </div>
      </Link>
      {canRefund && (
        <div className="relative bg-muted p-2 rounded-sm w-[180px] text-center">
          <div className="-top-3 -left-3 absolute bg-background rounded-full size-6"></div>
          <div className="-left-3 -bottom-3 absolute bg-background rounded-full size-6"></div>
          <div className="flex flex-col gap-2 h-full justify-center py-4">
            {showRefundButton && (
              <Button
                variant="default"
                size="sm"
                className="w-full text-sm"
                onClick={() => {
                  setIsRefundDialogOpen(true);
                }}>
                Yêu cầu hoàn vé
              </Button>
            )}
            {showCancelRefundButton && (
              <Button
                variant="destructive"
                size="sm"
                className="w-full text-sm"
                onClick={() => {
                  setIsCancelRefundDialogOpen(true);
                }}>
                Yêu cầu huỷ hoàn vé
              </Button>
            )}
            {isRefundSeenOrProcessing && (
              <Badge variant="reset" className="text-pending border-pending text-center m-auto py-2">
                Đang xử lý
              </Badge>
            )}
            {isRefundReject && (
              <Badge variant="reset" className="text-destructive border-destructive text-center m-auto py-2">
                Bị từ chối
              </Badge>
            )}
            {isRefundRefunded && (
              <Badge variant="reset" className="text-success border-success text-center m-auto py-2">
                Đã hoàn vé
              </Badge>
            )}
            {isRefundCancel && (
              <Badge variant="reset" className="text-success border-success text-center m-auto py-2">
                Đã hủy hoàn vé
              </Badge>
            )}
          </div>
        </div>
      )}
      
      {/* Dialog yêu cầu hoàn vé */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yêu cầu hoàn vé</DialogTitle>
            <DialogDescription>
              Vui lòng nhập thông tin tài khoản và lý do hoàn vé
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account-holder-name">
                Tên chủ tài khoản{" "}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="account-holder-name"
                  placeholder="NGUYEN VAN A"
                  className="pl-10 uppercase"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">
                Số tài khoản{" "}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <div className="relative">
                <CreditCard className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="account-number"
                  placeholder="1234567890"
                  className="pl-10"
                  maxLength={20}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Ngân hàng{" "}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Popover open={bankOpen} onOpenChange={setBankOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={bankOpen}
                    className={cn(
                      "justify-between w-full",
                      !bankId && "text-muted-foreground"
                    )}>
                    {bankId ? (
                      <div className="flex items-center gap-2">
                        {BANKS.find((bank) => bank.id === bankId) && (
                          <span className="truncate">
                            {BANKS.find((bank) => bank.id === bankId)!.shortName}{" "}
                            - {BANKS.find((bank) => bank.id === bankId)!.name}
                          </span>
        )}
      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>Tìm kiếm ngân hàng...</span>
                      </div>
                    )}
                    <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm kiếm ngân hàng..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy ngân hàng.</CommandEmpty>
                      <CommandGroup>
                        {BANKS.map((bank) => (
                          <CommandItem
                            key={bank.id}
                            value={bank.id + ""}
                            onSelect={() => {
                              setBankId(bank.id);
                              setBankOpen(false);
                            }}>
                            <div className="flex flex-1 items-center gap-2">
                              <figure>
                                <Image
                                  src={bank.logo}
                                  alt={bank.shortName}
                                  width={50}
                                  height={50}
                                  className="bg-white object-contain"
                                />
                              </figure>
                              <span className="flex-1 truncate">
                                {bank.shortName} - {bank.name}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-2 w-4 h-4",
                                bankId === bank.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refund-reason">
                Lý do hoàn vé{" "}
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Textarea
                id="refund-reason"
                placeholder="Nhập lý do bạn muốn hoàn vé..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRefundDialogOpen(false);
                setRefundReason("");
                setAccountHolderName("");
                setAccountNumber("");
                setBankId(0);
              }}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleRefundSubmit}
              disabled={
                refundMutation.isPending ||
                !refundReason.trim() ||
                !accountHolderName.trim() ||
                !accountNumber.trim() ||
                bankId === 0
              }>
              {refundMutation.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận hủy hoàn vé */}
      <AlertDialog open={isCancelRefundDialogOpen} onOpenChange={setIsCancelRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy yêu cầu hoàn vé</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy yêu cầu hoàn vé này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelRefundMutation.isPending}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRefund}
              disabled={cancelRefundMutation.isPending}
              className="bg-destructive hover:bg-destructive/90">
              {cancelRefundMutation.isPending ? "Đang xử lý..." : "Xác nhận hủy"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketCard;
