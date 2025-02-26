import { difference, format } from "@std/datetime";

export const formatDate = (date: Date | null, template = "yyyy-MM-dd") =>
  date && format(date, template);

export const relativeTime = (date: Date) => {
  const now = new Date();

  const { years, days, hours, minutes, seconds } = difference(now, date, {
    units: ["years", "days", "hours", "minutes", "seconds"],
  });

  if (years) return `${years}y`;

  if (days) return `${days}d`;

  if (hours) return `${hours}h`;

  if (minutes) return `${minutes}m`;

  if (seconds) return `${seconds}s`;

  return "just now";
};
