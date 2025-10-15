import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
//funcion de shadcn no tocar
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
