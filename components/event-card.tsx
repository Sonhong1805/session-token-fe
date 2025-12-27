"use client";

import { Calendar, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Event } from "@/types/event";
import formatPrice from "@/utils/format-price";

interface EventCardProps {
  event: Event;
  priority?: boolean;
}

const EventCard = ({ event, priority = false }: EventCardProps) => {
  const getMinPrice = () => {
    if (!event.areaTickets || event.areaTickets.length === 0) {
      return "Miễn phí";
    }

    const prices = event.areaTickets
      .filter((area) => !area.isFree)
      .map((area) => area.price);

    if (prices.length === 0) return "Miễn phí";

    const minPrice = Math.min(...prices);
    return formatPrice(minPrice);
  };

  const minPrice = getMinPrice();
  const isFree = minPrice === "Miễn phí";

  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <div className="inline-block hover:shadow-md p-2 border border-muted hover:border-primary/50 rounded-sm w-full transition-all duration-200">
        <figure className="relative bg-muted aspect-video">
          {event.banner ? (
            <Image
              src={event.banner}
              alt={event.title || "Event preview"}
              className="rounded-md object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              priority={priority}
              fetchPriority={priority ? "high" : "auto"}
            />
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-full text-muted-foreground">
              <ImageIcon className="w-12 h-12" />
              <p className="mt-2 text-sm">Chưa có ảnh</p>
            </div>
          )}
        </figure>
        <div className="mt-2 text-md line-clamp-2">
          <strong className="group-hover:text-primary transition-colors">
            {event.title || "Tiêu đề sự kiện"}
          </strong>
        </div>
        <div className="mt-2 mb-3">
          {!isFree && <span className="text-sm">Giá từ</span>}{" "}
          <span className="font-medium text-success">{minPrice}</span>
        </div>
        <div className="flex gap-3 mb-2 text-sm">
          <Calendar size={16} />
          <div>
            {event.startDate
              ? format(
                  event.startDate instanceof Date
                    ? event.startDate
                    : new Date(event.startDate),
                  "dd/MM/yyyy"
                )
              : "dd/MM/yyyy"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
