"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShippingCompany, ShippingSchedule } from "@/types/shipping-logistics"

const formSchema = z.object({
  shippingCompanyId: z.string().min(1, "Please select a shipping company."),
  vesselName: z.string().min(2, "Vessel name must be at least 2 characters."),
  departurePort: z.string().min(2, "Departure port must be at least 2 characters."),
  destinationPort: z.string().min(2, "Destination port must be at least 2 characters."),
  departureTime: z.string().min(1, "Please select a departure time."),
  estimatedArrivalTime: z.string().min(1, "Please select an estimated arrival time."),
})

// Mock data for demonstration
const companies: ShippingCompany[] = [
  {
    id: "1",
    name: "OceanFreight Ltd",
    contactPerson: "John Doe",
    email: "john@oceanfreight.com",
    phone: "+1234567890",
    shippingRoutes: ["Yokohama → Mombasa", "Tokyo → Dar es Salaam"],
    rates: [
      { route: "Yokohama → Mombasa", rate: 2000 },
      { route: "Tokyo → Dar es Salaam", rate: 2200 },
    ],
  },
  // Add more mock data as needed
]

export function ScheduleManagement() {
  const [schedules, setSchedules] = React.useState<ShippingSchedule[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingCompanyId: "",
      vesselName: "",
      departurePort: "",
      destinationPort: "",
      departureTime: "",
      estimatedArrivalTime: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newSchedule: ShippingSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      ...values,
      status: "scheduled",
    }
    setSchedules([...schedules, newSchedule])
    form.reset()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Shipping Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="shippingCompanyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Company</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shipping company" />
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
                name="vesselName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vessel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ocean Voyager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departurePort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Port</FormLabel>
                    <FormControl>
                      <Input placeholder="Yokohama" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Port</FormLabel>
                    <FormControl>
                      <Input placeholder="Mombasa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedArrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Arrival Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Schedule</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vessel</TableHead>
                <TableHead>Departure Port</TableHead>
                <TableHead>Destination Port</TableHead>
                <TableHead>Departure Time</TableHead>
                <TableHead>Estimated Arrival</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.vesselName}</TableCell>
                  <TableCell>{schedule.departurePort}</TableCell>
                  <TableCell>{schedule.destinationPort}</TableCell>
                  <TableCell>{new Date(schedule.departureTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(schedule.estimatedArrivalTime).toLocaleString()}</TableCell>
                  <TableCell>{schedule.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

