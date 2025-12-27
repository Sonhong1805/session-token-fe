import { Clock2Icon } from "lucide-react";
import React, { type Dispatch } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface Props {
  date: Date | undefined;
  setDate: Dispatch<React.SetStateAction<Date | undefined>>;
  time: string;
  setTime: Dispatch<React.SetStateAction<string>>;
  disableDate?: (date: Date) => boolean;
  minTime?: string;
  maxTime?: string;
}

export function Calendar16({
  date,
  setDate,
  time,
  setTime,
  disableDate,
  minTime,
  maxTime,
}: Props) {
  return (
    <Card className="flex-row py-1 w-fit">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0"
          disabled={disableDate}
        />
      </CardContent>
      <CardFooter className="flex flex-col px-4 !pt-4 border-l">
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="time-from">Thời gian</Label>
          <div className="relative flex items-center gap-2 w-full">
            <Clock2Icon className="left-2.5 absolute size-4 text-muted-foreground pointer-events-none select-none" />
            <Input
              id="time-from"
              type="time"
              step="1"
              value={time}
              onChange={(e) => {
                if (!e || !e.target) return;
                setTime(e.target.value);
              }}
              min={minTime}
              max={maxTime}
              className="[&::-webkit-calendar-picker-indicator]:hidden pl-8 appearance-none [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
