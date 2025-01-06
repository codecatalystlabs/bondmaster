// "use client"

// import * as React from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { ExportReadyCar } from "@/types/export-compliance"

// const formSchema = z.object({
//   make: z.string().min(2, "Make must be at least 2 characters."),
//   model: z.string().min(2, "Model must be at least 2 characters."),
//   year: z.number().min(1900, "Year must be 1900 or later.").max(new Date().getFullYear(), "Year cannot be in the future."),
//   emissionsRating: z.string().min(1, "Emissions rating is required."),
//   chassisNumber: z.string().min(17, "Chassis number must be 17 characters."),
// })

// interface CarEntryFormProps {
//   onSubmit: (car: ExportReadyCar) => void
// }

// export function CarEntryForm({ onSubmit }: CarEntryFormProps) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       make: "",
//       model: "",
//       year: new Date().getFullYear(),
//       emissionsRating: "",
//       chassisNumber: "",
//     },
//   })

// function handleSubmit(values: z.infer<typeof formSchema>) {
//   const newCar: ExportReadyCar = {
//     ...values,
//     car_uuid: values.car_uuid || "",           
//     vin_number: values.vin_number || "",       
//     engine_number: values.engine_number || "", 
//     maxim_carry: values.maxim_carry || 0,      
//     weight: values.weight || 0,               
//     gross_weight: values.gross_weight || 0,
//     ff_weight: values.ff_weight || 0,
//     rr_weight: values.rr_weight || 0,
//     fr_weight: values.fr_weight || 0,
//     rf_weight: values.rf_weight || 0,
//     weight_units: values.weight_units || "kg",
//     length: values.length || 0,
//     width: values.width || 0,
//     height: values.height || 0,
//     length_units: values.length_units || "mm",
//     maunufacture_year: values.maunufacture_year || 0,
//     first_registration_year: values.first_registration_year || 0,
//     transmission: values.transmission || "unknown",
//     body_type: values.body_type || "unknown",
//     colour: values.colour || "unknown",
//     auction: values.auction || "unknown",
//     currency: values.currency || "USD",
//     bid_price: values.bid_price || 0,
//     purchase_date: values.purchase_date || "",
//     from_company_id: values.from_company_id || 0,
//     to_company_id: values.to_company_id || 0,
//     destination: values.destination || "unknown",
//     broker_name: values.broker_name || "",
//     broker_number: values.broker_number || "",
//     vat_tax: values.vat_tax || 0,
//     number_plate: values.number_plate || "",
//     customer_id: values.customer_id || 0,
//     created_by: values.created_by || "system",
//     updated_by: values.updated_by || "system",
//     complianceChecks: [],
//     exportStatus: "pending",
//     mileage: 0,
//     condition: "good",
//     price: 0,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   };

//   onSubmit(newCar);
//   form.reset();
// }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="make"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Make</FormLabel>
//               <FormControl>
//                 <Input placeholder="Toyota" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="model"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Model</FormLabel>
//               <FormControl>
//                 <Input placeholder="Camry" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="year"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Year</FormLabel>
//               <FormControl>
//                 <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="emissionsRating"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Emissions Rating</FormLabel>
//               <FormControl>
//                 <Input placeholder="Euro 6" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="chassisNumber"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Chassis Number</FormLabel>
//               <FormControl>
//                 <Input placeholder="1HGCM82633A123456" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Add Car</Button>
//       </form>
//     </Form>
//   )
// }

