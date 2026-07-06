import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDeposit(price: number, percentage = 0.5) {
  return Math.round(price * percentage);
}

export function calculateTransferDiscount(price: number, percentage = 0.1) {
  return Math.round(price * (1 - percentage));
}
