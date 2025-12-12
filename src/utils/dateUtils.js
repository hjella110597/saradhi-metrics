import { parse, parseISO, isValid } from "date-fns";

export function parseDate(dateString) {
  if (!dateString) return new Date();

  // Try ISO format first (2025-12-12)
  let parsed = parseISO(dateString);
  if (isValid(parsed)) return parsed;

  // Try MM/DD/YYYY HH:MM:SS format (12/12/2025 15:05:45)
  const dateOnly = dateString.split(" ")[0];
  parsed = parse(dateOnly, "MM/dd/yyyy", new Date());
  if (isValid(parsed)) return parsed;

  // Try M/D/YYYY format
  parsed = parse(dateOnly, "M/d/yyyy", new Date());
  if (isValid(parsed)) return parsed;

  // Try YYYY-MM-DD format
  parsed = parse(dateOnly, "yyyy-MM-dd", new Date());
  if (isValid(parsed)) return parsed;

  // Fallback to native Date parsing
  return new Date(dateString);
}

export function getDateKey(dateString) {
  const parsed = parseDate(dateString);
  if (!isValid(parsed)) return dateString;
  return parsed.toISOString().split("T")[0];
}
