'use client';

import * as React from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { CarForm } from './car-form';
import { CarDetailsModal } from './car-details-modal';
import { Car, CarResponse } from '@/types/car';
import useSWR, { mutate } from 'swr';
import { BASE_URL } from '@/constants/baseUrl';
import { addCarExpenses, fetcher } from '@/apis';
import { Loader } from '../ui/loader';
import { AddCarForm } from './AddCarForm';
import toast from 'react-hot-toast';
import { CarExpenseModal } from './car-expense-modal';
import * as z from "zod";
import useUserStore from '@/app/store/userStore';
import { handleDownloadExcel } from '@/lib/utils';


const formSchema = z.object({
	car_id: z.number(),
	description: z.string().min(1, "Description is required"),
	currency: z.string().min(1, "Currency is required"),
	amount: z.union([
		z.number().min(1, "Amount is required"),
		z.number().positive("Amount must be positive"),
	]),
	expense_date: z.string(),
	
});

export function CarInventory() {
    const { data: carList, error, isLoading } = useSWR(`/cars`, fetcher);
const user = useUserStore((state) => state.user);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [selectedCar, setSelectedCar] = React.useState<Car | null | any>(null);
  const [cars, setCars] = React.useState<Car[]>([]);
 const [showExpenseModal, setShowExpenseModal] = React.useState(false);
 const [selectedCarForExpense, setSelectedCarForExpense] = React.useState<
		string | null
	 >(null);
	

  React.useEffect(() => {
    if (carList?.data) {
      const flattenedList = carList?.data.map((item: any) => item.car);

      setCars(flattenedList);
    }
  }, [carList]);

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setShowDetailsModal(true);
  };

  const handleEditCar = (car: any) => {
    setSelectedCar(car);
    setShowEditForm(true);
  };

 

	const handleCarExpenseSubmit = async (data: any) => {
		
		const newExpense: any = {
			...data,
			car_id: selectedCar?.ID || 1,
			created_by: user?.username,
			updated_by: "admin",
		};


		try {
			const response = await addCarExpenses({
				url: `${BASE_URL}/car/expense`,
				expense: newExpense,
			});

			mutate(`${BASE_URL}/expenses`);
			toast.success("Expense added successfully");
			
		} catch (error) {
			console.log(error);
		}
		
		
    };

  const handleUpdateCar = (updatedCar: Car) => {
    setCars(
      carList?.data.map((car: CarResponse) =>
        car?.car_uuid === updatedCar.car_uuid ? updatedCar : car
      )
    );
  };


   console.log(selectedCar,"am selected=>>")

  const columns: ColumnDef<Car>[] = [
    {
      accessorKey: 'chasis_number',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Chasis Number
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('chasis_number')}</div>,
    },
    {
      accessorKey: 'make',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Make
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-[30px]">{row.getValue('make')}</div>
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Model
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-[30px]">{row.getValue('model')}</div>
      ),
    },
    {
      accessorKey: 'maunufacture_year',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Manufactured Year
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-[30px]">{row.getValue('maunufacture_year')}</div>
      ),
    },
    {
      accessorKey: 'engine_capacity',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Engine Capacity
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-[30px]">{row.getValue('engine_capacity')}</div>
      ),
    },

    {
      accessorKey: 'bid_price',
      header: () => <div className="text-right">Bid Price</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('bid_price') ?? 0);
        // const formatted = new Intl.NumberFormat("en-US", {
        // 	style: "currency",
        // 	currency: row.getValue("currency") || "USD",
        // }).format(amount);

        return <div className="text-right font-medium">{amount}</div>;
      },
    },
    {
      id: 'currency',
      accessorKey: 'currency',
      header: 'Currency',
      cell: ({ row }) => <div>{row.getValue('currency') || 'USD'}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const car = row.original;

        return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 w-8 p-0"
					>
						<span className="sr-only">Open menu</span>
						<DotsHorizontalIcon className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(car.vin_number);
                  toast.success("Chasis number copied to clipboard")
            }
						
						}
					>
						Copy car Chasis Number
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => handleViewDetails(car)}
					>
						View details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							console.log("Edit car", car);
							handleEditCar(car);
						}}
					>
						Edit car
					</DropdownMenuItem>
					<DropdownMenuItem className="text-red-600">
						Delete car
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => {
							setSelectedCar(car)
							setShowExpenseModal(true);
						}}
					>
						Add Expense
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
      },
    },
  ];

  const table = useReactTable({
    data: cars || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Car Inventory</CardTitle>
						<div className="flex gap-2">
							
							{/* <Button onClick={handleDownloadPDF}>
								<FileText className="mr-2 h-4 w-4" />{" "}
								Download PDF
							</Button> */}
						</div>
						<CardDescription>
							Manage your car inventory, upload documents,
							and track vehicle details.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="mb-4 flex items-center gap-4">
							<Input
								placeholder="Filter chasis number..."
								value={
									(table
										.getColumn("vin_number")
										?.getFilterValue() as string) ??
									""
								}
								onChange={(event) =>
									table
										.getColumn("vin_number")
										?.setFilterValue(
											event.target.value
										)
								}
								className="max-w-sm"
							/>

							<Button onClick={() => setShowAddForm(true)}>
								<Plus className="mr-2 h-4 w-4" /> Add
								Car
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										Columns{" "}
										<ChevronDownIcon className="ml-2 h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{table
										.getAllColumns()
										.filter((column) =>
											column.getCanHide()
										)
										.map((column) => {
											return (
												<DropdownMenuCheckboxItem
													key={column.id}
													className="capitalize"
													checked={column.getIsVisible()}
													onCheckedChange={(
														value: boolean
													) =>
														column.toggleVisibility(
															!!value
														)
													}
												>
													{column.id}
												</DropdownMenuCheckboxItem>
											);
										})}
								</DropdownMenuContent>
							</DropdownMenu>

							<Button
								onClick={() =>
									handleDownloadExcel(
										cars,
										"Car Data"
									)
								}
							>
								<FileSpreadsheet className="mr-2 h-4 w-4" />{" "}
								Download Excel
							</Button>
						</div>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									{table
										.getHeaderGroups()
										.map((headerGroup) => (
											<TableRow
												key={headerGroup.id}
											>
												{headerGroup.headers.map(
													(column) => (
														<TableCell
															key={
																column.id
															}
														>
															{flexRender(
																column
																	.column
																	.columnDef
																	.header,
																column.getContext()
															)}
														</TableCell>
													)
												)}
											</TableRow>
										))}
								</TableHeader>

								<TableBody>
									{table?.getRowModel()?.rows
										?.length ? (
										table
											.getRowModel()
											.rows.map((row) => (
												<TableRow
													key={row.id}
													data-state={
														row.getIsSelected() &&
														"selected"
													}
												>
													{row
														.getVisibleCells()
														.map(
															(
																cell
															) => (
																<TableCell
																	key={
																		cell.id
																	}
																>
																	{flexRender(
																		cell
																			.column
																			.columnDef
																			.cell,
																		cell.getContext()
																	)}
																</TableCell>
															)
														)}
												</TableRow>
											))
									) : (
										<TableRow>
											<TableCell
												colSpan={
													columns.length
												}
												className="h-24 text-center"
											>
												No cars found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						<div className="flex items-center justify-end space-x-2 py-4">
							<div className="text-muted-foreground flex-1 text-sm">
								{
									table.getFilteredSelectedRowModel()
										.rows.length
								}{" "}
								of{" "}
								{
									table.getFilteredRowModel().rows
										.length
								}{" "}
								row(s) selected.
							</div>
							<div className="space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										table.previousPage()
									}
									disabled={
										!table.getCanPreviousPage()
									}
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
					</CardContent>

					<AddCarForm
						open={showAddForm}
						onOpenChange={setShowAddForm}
						onCancel={() => setShowAddForm(false)}
					/>
					<AddCarForm
						open={showEditForm}
						onOpenChange={setShowEditForm}
						initialData={selectedCar}
						onCancel={() => setShowEditForm(false)}
					/>
					<CarDetailsModal
						open={showDetailsModal}
						onOpenChange={setShowDetailsModal}
						car={selectedCar}
					/>

					<CarExpenseModal
						carId={selectedCar?.ID || ""}
						open={showExpenseModal}
						onOpenChange={setShowExpenseModal}
						onSubmit={handleCarExpenseSubmit}
					/>
				</Card>
			)}
		</>
  );
}
