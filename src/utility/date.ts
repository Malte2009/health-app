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

export function toLocalDateTimeString(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toLocalTimeString(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDateTime(date: string | Date | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleString("de-DE", {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}

export function formatTime(date: string | Date): string {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("de-DE", {
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}

export function createLocalTimeDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
