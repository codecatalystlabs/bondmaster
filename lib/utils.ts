import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from 'xlsx';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const handleDownloadExcel = (dataArray: any, fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(dataArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `${fileName}`);
  XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
};

export const formatAmount = (amount: number | undefined | null, currency: string = '') => {
  if (amount === undefined || amount === null) return '0';

  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount);

  return currency ? `${currency}${formattedNumber}` : formattedNumber;
};