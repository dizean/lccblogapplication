export const formatTime = (timeStr: string | undefined | null): string => {
  if (!timeStr) return "--";
  const [hourStr, minute] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12; // midnight
  return `${hour}:${minute} ${ampm}`;
};
export const formatDate = (dateStr?: string | Date): string => {
  if (!dateStr) return "--";

  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
