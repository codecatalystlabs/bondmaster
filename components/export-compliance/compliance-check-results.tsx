// "use client"

// import * as React from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { ComplianceCheck, ExportReadyCar } from "@/types/export-compliance"

// interface ComplianceCheckResultsProps {
//   cars: ExportReadyCar[]
//   onUpdate: (car: ExportReadyCar) => void
// }

// export function ComplianceCheckResults({ cars, onUpdate }: ComplianceCheckResultsProps) {
//   const runComplianceChecks = (car: ExportReadyCar) => {
//     const checks: ComplianceCheck[] = [
//       {
//         id: Math.random().toString(36).substr(2, 9),
//         carId: car.ID,
//         checkType: 'age',
//         status: new Date().getFullYear() - car.year <= 15 ? 'pass' : 'fail',
//         message: new Date().getFullYear() - car.year <= 15 ? 'Vehicle age is compliant' : 'Vehicle exceeds maximum age limit',
//       },
//       {
//         id: Math.random().toString(36).substr(2, 9),
//         carId: car.id,
//         checkType: 'emissions',
//         status: ['Euro 5', 'Euro 6'].includes(car.emissionsRating) ? 'pass' : 'fail',
//         message: ['Euro 5', 'Euro 6'].includes(car.emissionsRating) ? 'Emissions rating is compliant' : 'Emissions rating does not meet requirements',
//       },
//       {
//         id: Math.random().toString(36).substr(2, 9),
//         carId: car.id,
//         checkType: 'documentation',
//         status: car.documents.length > 0 ? 'pass' : 'fail',
//         message: car.documents.length > 0 ? 'Required documents are present' : 'Missing required documents',
//       },
//     ]

//     const updatedCar: ExportReadyCar = {
//       ...car,
//       complianceChecks: checks,
//       exportStatus: checks.every(check => check.status === 'pass') ? 'ready' : 'flagged',
//     }

//     onUpdate(updatedCar)
//   }

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Make</TableHead>
//           <TableHead>Model</TableHead>
//           <TableHead>Year</TableHead>
//           <TableHead>Emissions Rating</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Action</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {cars.map((car) => (
//           <TableRow key={car.id}>
//             <TableCell>{car.make}</TableCell>
//             <TableCell>{car.car_model}</TableCell>
//             <TableCell>{car.year}</TableCell>
//             <TableCell>{car.emissionsRating}</TableCell>
//             <TableCell>{car.exportStatus}</TableCell>
//             <TableCell>
//               <Button onClick={() => runComplianceChecks(car)}>Run Checks</Button>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   )
// }
