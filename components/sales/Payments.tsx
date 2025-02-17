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
import PaymentDialog from "./PaymentModal";
import { Button } from "../ui/button";

interface Payment {
  id: number;
  mode_of_payment: string;
  transaction_id: string;
  sale_payment_id: number;
  created_by: string;
  updated_by: string;
}

interface DataTableProps {
  data: Payment[];
}

export function PaymentsTable({ data }: DataTableProps) {
    const [openDialog, setOpenDialog] = React.useState(false);

  const columns: ColumnDef<Payment>[] = [
    { accessorKey: "ID", header: "ID" },
    { accessorKey: "mode_of_payment", header: "Payment Mode" },
    { accessorKey: "transaction_id", header: "Transaction ID" },
    { accessorKey: "sale_payment_id", header: "Sale Payment ID" },
    { accessorKey: "created_by", header: "Created By" },
    { accessorKey: "updated_by", header: "Updated By" },
  ];



  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border p-4">
              <Button onClick={() => setOpenDialog(true)} className="mb-4">New Payment</Button>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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
                No payments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaymentDialog open={openDialog} onOpenChange={setOpenDialog}  />

    </div>
  );
}
