"use client"

import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface DatePickerProps {
    value: string
    onChange: (date: string) => void
    className?: string
}

export default function DatePicker({ value, onChange, className = "" }: DatePickerProps) {
    const [open, setOpen] = useState(false)

    const handleSelect = (date: Date | undefined) => {
        if (!date) return
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        const iso = `${year}-${month}-${day}`
        onChange(iso)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`px-6 py-8 text-xl rounded-xl border border-gray-300 flex items-center gap-3 ${className}`}
                >
                    <CalendarIcon className="h-6 w-6 opacity-70" />
                    {value ? format(new Date(value), "PPP") : "Pick a date"}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[600px] h-[600px] flex justify-center items-center overflow-hidden" align="center">
                <div className="scale-[1.7]">
                    <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        onSelect={handleSelect}
                        initialFocus
                        className="w-80 h-80 text-2xl"
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
