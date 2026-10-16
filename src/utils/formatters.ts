export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatTimeRemaining(endTime: number): {
  formatted: string;
  isUrgent: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
} {
  const diff = endTime - Date.now();
  if (diff <= 0) {
    return { formatted: 'Auction Closed', isUrgent: false, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  const isUrgent = diff < 30 * 60 * 1000; // less than 30 mins

  return { formatted, isUrgent, hours, minutes, seconds, isEnded: false };
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(timestamp));
}
