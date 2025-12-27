export function getDateString(date: Date | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
  }).format(new Date(date));
}
