"use client"

import * as React from "react"
import { Plus, Minus } from 'lucide-react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Car } from "@/types/car"
import { ShippingContainer, ShippingOrder, ShippingOrderItem } from "@/types/shipping"

const cars: Car[] = [
 
]

const containers: ShippingContainer[] = [
  { id: "1", name: "Standard Container", maxCapacity: 4, dimensions: { length: 5.9, width: 2.35, height: 2.39 }, maxWeight: 26000 },
  { id: "2", name: "Large Container", maxCapacity: 6, dimensions: { length: 12.2, width: 2.44, height: 2.59 }, maxWeight: 30480 },
]

const formSchema = z.object({
  items: z.array(z.object({
    carId: z.string().min(1, "Select a car"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  })).min(1, "Add at least one car"),
  container: z.string().min(1, "Select a container"),
})

export function ShippingPreparation() {
  const [orders, setOrders] = React.useState<ShippingOrder[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ carId: "", quantity: 1 }],
      container: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedItems: ShippingOrderItem[] = values.items.map(item => ({
      car: cars.find(car => car.ID === item.carId)!,
      quantity: item.quantity,
    }))
    const selectedContainer = containers.find(container => container.id === values.container)

    if (selectedContainer) {
      const newOrder: ShippingOrder = {
        id: Math.random().toString(36).substr(2, 9),
        orderNumber: `SO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        items: selectedItems,
        container: selectedContainer,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setOrders([...orders, newOrder])
      form.reset()
    }
  }

  const calculateTotalWeight = (items: ShippingOrderItem[]) => {
    // Assuming an average car weight of 1500 kg
    return items.reduce((total, item) => total + (item.quantity * 1500), 0)
  }

  const calculateTotalVolume = (items: ShippingOrderItem[]) => {
    // Assuming average car dimensions: length: 4.5m, width: 1.8m, height: 1.5m
    const carVolume = 4.5 * 1.8 * 1.5
    return items.reduce((total, item) => total + (item.quantity * carVolume), 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Preparation</CardTitle>
        <CardDescription>
          Generate shipping orders and assign cars to containers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.carId`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Select Car</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a car" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cars.map((car) => (
                            car.ID ? (
                              <SelectItem key={car.ID} value={car.ID}>
                                {car.make} {car.model} ({car.manufacture_year})
                              </SelectItem>
                            ) : null
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ carId: "", quantity: 1 })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Car
            </Button>
            <FormField
              control={form.control}
              name="container"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Container</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a container" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {containers.map((container) => (
                        <SelectItem key={container.id} value={container.id}>
                          {container.name} (Capacity: {container.maxCapacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a container based on the number of cars and their total dimensions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Generate Shipping Order</Button>
          </form>
        </Form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Shipping Orders</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Cars</TableHead>
                <TableHead>Container</TableHead>
                <TableHead>Total Weight</TableHead>
                <TableHead>Total Volume</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>
                    {order.items.map((item: ShippingOrderItem) => `${item.car.make} ${item.car.model} (x${item.quantity})`).join(', ')}
                  </TableCell>
                  <TableCell>{order.container?.name}</TableCell>
                  <TableCell>{calculateTotalWeight(order.items)} kg</TableCell>
                  <TableCell>{calculateTotalVolume(order.items).toFixed(2)} m³</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

