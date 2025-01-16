import { format } from "@std/datetime/format";

export const formatDate = (date: Date | null, template = "yyyy-MM-dd") =>
  date && format(date, template);
