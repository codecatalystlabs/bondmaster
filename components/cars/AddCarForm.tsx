"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import type { Car } from "@/types/car";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formSchema = z.object({
  // Step 1: Basic Information
  vin_number: z.string().min(17, "VIN must be at least 17 characters"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  maunufacture_year: z.number().min(1900, "Year must be 1900 or later"),

  // Step 2: Technical Details
  engine_number: z.string().min(1, "Engine number is required"),
  engine_capacity: z.string().min(1, "Engine capacity is required"),
  transmission: z.string().min(1, "Transmission is required"),
  body_type: z.string().min(1, "Body type is required"),

  // Step 3: Purchase Information
  currency: z.string().min(1, "Currency is required"),
  bid_price: z.number().min(0, "Bid price must be 0 or greater"),
  purchase_date: z.string().min(1, "Purchase date is required"),
  expenses: z.number().min(0, "Expenses must be 0 or greater"),
});

interface StepperCarFormProps {
  onSubmit: (car: Car) => void;
  onCancel: () => void;
  initialData?: Car;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Technical Details" },
  { id: 3, name: "Purchase Information" },
];

export function AddCarForm({
  onSubmit,
  onCancel,
  initialData,
  open,
  onOpenChange,
}: StepperCarFormProps) {
  const [step, setStep] = React.useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      vin_number: "",
      make: "",
      model: "",
      maunufacture_year: new Date().getFullYear(),
      engine_number: "",
      engine_capacity: "",
      transmission: "",
      body_type: "",
      currency: "USD",
      bid_price: 0,
      purchase_date: "",
      expenses: 0,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as Car);
    onOpenChange(false);
    setStep(1); // Reset step when form is submitted
  }

  React.useEffect(() => {
    if (!open) {
      setStep(1); // Reset step when dialog is closed
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit the car details."
              : "Enter the details for the new car."}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full max-w-3xl mx-auto">
          <nav aria-label="Progress" className="mb-8">
            <ol role="list" className="flex items-center justify-between">
              {steps.map((stepItem, stepIdx) => (
                <li
                  key={stepItem.name}
                  className={cn(
                    "relative",
                    stepIdx !== steps.length - 1 && "pr-8 sm:pr-20"
                  )}
                >
                  {stepItem.id < step ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-primary" />
                      </div>
                      <button
                        type="button"
                        className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-full hover:bg-primary/80"
                        onClick={() => setStep(stepItem.id)}
                      >
                        <CheckIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{stepItem.name}</span>
                      </button>
                    </>
                  ) : stepItem.id === step ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <button
                        type="button"
                        className="relative w-10 h-10 flex items-center justify-center bg-white border-2 border-primary rounded-full"
                        aria-current="step"
                      >
                        <span
                          className="h-2.5 w-2.5 bg-primary rounded-full"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{stepItem.name}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200 ml-2" />
                      </div>
                      <button
                        type="button"
                        className="group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                      >
                        <span
                          className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{stepItem.name}</span>
                      </button>
                    </>
                  )}
                  <div
                    className={cn(
                      "absolute top-14 text-sm font-medium text-center",
                      stepIdx === 0 && "left-0 w-full",
                      stepIdx === 1 && "left-1/2 -translate-x-1/2 w-full",
                      stepIdx === 2 && "right-8 w-full"
                    )}
                  >
                    {stepItem.name}
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="vin_number"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>VIN Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter VIN number"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter make"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter model"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maunufacture_year"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Manufacture Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="engine_number"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Engine Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter engine number"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="engine_capacity"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Engine Capacity</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter engine capacity"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transmission"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Transmission</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transmission" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="automatic">
                                Automatic
                              </SelectItem>
                              <SelectItem value="cvt">CVT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="body_type"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Body Type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter body type"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bid_price"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Bid Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
                              }
                              className="w-full"
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
                        <FormItem className="col-span-full">
                          <FormLabel>Purchase Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expenses"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Car Expenses</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(Math.min(3, step + 1))}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
