'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import type { Car } from '@/types/car';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { addCar, fetcher } from '@/apis';
import { BASE_URL } from '@/constants/baseUrl';
import useSWR, { mutate } from 'swr';
import toast from 'react-hot-toast';
import useUserStore from '@/app/store/userStore';
import { steps } from '@/constants/menus';
import { ICurrency } from '@/types/cost-management';
import { ICompany } from '@/types/company';
import { PlusCircle, X } from "lucide-react";


const formSchema = z.object({
	chasis_number: z
		.string()
		.min(17, "Chasis number must be at least 17 characters"),
	engine_number: z.string().min(1, "Engine number is required"),
	engine_capacity: z.string().min(1, "Engine capacity is required"),
	make: z.string().min(1, "Make is required"),
	model: z.string().min(1, "Model is required"),
	maxim_carry: z.number().min(0, "Maximum carry must be 0 or greater"),
	weight: z.number().min(0, "Weight must be 0 or greater"),
	gross_weight: z.number().min(0, "Gross weight must be 0 or greater"),
	length: z.number().min(0, "Length must be 0 or greater"),
	width: z.number().min(0, "Width must be 0 or greater"),
	height: z.number().min(0, "Height must be 0 or greater"),
	maunufacture_year: z.number().min(1900, "Year must be 1900 or later"),
	first_registration_year: z
		.number()
		.min(1900, "Year must be 1900 or later"),
	transmission: z.string().min(1, "Transmission is required"),
	body_type: z.string().min(1, "Body type is required"),
	colour: z.string().min(1, "Colour is required"),
	auction: z.string().optional(),
	currency: z.string().min(1, "Currency is required"),
	millage: z.number().min(0, "Mileage must be 0 or greater"),
	fuel_consumption: z.string().optional(),
	ps: z.boolean(),
	pw: z.boolean(),
	abs: z.boolean(),
	ads: z.boolean(),
	aw: z.boolean(),
	sw: z.boolean(),
	navigation: z.boolean(),
	ac: z.boolean(),
	bid_price: z.number().min(0, "Bid price must be 0 or greater"),
	dollar_rate: z.number().min(0, "Bid price must be 0 or greater"),
	purchase_date: z.string().min(1, "Purchase date is required"),
	from_company_id: z.number().min(1, "From company is required"),
	to_company_id: z.number().min(1, "To company  is required"),
	destination: z.string().optional(),
	port: z.string().optional(),
	broker_name: z.string().optional(),
	broker_number: z.string().optional(),
	vat_tax: z.number().nullable(),
	number_plate: z.string().optional(),
	customer_id: z.number().nullable(),
  car_shipping_invoice_id: z.number().nullable(),
  images:z.array(z.string()).optional(),
	car_status: z.string().optional(),
	car_payment_status: z.string().optional(),
	created_by: z.string().optional(),
	updated_by: z.string().optional(),
});

interface StepperCarFormProps {

  onCancel: () => void;
  initialData?: Car;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}



