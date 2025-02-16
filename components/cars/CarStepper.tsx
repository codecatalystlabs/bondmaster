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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CheckIcon, X } from "lucide-react";
import type { Car } from "@/types/car";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Add this import for file uploads
import  useDropzone  from "react-dropzone";

// Extend the form schema to include car images
const formSchema = z.object({
  // Step 1: Basic Information
  chasis_number: z
    .string()
    .min(17, "Chassis number must be at least 17 characters"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  manufacture_year: z.number().min(1900, "Year must be 1900 or later"),
  first_registration_year: z.number().min(1900, "Year must be 1900 or later"),
  colour: z.string().min(1, "Colour is required"),

  // Step 2: Technical Details
  engine_number: z.string().min(1, "Engine number is required"),
  engine_capacity: z.string().min(1, "Engine capacity is required"),
  transmission: z.string().min(1, "Transmission is required"),
  body_type: z.string().min(1, "Body type is required"),
  maxim_carry: z.number().min(0, "Maximum carry must be 0 or greater"),
  weight: z.number().min(0, "Weight must be 0 or greater"),
  gross_weight: z.number().min(0, "Gross weight must be 0 or greater"),
  length: z.number().min(0, "Length must be 0 or greater"),
  width: z.number().min(0, "Width must be 0 or greater"),
  height: z.number().min(0, "Height must be 0 or greater"),
  millage: z.number().min(0, "Mileage must be 0 or greater"),
  fuel_consumption: z.string().min(1, "Fuel consumption is required"),

  // Step 3: Features
  ps: z.boolean(),
  pw: z.boolean(),
  abs: z.boolean(),
  ads: z.boolean(),
  aw: z.boolean(),
  sw: z.boolean(),
  navigation: z.boolean(),
  ac: z.boolean(),

  // Step 4: Purchase Information
  currency: z.string().min(1, "Currency is required"),
  bid_price: z.number().min(0, "Bid price must be 0 or greater"),
  vat_tax: z.number().nullable(),
  dollar_rate: z.number().min(0, "Dollar rate must be 0 or greater"),
  purchase_date: z.string().min(1, "Purchase date is required"),
  auction: z.string().min(1, "Auction is required"),

  // Step 5: Shipping and Destination
  from_company_id: z.number().min(1, "From company ID is required"),
  to_company_id: z.string().min(1, "Destination company is required"),
  destination: z.string().min(1, "Destination is required"),
  port: z.string().min(1, "Port is required"),
  broker_name: z.string(),
  broker_number: z.string(),
  number_plate: z.string(),
  customer_id: z.number().nullable(),
  car_status: z.string(),
  car_payment_status: z.string(),
  car_photos: z.array(z.instanceof(File)).optional(),
});

type DestinationCompany = {
  id: string;
  name: string;
};

const destinationCompanies: DestinationCompany[] = [
  { id: "1", name: "Company A" },
  { id: "2", name: "Company B" },
  { id: "3", name: "Company C" },
];

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
  { id: 3, name: "Features" },
  { id: 4, name: "Purchase Information" },
  { id: 5, name: "Shipping and Destination" },
];

