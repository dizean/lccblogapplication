"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const parsedDate =
    value && isValid(parseISO(value)) ? parseISO(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const iso = date.toISOString().split("T")[0];
    onChange(iso);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full px-5 py-6 text-base rounded-xl border border-gray-300 flex items-center gap-3 justify-start ${className}`}
        >
          <CalendarIcon className="h-5 w-5 opacity-70" />
          {parsedDate ? format(parsedDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3" align="start">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={handleSelect}
          autoFocus
          captionLayout="dropdown" 
          fromYear={1980}
          toYear={2035}
        />
      </PopoverContent>
    </Popover>
  );
}