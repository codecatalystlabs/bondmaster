"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { Invoice, Cost } from "@/types/cost-management"
import { Car } from "@/types/car"

const formSchema = z.object({
  buyerId: z.string().min(1, "Select a buyer"),
  carIds: z.array(z.string()).min(1, "Select at least one car"),
  costIds: z.array(z.string()),
  dueDate: z.date(),
})

interface InvoiceGeneratorProps {
  onSubmit: (invoice: Invoice) => void
  cars: Car[]
  costs: Cost[]
  buyers: { id: string; name: string }[]
}

export function InvoiceGenerator({ onSubmit, cars, costs, buyers }: InvoiceGeneratorProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyerId: "",
      carIds: [],
      costIds: [],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const selectedCars = cars.filter(car => values.carIds.includes(car.id))
    const selectedCosts = costs.filter(cost => values.costIds.includes(cost.id))
    const totalAmount = selectedCars.reduce((sum, car) => sum + car.price, 0) +
      selectedCosts.reduce((sum, cost) => sum + cost.amount, 0)

    const invoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      buyerId: values.buyerId,
      buyerName: buyers.find(buyer => buyer.id === values.buyerId)?.name || "",
      cars: selectedCars,
      costs: selectedCosts,
      totalAmount,
      status: 'draft',
      createdAt: new Date().toISOString(),
      dueDate: values.dueDate.toISOString(),
    }

    onSubmit(invoice)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="buyerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buyer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a buyer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buyers.map((buyer) => (
                    <SelectItem key={buyer.id} value={buyer.id}>
                      {buyer.name}
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
          name="carIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Cars</FormLabel>
                <FormDescription>
                  Select the cars to include in the invoice.
                </FormDescription>
              </div>
              {cars.map((car) => (
                <FormField
                  key={car.id}
                  control={form.control}
                  name="carIds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={car.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(car.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, car.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== car.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {car.make} {car.model} ({car.year}) - ${car.price}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Additional Costs</FormLabel>
                <FormDescription>
                  Select any additional costs to include in the invoice.
                </FormDescription>
              </div>
              {costs.map((cost) => (
                <FormField
                  key={cost.id}
                  control={form.control}
                  name="costIds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={cost.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(cost.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, cost.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== cost.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {cost.type} - ${cost.amount} ({cost.description})
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
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
                        <span>Pick a due date</span>
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
        <Button type="submit">Generate Invoice</Button>
      </form>
    </Form>
  )
}