export function AddCarForm({

  onCancel,
  initialData,
  open,
  onOpenChange,
}: StepperCarFormProps) {
  const [step, setStep] = React.useState(1);
  const [previewImage,setPreviewImage] = React.useState<string[]>([])
  const user = useUserStore((state) => state.user);


  const {
    data: companiesData,
    error: getCompanyError,
    isLoading: isLoadingCompanies,
  } = useSWR(`/companies`, fetcher);

  const {
		data: currencies,
		error: currencyError,
		isLoading: idLoadingCurrency,
  } = useSWR(`/meta/currency`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			chasis_number: "",
			engine_number: "",
			engine_capacity: "",
			make: "",
			model: "",
			maxim_carry: 0,
			weight: 0,
			gross_weight: 0,
			length: 0,
			width: 0,
			height: 0,
			maunufacture_year: new Date().getFullYear(),
			first_registration_year: new Date().getFullYear(),
			transmission: "",
			body_type: "",
			colour: "",
			auction: "",
      currency: "USD",
      dollar_rate:0,
			millage: 0,
      images:[],
			fuel_consumption: "",
			ps: false,
			pw: false,
			abs: false,
			ads: false,
			aw: false,
			sw: false,
			navigation: false,
			ac: false,
			bid_price: 0,
			purchase_date: "",
			from_company_id: user?.company_id,
			to_company_id: 0,
      destination: "",
			port: "",
			broker_name: "",
			broker_number: "",
			vat_tax: null,
			number_plate: "",
			customer_id: null,
			car_status: "",
			car_payment_status: "",
			dollar_rate: 0,
			created_by: "",
			updated_by: "",
		},
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const newPreviewImages: string[] = [];
      const newImageFiles: string[] = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewImages.push(e.target.result as string);
            newImageFiles.push(e.target.result as string)

            setPreviewImage([...previewImage, ...newPreviewImages])
              form.setValue("images", [
				...(form.getValues("images") || []),
				...newImageFiles,
			]);
          }
        }

        reader.readAsDataURL(file)
      })
    }
  }
  
   const removeImage = (index: number) => {
		const updatedPreviewImages = previewImage.filter(
			(_, i) => i !== index
		);
		setPreviewImage(updatedPreviewImages);
		form.setValue("images", updatedPreviewImages);
   };
  
  
  async function handleSubmit(values: z.infer<typeof formSchema>) {

   console.log(values,"values")

    try {
      const response = await addCar({
			url: `${BASE_URL}/car`,
			carInfo: values,
		});

      if (response?.data) {
        toast.success('Car added successfully');
        onOpenChange(false);
        setStep(1); 
       
        mutate(`${BASE_URL}/cars`);
      }
    } catch (error) {
      console.error('Error adding car:', error);
      toast.error('Failed to add car. Please try again.');
    }


    // form.reset()
    setPreviewImage([])
  }

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  React.useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);

  return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[850px] p-6">
				<DialogHeader className=" border-gray-600">
					<DialogTitle className="text-xl">
						{initialData ? "Edit Car" : "Add New Car"}
					</DialogTitle>
					<DialogDescription className="pb-2 text-xs">
						{initialData
							? "Edit the car details."
							: "Enter the details for the new car."}
					</DialogDescription>
				</DialogHeader>
				<div className="w-full mx-auto">
					<nav
						aria-label="Progress"
						className="mb-14 px-2"
					>
						<ol
							role="list"
							className="w-full flex items-center justify-around"
						>
							{steps.map((stepItem, stepIdx) => (
								<li
									key={stepItem.name}
									className={cn(
										"relative",
										stepIdx !==
											steps.length - 1 && ""
									)}
								>
									{stepItem.id < step ? (
										<>
											<div
												className="absolute inset-0 flex items-center justify-start"
												aria-hidden="true"
											>
												<div className="h-0.5 w-full bg-primary" />
											</div>
											<button
												type="button"
												className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-full hover:bg-primary/80"
												onClick={() =>
													setStep(
														stepItem?.id
													)
												}
											>
												<CheckIcon
													className="w-6 h-6 text-white"
													aria-hidden="true"
												/>
												<span className="sr-only text-xs">
													{
														stepItem?.name
													}
												</span>
											</button>
										</>
									) : stepItem.id === step ? (
										<>
											<div
												className="absolute inset-0 flex items-center justify-start"
												aria-hidden="true"
											>
												<div className="w-full bg-gray-200" />
											</div>
											<button
												type="button"
												className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full"
												aria-current="step"
											>
												<span
													className="h-2.5 w-2.5 bg-primary items-center rounded-full"
													aria-hidden="true"
												/>
												<span className="sr-only text-xs text-left">
													{stepItem.name}
												</span>
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
												className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
											>
												<span
													className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
													aria-hidden="true"
												/>
												<span className="sr-only text-xs">
													{stepItem.name}
												</span>
											</button>
										</>
									)}
									<div className="absolute pt-2 w-full justify-center mx-auto top-8 leading-tight ">
										<span className="text-xs items-center justify-center text-center mx-auto">
											{stepItem.name}
										</span>
									</div>
								</li>
							))}
						</ol>
					</nav>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="gap-4 pt-3 border-gray-500 rounded-md pb-4"
						>
							<div className="p-2 grid gap-4 overflow-auto h-[300px]">
								{step === 1 && (
									<>
										<FormField
											control={form.control}
											name="chasis_number"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Chasis
														Number
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter Chasis number"
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
													<FormLabel>
														Make
													</FormLabel>
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
													<FormLabel>
														Model
													</FormLabel>
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
													<FormLabel>
														Manufacture
														Year
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseInt(
																		e
																			.target
																			.value
																	)
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
											name="first_registration_year"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														First
														Registration
														Year
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseInt(
																		e
																			.target
																			.value
																	)
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

								{step === 2 && (
									<>
										<FormField
											control={form.control}
											name="engine_number"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Engine
														Number
													</FormLabel>
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
													<FormLabel>
														Engine
														Capacity
													</FormLabel>
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
													<FormLabel>
														Transmission
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															field.value
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select transmission" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="manual">
																Manual
															</SelectItem>
															<SelectItem value="automatic">
																Automatic
															</SelectItem>
															<SelectItem value="cvt">
																CVT
															</SelectItem>
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
													<FormLabel>
														Body Type
													</FormLabel>
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
										<FormField
											control={form.control}
											name="colour"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Colour
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter colour"
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
											name="images"
											render={({ field }) => (
												<FormItem className="col-span-2">
													<FormLabel>
														Car Images
													</FormLabel>
													<FormControl>
														<Input
															type="file"
															accept="image/*"
															multiple
															onChange={
																handleImageUpload
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{previewImage.length > 0 && (
											<div className="grid grid-cols-3 gap-4 mt-4">
												{previewImage.map(
													(
														image,
														index
													) => (
														<div
															key={
																index
															}
															className="relative"
														>
															<img
																src={
																	image ||
																	"/placeholder.svg"
																}
																alt={`Car preview ${
																	index +
																	1
																}`}
																className="w-full h-32 object-cover rounded"
															/>
															<Button
																type="button"
																variant="destructive"
																size="icon"
																className="absolute top-1 right-1"
																onClick={() =>
																	removeImage(
																		index
																	)
																}
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													)
												)}
											</div>
										)}
									</>
								)}

								{step === 3 && (
									<>
										<FormField
											control={form.control}
											name="length"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Length
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
											name="width"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Width
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
											name="height"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Height
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
											name="weight"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Weight
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
											name="gross_weight"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Gross
														Weight
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
											name="maxim_carry"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Maximum
														Carry
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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

								{step === 4 && (
									<>
										<FormField
											control={form.control}
											name="ps"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														Power
														Steering
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="pw"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														Power
														Windows
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="abs"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														ABS
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ads"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														ADS
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="aw"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														AW
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sw"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														SW
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="navigation"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														Navigation
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ac"
											render={({ field }) => (
												<FormItem className="flex col-span-full items-center">
													<FormLabel className="w-full">
														AC
													</FormLabel>
													<FormControl>
														<Input
															className="h-4"
															type="checkbox"
															{...field}
															checked={
																field.value
															}
															value={
																undefined
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</>
								)}

								{step === 5 && (
									<>
										<FormField
											control={form.control}
											name="currency"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Currency
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															field.value
														}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select currency" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{currencies?.data.map(
																(
																	currency: ICurrency
																) => (
																	<SelectItem
																		key={
																			currency.ID
																		}
																		value={
																			currency.name
																		}
																	>
																		{
																			currency.name
																		}
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="dollar_rate"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
													Dollar Rate
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
											name="bid_price"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Bid Price
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
													<FormLabel>
														Purchase
														Date
													</FormLabel>
													<FormControl>
														<Input
															type="date"
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
											name="millage"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Mileage
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseFloat(
																		e
																			.target
																			.value
																	)
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
											name="fuel_consumption"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Fuel
														Consumption
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter fuel consumption"
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

								{step === 6 && (
									<>
										{/* <FormField
											control={form.control}
											name="from_company_id"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														From
														Company
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(
																e
															) =>
																field.onChange(
																	Number.parseInt(
																		e
																			.target
																			.value
																	)
																)
															}
															className="w-full"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/> */}
										<FormField
											control={form.control}
											name="to_company_id"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Company
													</FormLabel>
													<FormControl>
														<Select
															onValueChange={(
																value
															) => {
																const numberValue =
																	Number(
																		value
																	);
																field.onChange(
																	numberValue
																);
															}}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select  company" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{companiesData?.data.map(
																	(
																		company: ICompany
																	) => (
																		<SelectItem
																			key={
																				company.ID
																			}
																			value={company.ID.toString()}
																		>
																			{
																				company.name
																			}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="destination"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Destination
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter destination"
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
											name="port"
											render={({ field }) => (
												<FormItem className="col-span-full">
													<FormLabel>
														Port
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter port"
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
							</div>
							<div className="flex justify-between pt-6 px-2">
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										setStep(Math.max(1, step - 1))
									}
									disabled={step === 1}
								>
									Previous
								</Button>
								{step < 6 ? (
									<Button
										type="button"
										onClick={() =>
											setStep(
												Math.min(
													6,
													step + 1
												)
											)
										}
									>
										Next
									</Button>
								) : (
									<Button type="submit">
										Add Car
									</Button>
								)}
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
  );
}

