"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import { Car } from "@/types/car";
import { addCar } from "@/apis";
import { BASE_URL } from "@/constants/baseUrl";
import { mutate } from "swr";

const formSchema = z.object({
    vin_number: z.string().min(17, {
        message: "VIN number must be 17 characters.",
    }),
    make: z.string().min(2, {
        message: "Make must be at least 2 characters.",
    }),
    model: z.string().min(2, {
        message: "Model must be at least 2 characters.",
    }),
    year: z
        .number()
        .min(1900, {
            message: "Year must be 1900 or later.",
        })
        .max(new Date().getFullYear() + 1, {
            message: "Year cannot be in the future.",
        }),
    currency: z.string().min(3, {
        message: "Currency must be at least 3 characters.",
    }),
    bid_price: z.number().min(0, {
        message: "Bid price must be a positive number.",
    }),
    vat_tax: z.number().min(0, {
        message: "VAT tax must be a positive number.",
    }),
    purchase_date: z.date(),
    destination: z.string().min(2, {
        message: "Destination must be at least 2 characters.",
    }),
    from_company_id: z.number().nullable().optional(),
    to_company_id: z.number().nullable().optional(),
    customer_id: z.number().nullable().optional(),
});

interface CarFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    car?: Car;
    onSubmit: (car: Car) => void;
}

export function CarForm({ open, onOpenChange, car, onSubmit }: CarFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: car
            ? {
                  ...car,
                  purchase_date: new Date(car.purchase_date),
              }
            : {
                  vin_number: "",
                  make: "",
                  model: "",
                  year: new Date().getFullYear(),
                  currency: "USD",
                  bid_price: 0,
                  vat_tax: 0,
                  purchase_date: new Date(),
                  destination: "",
                  from_company_id: null,
                  to_company_id: null,
                  customer_id: null,
              },
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        const submittedCar: Car = {
            car_uuid: car?.car_uuid || crypto.randomUUID(),
            ...values,
            to_company_id: values.to_company_id ?? 1,
            from_company_id: values.from_company_id ?? 1,
            purchase_date: values.purchase_date.toISOString().split("T")[0],
            created_by: car?.created_by || "admin",
            updated_by: "admin",
        };

        try {
            const response = await addCar({
                url: `${BASE_URL}/car`,
                carInfo: submittedCar,
            });

            mutate(`${BASE_URL}/cars`);
            if (response.data) {
                toast.success("Car added successfully");
            }
        } catch (error: any) {
            toast.error(error.error.message || "An error occurred");
            console.error("Error submitting form:", error);
        }

        onSubmit(submittedCar);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{car ? "Edit Car" : "Add New Car"}</DialogTitle>
                    <DialogDescription>
                        {car
                            ? "Edit the car details."
                            : "Add a new car to your inventory. Fill in all the required information."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <div className="grid gap-4 py-4 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="vin_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VIN Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1HGCM82633A123456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="make"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Make</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Toyota" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Camry" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="2021"
                                                value={field.value ?? ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ""
                                                            ? undefined
                                                            : parseInt(e.target.value)
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <Input placeholder="USD" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bid_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bid Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="20000.00"
                                                value={field.value ?? ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ""
                                                            ? undefined
                                                            : parseFloat(e.target.value)
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vat_tax"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VAT Tax</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="1000.00"
                                                value={field.value ?? ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ""
                                                            ? undefined
                                                            : parseFloat(e.target.value)
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="purchase_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Purchase Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(field.value, "PPP")
                                                            : "Pick a date"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New York" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Repeat similar patterns for `from_company_id`, `to_company_id`, and `customer_id` */}
                        </div>
                        <DialogFooter>
                            <Button type="submit">{car ? "Update Car" : "Add Car"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
