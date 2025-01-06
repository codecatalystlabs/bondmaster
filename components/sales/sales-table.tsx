"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { Edit2, Save, X, FileText, FileSpreadsheet } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sale } from "@/types/sale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SalesTableProps {
  data: Sale[]
  onInstallmentPayment: (saleId: number, installmentId: number) => void
  onEditSale: (sale: Sale) => void
  onInlineEdit: (updatedSale: Sale) => void
  onDownloadPDF: () => void
  onDownloadExcel: () => void
}

export function SalesTable({ 
  data, 
  onInstallmentPayment, 
  onEditSale, 
  onInlineEdit,
  onDownloadPDF,
  onDownloadExcel 
}: SalesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [editingRow, setEditingRow] = React.useState<number | null>(null)

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => {
        const isEditing = editingRow === row.original.id
        const amount = parseFloat(row.getValue("totalPrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)

        return isEditing ? (
          <Input 
            type="number" 
            defaultValue={amount} 
            onChange={(e) => {
              const updatedSale = { ...row.original, totalPrice: parseFloat(e.target.value) }
              onInlineEdit(updatedSale)
            }}
          />
        ) : (
          <div className="font-medium">{formatted}</div>
        )
      },
    },
    {
      accessorKey: "saleDate",
      header: "Sale Date",
      cell: ({ row }) => {
        const isEditing = editingRow === row.original.id
        const date = row.getValue("saleDate") as string

        return isEditing ? (
          <Input 
            type="date" 
            defaultValue={date} 
            onChange={(e) => {
              const updatedSale = { ...row.original, saleDate: e.target.value }
              onInlineEdit(updatedSale)
            }}
          />
        ) : (
          format(new Date(date), "PPP")
        )
      },
    },
    {
      accessorKey: "car.make",
      header: "Car Make",
    },
    {
      accessorKey: "car.model",
      header: "Car Model",
    },
    {
      accessorKey: "company.name",
      header: "Company",
    },
    {
      accessorKey: "isFullPayment",
      header: "Payment Type",
      cell: ({ row }) => {
        const isEditing = editingRow === row.original.id
        const isFullPayment = row.getValue("isFullPayment") as boolean

        return isEditing ? (
          <Select 
            defaultValue={isFullPayment ? "full" : "installments"}
            onValueChange={(value) => {
              const updatedSale = { ...row.original, isFullPayment: value === "full" }
              onInlineEdit(updatedSale)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Payment</SelectItem>
              <SelectItem value="installments">Installments</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          isFullPayment ? "Full Payment" : "Installments"
        )
      },
    },
    {
      accessorKey: "installments",
      header: "Installments",
      cell: ({ row }) => {
        const sale = row.original;
        const installments = sale.installments || [];
        const [isOpen, setIsOpen] = React.useState(false);

        return (
          <div>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              View Installments ({installments.length})
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Installments for Sale #{sale.id}</DialogTitle>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installments.map((installment, index) => (
                      <TableRow key={installment.id}>
                        <TableCell>{installment.amount}</TableCell>
                        <TableCell>{format(new Date(installment.dueDate), "PPP")}</TableCell>
                        <TableCell>{installment.paid ? "Paid" : "Pending"}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onInstallmentPayment(sale.id, installment.id);
                              setIsOpen(false);
                            }}
                            disabled={installment.paid}
                          >
                            Mark as Paid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
    {
      accessorKey: "paymentPeriod",
      header: "Payment Period",
      cell: ({ row }) => {
        const isEditing = editingRow === row.original.id
        const paymentPeriod = row.getValue("paymentPeriod") as number

        return isEditing ? (
          <Input 
            type="number" 
            defaultValue={paymentPeriod} 
            onChange={(e) => {
              const updatedSale = { ...row.original, paymentPeriod: parseInt(e.target.value) }
              onInlineEdit(updatedSale)
            }}
          />
        ) : (
          `${paymentPeriod} months`
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isEditing = editingRow === row.original.id

        return isEditing ? (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setEditingRow(null)}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditingRow(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setEditingRow(row.original.id)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEditSale(row.original)}>
              Edit
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by company..."
          value={(table.getColumn("company.name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("company.name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onDownloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onDownloadExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Download Excel
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

