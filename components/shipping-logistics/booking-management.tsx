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
import { Booking, ShippingSchedule } from "@/types/shipping-logistics"
import { Car } from "@/types/car"

const formSchema = z.object({
  scheduleId: z.string().min(1, "Please select a shipping schedule."),
  carIds: z.array(z.string()).min(1, "Please select at least one car."),
  containerNumber: z.string().optional(),
})

// Mock data for demonstration
const schedules: ShippingSchedule[] = [
  {
    id: "1",
    shippingCompanyId: "1",
    vesselName: "Ocean Voyager",
    departurePort: "Yokohama",
    destinationPort: "Mombasa",
    departureTime: "2023-07-15T10:00:00Z",
    estimatedArrivalTime: "2023-08-05T14:00:00Z",
    status: "scheduled",
  },

]

const cars: Car[] = [
  
]

export function BookingManagement() {
  const [bookings, setBookings] = React.useState<Booking[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduleId: "",
      carIds: [],
      containerNumber: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      ...values,
      status: "pending",
      documents: [],
    }
    setBookings([...bookings, newBooking])
    form.reset()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="scheduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Schedule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shipping schedule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id}>
                            {`${schedule.vesselName} - ${schedule.departurePort} to ${schedule.destinationPort}`}
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
                    <FormLabel>Select Cars</FormLabel>
                    {cars.map((car) => (
                      <FormField
                        key={car.ID}
                        control={form.control}
                        name="carIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={car.ID}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <input
                                  type="checkbox"
                                  // checked={field.value?.includes(car.ID)}
                                  onChange={(event) => {
                                    const updatedValue = event.target.checked
                                      ? [...field.value, car.ID]
                                      : field.value?.filter((value) => value !== car.ID);
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {`${car.car_make} ${car.car_model} (${car.manufacture_year}) - ${car.colour}`}
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
                name="containerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Container Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ABCD1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Booking</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Cars</TableHead>
                <TableHead>Container Number</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>
                    {schedules.find(s => s.id === booking.scheduleId)?.vesselName}
                  </TableCell>
                  <TableCell>
                    {booking.carIds.map(id => cars.find(c => c.ID === id)?.chasis_number).join(", ")}
                  </TableCell>
                  <TableCell>{booking.containerNumber || "N/A"}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

