"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Trash2 } from 'lucide-react'
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Sale } from "@/types/sale"
import { Car } from "@/types/car"
import { Company } from "@/types/company"

const formSchema = z.object({
  totalPrice: z.number().positive("Total price must be positive"),
  saleDate: z.date(),
  carId: z.number().min(1, "Please select a car"),
  companyId: z.string().min(1, "Please select a company"),
  isFullPayment: z.boolean(),
  paymentPeriod: z.number().min(0, "Payment period must be 0 or greater"),
  installments: z.array(z.object({
    amount: z.number().positive("Amount must be positive"),
    dueDate: z.date(),
    paid: z.boolean(),
  })).optional(),
})

interface EditSaleFormProps {
  sale: Sale
  onSubmit: (sale: Sale) => void
  onCancel: () => void
  cars: Car[]
  companies: Company[]
}

export function EditSaleForm({ sale, onSubmit, onCancel, cars, companies }: EditSaleFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalPrice: sale.totalPrice,
      saleDate: new Date(sale.saleDate),
      carId: Number(sale.car.car_uuid),
      companyId: sale.company.id.toString(),
      isFullPayment: sale.isFullPayment,
      paymentPeriod: sale.paymentPeriod,
      installments: sale.installments.map(installment => ({
        ...installment,
        dueDate: new Date(installment.dueDate),
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "installments",
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const updatedSale: Sale = {
      ...sale,
      ...values,
      saleDate: format(values.saleDate, "yyyy-MM-dd"),
      car: cars.find(car => Number(car.car_uuid) === values.carId) as Car,
      company: companies.find(company => company.id.toString() === values.companyId) as Company,
      companyId: Number(values.companyId),
      installments: values.installments?.map((installment, index) => ({
        id: sale.installments[index]?.id || index + 1,
        amount: installment.amount,
        dueDate: format(installment.dueDate, "yyyy-MM-dd"),
        paid: installment.paid,
      })) || [],
      updatedAt: new Date().toISOString(),
    }
    onSubmit(updatedSale)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="totalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="saleDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Sale Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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
                      date > new Date() || date < new Date("1900-01-01")
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
          name="carId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.car_uuid} value={car.car_uuid}>
                      {car.make} {car.model} ({car.maunufacture_year})
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
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
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
          name="isFullPayment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Full Payment</FormLabel>
                <FormDescription>
                  Is this a full payment or a partial payment?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Period (months)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormDescription>
                If this is not a full payment, enter the payment period in months.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {!form.watch("isFullPayment") && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Installments</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end space-x-4">
                <FormField
                  control={form.control}
                  name={`installments.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`installments.${index}.dueDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                              date < new Date()
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
                  name={`installments.${index}.paid`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Paid</FormLabel>
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {fields.length < 4 && (
              <Button type="button" variant="outline" size="sm" onClick={() => append({ amount: 0, dueDate: new Date(), paid: false })}>
                Add Installment
              </Button>
            )}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Update Sale</Button>
        </div>
      </form>
    </Form>
  )
}

