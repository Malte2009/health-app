export function getDateString(date: Date | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
  }).format(new Date(date));
}

export function toLocalIsoDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

