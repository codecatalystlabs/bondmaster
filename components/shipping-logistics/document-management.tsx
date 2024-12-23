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
import { Booking } from "@/types/shipping-logistics"

const formSchema = z.object({
  bookingId: z.string().min(1, "Please select a booking."),
  documentType: z.enum(["bill-of-lading", "booking-confirmation", "packing-list", "shipping-manifest"]),
  documentUrl: z.string().url("Please enter a valid URL."),
})

// Mock data for demonstration
const bookings: Booking[] = [
  {
    id: "1",
    scheduleId: "1",
    carIds: ["1", "2"],
    status: "confirmed",
    documents: [],
  },
  // Add more mock data as needed
]

export function DocumentManagement() {
  const [documents, setDocuments] = React.useState<{ bookingId: string; type: string; url: string }[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingId: "",
      documentType: "bill-of-lading",
      documentUrl: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newDocument = {
      bookingId: values.bookingId,
      type: values.documentType,
      url: values.documentUrl,
    }
    setDocuments([...documents, newDocument])
    form.reset()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="bookingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a booking" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bookings.map((booking) => (
                          <SelectItem key={booking.id} value={booking.id}>
                            {`Booking ${booking.id}`}
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
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bill-of-lading">Bill of Lading</SelectItem>
                        <SelectItem value="booking-confirmation">Booking Confirmation</SelectItem>
                        <SelectItem value="packing-list">Packing List</SelectItem>
                        <SelectItem value="shipping-manifest">Shipping Manifest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/document.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Upload Document</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell>{doc.bookingId}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Document
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

