"use client"

import * as React from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SaleForm } from "./sale-form"
import { SalesTable } from "./sales-table"
import { SalesVisualization } from "./sales-visualization"
import { EditSaleForm } from "./edit-sale-form"
import { Sale } from "@/types/sale"
import { Car } from "@/types/car"
import { Company } from "@/types/company"
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import toast from "react-hot-toast"

// Mock data for cars and companies
const mockCars: Car[] = [
  { car_uuid: "1", make: "Toyota", model: "Camry", maunufacture_year: 2022 } as Car,
  { car_uuid: "2", make: "Honda", model: "Civic", maunufacture_year: 2021 } as Car,
]

const mockCompanies: Company[] = [
  { 
    id: "1", 
    name: "Sheeraz Motors", 
    contactPerson: "John Bukenya", 
    email: "john@abcmotors.com", 
    phone: "+1234567890", 
    address: "123 Main St, Anytown, USA" 
  },
  { 
    id: "2", 
    name: "XYZ Auto", 
    contactPerson: "Jane Smith", 
    email: "jane@xyzauto.com", 
    phone: "+1987654321", 
    address: "456 Oak Ave, Othertown, USA" 
  },
];

export function SalesModule() {
  const [sales, setSales] = React.useState<Sale[]>([])
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [editingSale, setEditingSale] = React.useState<Sale | null>(null)
 

  const handleAddSale = (newSale: Omit<Sale, "id" | "car" | "company" | "createdAt" | "updatedAt">) => {
    const sale: Sale = {
      ...newSale,
      id: sales.length + 1,
      car: mockCars.find((car) => car.car_uuid === newSale.carId.toString()) as Car,
      company: mockCompanies.find((company) => Number(company.id) === newSale.companyId) as Company,
      installments: newSale.installments?.map((installment, index) => ({
        id: index + 1,
        amount: installment.amount,
        dueDate: format(installment.dueDate, "yyyy-MM-dd"),
        paid: false,
      })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSales([...sales, sale])
    setShowAddForm(false)
      toast.success("New sale has been successfully added")
    }
       
  

  const handleEditSale = (updatedSale: Sale) => {
    setSales(sales.map(sale => sale.id === updatedSale.id ? updatedSale : sale))
    setEditingSale(null)
    toast.success("New sale has been successfully updated")
  }

  const handleInlineEdit = (updatedSale: Sale) => {
    setSales(sales.map(sale => sale.id === updatedSale.id ? updatedSale : sale))
    toast({
      title: "Sale Updated",
      description: "Sale has been successfully updated.",
    })
  }

  const handleInstallmentPayment = (saleId: number, installmentId: number) => {
    setSales(sales.map(sale => {
      if (sale.id === saleId) {
        return {
          ...sale,
          installments: sale.installments.map(installment =>
            installment.id === installmentId ? { ...installment, paid: true } : installment
          ),
        };
      }
      return sale;
    }));
    toast({
      title: "Installment Paid",
      description: "Installment has been marked as paid.",
    })
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text("Sales Report", 14, 15)
    const tableColumn = ["ID", "Total Price", "Sale Date", "Car", "Company", "Payment Type"]
    const tableRows = sales.map(sale => [
      sale.id,
      `$${sale.totalPrice.toFixed(2)}`,
      format(new Date(sale.saleDate), "PPP"),
      `${sale.car.make} ${sale.car.model}`,
      sale.company.name,
      sale.isFullPayment ? "Full Payment" : "Installments"
    ])

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    })

    doc.save("sales_report.pdf")
    toast({
      title: "PDF Downloaded",
      description: "Sales report has been downloaded as PDF.",
    })
  }

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales.map(sale => ({
      ID: sale.id,
      "Total Price": sale.totalPrice,
      "Sale Date": format(new Date(sale.saleDate), "PPP"),
      Car: `${sale.car.make} ${sale.car.model}`,
      Company: sale.company.name,
      "Payment Type": sale.isFullPayment ? "Full Payment" : "Installments"
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales")
    XLSX.writeFile(workbook, "sales_report.xlsx")
    toast({
      title: "Excel Downloaded",
      description: "Sales report has been downloaded as Excel file.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Management</CardTitle>
        <CardDescription>
          Manage and track your car sales, view analytics, and generate reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-4">
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Sale
              </Button>
              {showAddForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Sale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SaleForm onSubmit={handleAddSale} cars={mockCars} companies={mockCompanies} />
                  </CardContent>
                </Card>
              )}
              {editingSale && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Sale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EditSaleForm 
                      sale={editingSale} 
                      onSubmit={handleEditSale} 
                      cars={mockCars} 
                      companies={mockCompanies} 
                      onCancel={() => setEditingSale(null)}
                    />
                  </CardContent>
                </Card>
              )}
              <SalesVisualization sales={sales} />
            </div>
          </TabsContent>
          <TabsContent value="sales">
            <SalesTable 
              data={sales} 
              onInstallmentPayment={handleInstallmentPayment} 
              onEditSale={setEditingSale}
              onInlineEdit={handleInlineEdit}
              onDownloadPDF={handleDownloadPDF}
              onDownloadExcel={handleDownloadExcel}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <SalesVisualization sales={sales} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

