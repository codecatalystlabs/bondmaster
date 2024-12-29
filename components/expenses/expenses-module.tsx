"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/ui/chart"
import toast from "react-hot-toast"

const formSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  description: z.string().min(1, "Description is required"),
  currency: z.string().min(1, "Currency is required"),
  amount: z.union([z.number().min(1, "Amount is required"), z.number().positive("Amount must be positive")]),
  expense_date: z.date(),
})

type Expense = z.infer<typeof formSchema> & {
  id: string
  created_by: string
  updated_by: string
}

export function ExpensesModule() {
  const [expenses, setExpenses] = React.useState<Expense[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_id: "",
      description: "",
      currency: "USD",
      amount: 0,
      expense_date: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newExpense: Expense = {
      ...values,
      id: Math.random().toString(36).substr(2, 9),
      created_by: "current_user",
      updated_by: "current_user",
    }
    setExpenses([...expenses, newExpense])
    form.reset()
    toast({
      title: "Expense added",
      description: "Your expense has been successfully added.",
    })
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  const expensesByMonth = expenses.reduce((acc, expense) => {
    const month = format(new Date(expense.expense_date), "MMM yyyy")
    if (!acc[month]) {
      acc[month] = 0
    }
    acc[month] += expense.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(expensesByMonth).map(([month, amount]) => ({
    name: month,
    total: amount,
  }))

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="add">Add Expense</TabsTrigger>
        <TabsTrigger value="list">Expense List</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Expense Overview</CardTitle>
            <CardDescription>
              View your expense summary and trends over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalExpenses.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Expense
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${averageExpense.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Number of Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expenses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Latest Expense Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {expenses.length > 0
                      ? format(
                          new Date(
                            Math.max(
                              ...expenses.map((e) =>
                                new Date(e.expense_date).getTime()
                              )
                            )
                          ),
                          "MMM d, yyyy"
                        )
                      : "N/A"}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Expenses Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={chartData}
                  categories={["total"]}
                  index="name"
                  colors={["blue"]}
                  className="h-[200px] mt-6"
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="add">
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>
              Enter the details of your new expense.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="company_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter expense description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expense_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expense Date</FormLabel>
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
                <Button type="submit">Add Expense</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="list">
        <Card>
          <CardHeader>
            <CardTitle>Expense List</CardTitle>
            <CardDescription>
              View and manage your recorded expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.company_id}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.currency}</TableCell>
                    <TableCell>{format(new Date(expense.expense_date), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

