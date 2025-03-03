"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

interface PaymentDeposit {
  bank_name: string;
  bank_account: string;
  bank_branch: string;
  amount_deposited: number;
  date_deposited: string;
  deposit_scan: string;
  sale_payment_id: number;
  created_by: string;
  updated_by: string;
}

interface DataTableProps {
  data: PaymentDeposit[];
}

export function PaymentDepositsTable({ data }: DataTableProps) {
  const columns: ColumnDef<PaymentDeposit>[] = [
    { accessorKey: "bank_name", header: "Bank Name" },
    { accessorKey: "bank_account", header: "Bank Account" },
    { accessorKey: "bank_branch", header: "Bank Branch" },
    { accessorKey: "amount_deposited", header: "Amount Deposited" },
    { accessorKey: "date_deposited",
         header: "Date Deposited" ,
         cell: ({ row }) =>
            new Date(row.getValue("date_deposited")).toLocaleDateString(),
        },
    { accessorKey: "created_by", header: "Created By" },
    { accessorKey: "updated_by", header: "Updated By" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No deposits found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
