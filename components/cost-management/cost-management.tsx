"use client"

import * as React from "react"
import { CostForm } from "./cost-form"
import { InvoiceGenerator } from "./invoice-generator"
import { Cost, Invoice, CostCategory } from "@/types/cost-management"
import { Car } from "@/types/car"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const cars: Car[] = [
  { id: "1", make: "Toyota", model: "Camry", year: 2020, chassisNumber: "ABC123", engineCapacity: "2.5L", mileage: 50000, condition: "excellent", price: 25000, documents: [], createdAt: "", updatedAt: "" },
  { id: "2", make: "Honda", model: "Civic", year: 2021, chassisNumber: "DEF456", engineCapacity: "1.8L", mileage: 30000, condition: "good", price: 22000, documents: [], createdAt: "", updatedAt: "" },
]

const buyers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
]

const initialCostCategories: CostCategory[] = [
  { id: "1", name: "inspection" },
  { id: "2", name: "cleaning" },
  { id: "3", name: "inland_transport" },
  { id: "4", name: "customs" },
  { id: "5", name: "storage" },
  { id: "6", name: "repairs" },
  { id: "7", name: "documentation" },
  { id: "8", name: "other" },
]

export function CostManagement() {
  const [costs, setCosts] = React.useState<Cost[]>([])
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [costCategories, setCostCategories] = React.useState<CostCategory[]>(initialCostCategories)

  const handleCostSubmit = (cost: Cost) => {
    setCosts([...costs, cost])
  }

  const handleInvoiceSubmit = (invoice: Invoice) => {
    setInvoices([...invoices, invoice])
  }

  const handleAddCategory = (category: CostCategory) => {
    setCostCategories([...costCategories, category])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Management</CardTitle>
        <CardDescription>
          Record costs and generate invoices for car buyers or Ugandan agents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="costs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="costs">Record Costs</TabsTrigger>
            <TabsTrigger value="invoices">Generate Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="costs">
            <div className="space-y-4">
              <CostForm 
                onSubmit={handleCostSubmit} 
                cars={cars} 
                costCategories={costCategories}
                onAddCategory={handleAddCategory}
              />
              <div>
                <h3 className="text-lg font-semibold mb-2">Recorded Costs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Car</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costs.map((cost) => (
                      <TableRow key={cost.id}>
                        <TableCell>{cars.find(car => car.id === cost.carId)?.model}</TableCell>
                        <TableCell>{cost.type}</TableCell>
                        <TableCell>${cost.amount}</TableCell>
                        <TableCell>{cost.description}</TableCell>
                        <TableCell>{new Date(cost.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="invoices">
            <div className="space-y-4">
              <InvoiceGenerator onSubmit={handleInvoiceSubmit} cars={cars} costs={costs} buyers={buyers} />
              <div>
                <h3 className="text-lg font-semibold mb-2">Generated Invoices</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.buyerName}</TableCell>
                        <TableCell>${invoice.totalAmount}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