export function CarForm({
  onSubmit,
  onCancel,
  initialData,
  open,
  onOpenChange,
}: StepperCarFormProps) {
  const [step, setStep] = React.useState(1);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      chasis_number: "",
      make: "",
      model: "",
      manufacture_year: new Date().getFullYear(),
      first_registration_year: new Date().getFullYear(),
      colour: "",
      engine_number: "",
      engine_capacity: "",
      transmission: "",
      body_type: "",
      maxim_carry: 0,
      weight: 0,
      gross_weight: 0,
      length: 0,
      width: 0,
      height: 0,
      millage: 0,
      fuel_consumption: "",
      ps: false,
      pw: false,
      abs: false,
      ads: false,
      aw: false,
      sw: false,
      navigation: false,
      ac: false,
      currency: "",
      bid_price: 0,
      vat_tax: null,
      dollar_rate: 0,
      purchase_date: "",
      auction: "",
      from_company_id: 0,
      to_company_id: "",
      destination: "",
      port: "",
      broker_name: "",
      broker_number: "",
      number_plate: "",
      customer_id: null,
      car_status: "",
      car_payment_status: "",
      car_photos: [],
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      form.setValue("car_photos", acceptedFiles, {
        shouldValidate: true,
      });
      setPreviewImages(acceptedFiles.map((file) => URL.createObjectURL(file)));
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as unknown as Car);
    onOpenChange(false);
    setStep(1);
  }

  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setPreviewImages([]);
    }
  }, [open]);

  React.useEffect(() => {
    // Cleanup function to revoke the data URIs to avoid memory leaks
    return () => previewImages.forEach((url) => URL.revokeObjectURL(url));
  }, [previewImages]);

  const removeImage = (index: number) => {
    const newImages =
      form.getValues("car_photos")?.filter((_, i) => i !== index) || [];
    form.setValue("car_photos", newImages);
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit the car details."
              : "Enter the details for the new car."}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
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
                        className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full hover:bg-primary/80"
                        onClick={() => setStep(stepItem.id)}
                      >
                        <CheckIcon
                          className="w-5 h-5 text-white"
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
                        className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full"
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
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <button
                        type="button"
                        className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                      >
                        <span
                          className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{stepItem.name}</span>
                      </button>
                    </>
                  )}
                  <div className="absolute -bottom-6 w-full text-center">
                    <span className="text-xs font-medium">{stepItem.name}</span>
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
              <div className="grid grid-cols-2 gap-6">
                {step === 1 && (
                  <>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="chasis_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chassis Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter chassis number"
                                {...field}
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
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter make" {...field} />
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
                              <Input placeholder="Enter model" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="manufacture_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacture Year</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="first_registration_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Registration Year</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="colour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Colour</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter colour" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="engine_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Engine Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter engine number"
                                {...field}
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
                          <FormItem>
                            <FormLabel>Engine Capacity</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter engine capacity"
                                {...field}
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
                          <FormItem>
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
                          <FormItem>
                            <FormLabel>Body Type</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter body type" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="maxim_carry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Carry</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gross_weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gross Weight</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="millage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mileage</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fuel_consumption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fuel Consumption</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter fuel consumption"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="ps"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Power Steering</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pw"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Power Windows</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="abs"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>ABS</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ads"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>ADS</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="aw"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Alloy Wheels</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sw"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Steering Wheel Controls</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="navigation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Navigation System</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ac"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Air Conditioning</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
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
                                <SelectItem value="JPY">JPY</SelectItem>
                                <SelectItem value="UGX">UGX</SelectItem>
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
                          <FormItem>
                            <FormLabel>Bid Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
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
                            <FormLabel>VAT Tax (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === null ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="dollar_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dollar Rate</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
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
                          <FormItem>
                            <FormLabel>Purchase Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="auction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Auction</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter auction name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="from_company_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Company ID</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="to_company_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Company</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select destination company" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {destinationCompanies.map((company) => (
                                  <SelectItem
                                    key={company.id}
                                    value={company.id}
                                  >
                                    {company.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              <Input
                                placeholder="Enter destination"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="port"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Port</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter port" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="broker_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Broker Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter broker name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="broker_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Broker Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter broker number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="number_plate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number Plate</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter number plate"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customer_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer ID</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value === null ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="car_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Car Status</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter car status"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="car_payment_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Car Payment Status</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter car payment status"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Add image upload section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="car_photos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Images</FormLabel>
                      <FormControl>
                        <div
                          {...getRootProps()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                        >
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                          <em>(Only image files will be accepted)</em>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {previewImages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Selected Images:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
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
                {step < 5 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(Math.min(5, step + 1))}
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
