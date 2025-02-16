"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Edit2,
  Save,
  X,
  FileText,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sale } from "@/types/sale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSale } from "@/apis";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { BASE_URL } from "@/constants/baseUrl";

interface SalesTableProps {
  data: Sale[];
  onInstallmentPayment: (saleId: number, installmentId: number) => void;
  onEditSale: (sale: Sale) => void;
  onInlineEdit: (updatedSale: Sale) => void;
  onDownloadPDF: () => void;
  onDownloadExcel: () => void;
  onDeleteSale: () => void;
}

export function SalesTable({
  data,
  onInstallmentPayment,
  onEditSale,
  onInlineEdit,
  onDownloadPDF,
  onDownloadExcel,
  onDeleteSale,
}: SalesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [editingRow, setEditingRow] = React.useState<number | null>(null);
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const openEditDialog = (sale: Sale) => {
    setSelectedSale(sale);
    setDialogOpen(true);
  };

  const closeEditDialog = () => {
    setDialogOpen(false);
    setSelectedSale(null);
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "ID",
      header: "ID",
    },
    {
      accessorKey: "total_price",
      header: "Total Price",
      cell: ({ row }: any) => {
        const isEditing = editingRow === row.original.ID;
        const amount = parseFloat(row.getValue("total_price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return isEditing ? (
          <Input
            type="number"
            defaultValue={amount}
            onChange={(e) => {
              const updatedSale = {
                ...row.original,
                total_price: parseFloat(e.target.value),
              };
              onInlineEdit(updatedSale);
            }}
          />
        ) : (
          <div className="font-medium">{formatted}</div>
        );
      },
    },
    {
      accessorKey: "sale_date",
      header: "Sale Date",
      cell: ({ row }) =>
        new Date(row.getValue("sale_date")).toLocaleDateString(),
    },
    {
      accessorKey: "Car.make",
      header: "Car Make",
    },
    {
      accessorKey: "Car.car_model",
      header: "Car Model",
    },
    {
      accessorKey: "Company.name",
      header: "Company",
    },
    {
      accessorKey: "is_full_payment",
      header: "Payment Type",
      cell: ({ row }: any) => {
        const isEditing = editingRow === row.original.ID;
        const is_full_payment = row.getValue("is_full_payment") as boolean;

        return isEditing ? (
          <Select
            defaultValue={is_full_payment ? "full" : "installments"}
            onValueChange={(value) => {
              const updatedSale = {
                ...row.original,
                is_full_payment: value === "full",
              };
              onInlineEdit(updatedSale);
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
        ) : is_full_payment ? (
          "Full Payment"
        ) : (
          "Installments"
        );
      },
    },
    {
      accessorKey: "payment_period",
      header: "Payment Period",
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteSale(row.original.ID)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSaleUpdate = async () => {
    try {
      console.log(selectedSale, "ajkaajaj");
      const response = await updateSale({
        url: `sale/${selectedSale?.ID}`,
        sale: selectedSale,
      });

      if (response.data) {
        closeEditDialog();
        toast.success("New sale has been successfully added");
      }
      mutate(`${BASE_URL}/sales`);
    } catch (error) {
      toast.error("Error Fetching sales");
    }
  };

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
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by company..."
          value={
            (table.getColumn("company.name")?.getFilterValue() as string) ?? ""
          }
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
                  );
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="mt-2">
                <label>Total Price</label>
                <Input
                  defaultValue={selectedSale.total_price}
                  onChange={(e) =>
                    setSelectedSale({
                      ...selectedSale,
                      total_price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="mt-2">
                <label>Sale Date</label>
                <Input
                  type="date"
                  defaultValue={selectedSale.sale_date}
                  onChange={(e) =>
                    setSelectedSale({
                      ...selectedSale,
                      sale_date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mt-2">
                <label>Make</label>
                <Input defaultValue={selectedSale?.Car.make} disabled />
              </div>
              <div className="mt-2">
                <label>Model</label>
                <Input defaultValue={selectedSale.Car.model} disabled />
              </div>

              <div className="mt-2">
                <label>Payment Type</label>
                <Select
                  value={selectedSale.is_full_payment ? "true" : "false"} // Convert boolean to string for Select
                  onValueChange={(value) =>
                    setSelectedSale({
                      ...selectedSale,
                      is_full_payment: value === "true", // Convert string back to boolean
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option">
                      {selectedSale.is_full_payment
                        ? "Full Payment"
                        : "Installments"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Full Payment</SelectItem>
                    <SelectItem value="false">Installments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-2">
                <label>Payment Periods</label>
                <Input
                  defaultValue={selectedSale.payment_period}
                  onChange={(e) =>
                    setSelectedSale({
                      ...selectedSale,
                      payment_period: parseInt(e.target.value, 10),
                    })
                  }
                />
              </div>

              <Button onClick={handleSaleUpdate}>Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
