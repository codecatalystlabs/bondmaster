"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ExportReadyCar } from "@/types/export-compliance"

const formSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters."),
  model: z.string().min(2, "Model must be at least 2 characters."),
  year: z.number().min(1900, "Year must be 1900 or later.").max(new Date().getFullYear(), "Year cannot be in the future."),
  emissionsRating: z.string().min(1, "Emissions rating is required."),
  chassisNumber: z.string().min(17, "Chassis number must be 17 characters."),
})

interface CarEntryFormProps {
  onSubmit: (car: ExportReadyCar) => void
}

export function CarEntryForm({ onSubmit }: CarEntryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      emissionsRating: "",
      chassisNumber: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const newCar: ExportReadyCar = {
      id: Math.random().toString(36).substr(2, 9),
      ...values,
      complianceChecks: [],
      exportStatus: 'pending',
      engineCapacity: "",
      mileage: 0,
      condition: "good",
      price: 0,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSubmit(newCar)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emissionsRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emissions Rating</FormLabel>
              <FormControl>
                <Input placeholder="Euro 6" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chassisNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chassis Number</FormLabel>
              <FormControl>
                <Input placeholder="1HGCM82633A123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Car</Button>
      </form>
    </Form>
  )
}

