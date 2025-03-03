import { formatAmount } from "@/lib/utils";
import { forwardRef } from "react";

interface InvoicePreviewProps {
	invoice: {
		cars: Array<{
			ID: number;
			purchase_date?: string;
			car_model: string;
			chasis_number: string;
			bid_price: number;
			vat_tax: number;
			currency: string;
			expenses?: Array<{
				amount: number;
				description: string;
			}>;
		}>;
		invoice: {
			invoice_no: string;
			ship_date: string;
			vessel_name: string;
			from_location: string;
			to_location: string;
			created_by: string;
			updated_by: string;
		};
	};
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
	({ invoice }, ref) => {
		// Calculate total for a single car including all expenses
		const calculateCarTotal = (car: any) => {
			const basePrice = car.bid_price || 0;
			const vatAmount = (car.vat_tax / 100) * basePrice;
			const expensesTotal =
				car.expenses?.reduce(
					(sum: number, expense: any) =>
						sum + (expense.amount || 0),
					0
				) || 0;

			return basePrice + vatAmount + expensesTotal;
		};

		// Calculate grand total for all cars
		const grandTotal = invoice.cars.reduce(
			(total, car) => total + calculateCarTotal(car),
			0
		);

		return (
			<div
				ref={ref}
				className="p-8 bg-white min-w-[800px]"
			>
				{/* Company Header */}
				<div className="text-center mb-8">
					<h1 className="text-xl font-bold">
						MADINA TRADING CO Ltd.
					</h1>
				</div>

				{/* Invoice Details */}
				<div className="flex justify-between mb-6">
					<div>
						<p>
							<span className="font-semibold">
								Invoice No.
							</span>{" "}
							{invoice?.invoice?.invoice_no}
						</p>
					</div>
					<div>
						<p>
							<span className="font-semibold">Date:</span>{" "}
							{new Date(
								invoice?.invoice?.ship_date
							).toLocaleDateString()}
						</p>
					</div>
				</div>

				{/* Customer Details */}
				<div className="mb-6">
					<p>
						<span className="font-semibold">To:</span> SHERAZ
						TRADING U LTD
					</p>
					<p>
						<span className="font-semibold">
							Name of Vessel:
						</span>{" "}
						{invoice?.invoice?.vessel_name}
					</p>
					<p>
						<span className="font-semibold">Sailing ON:</span>{" "}
						{new Date(
							invoice?.invoice?.ship_date
						).toLocaleDateString()}
					</p>
					<p>
						<span className="font-semibold">FROM:</span>{" "}
						{invoice?.invoice?.from_location}
					</p>
				</div>

				{/* Table */}
				<table className="w-full border-collapse border border-gray-300">
					<thead>
						<tr className="bg-gray-50">
							<th className="border border-gray-300 p-2 text-sm">
								SR NO
							</th>
							<th className="border border-gray-300 p-2 text-sm">
								DATE
							</th>
							<th className="border border-gray-300 p-2 text-sm">
								MODEL
							</th>
							<th className="border border-gray-300 p-2 text-sm">
								CHASSIS
							</th>
							<th className="border border-gray-300 p-2 text-sm text-right">
								TOTAL
							</th>
						</tr>
					</thead>
					<tbody>
						{invoice.cars.length > 0 ? (
							invoice.cars.map((car, index) => (
								<tr key={car.ID}>
									<td className="border border-gray-300 p-2 text-sm">
										{index + 1}
									</td>
									<td className="border border-gray-300 p-2 text-sm">
										{car.purchase_date
											? new Date(
													car.purchase_date
											  ).toLocaleDateString()
											: "N/A"}
									</td>
									<td className="border border-gray-300 p-2 text-sm">
										{car.car_model || "N/A"}
									</td>
									<td className="border border-gray-300 p-2 text-sm">
										{car.chasis_number || "N/A"}
									</td>
									<td className="border border-gray-300 p-2 text-sm text-right">
										{formatAmount(
											calculateCarTotal(car),
											car.currency
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={5}
									className="text-center p-2"
								>
									No cars available for this invoice.
								</td>
							</tr>
						)}
					</tbody>
					<tfoot>
						<tr className="bg-gray-50 font-bold">
							<td
								colSpan={4}
								className="border border-gray-300 p-2 text-sm text-right"
							>
								Grand Total:
							</td>
							<td className="border border-gray-300 p-2 text-sm text-right">
								{formatAmount(
									grandTotal,
									invoice.cars[0]?.currency || "JPY"
								)}
							</td>
						</tr>
					</tfoot>
				</table>

				{/* Signature Section */}
				<div className="mt-12 pt-8 border-t">
					<div className="flex justify-between">
						<div>
							<p className="font-semibold">Notes:</p>
							<p className="text-sm text-gray-600">
								All prices are in{" "}
								{invoice.cars[0]?.currency || "JPY"}
							</p>
						</div>
						<div className="text-center">
							<div className="mt-16 pt-4 border-t border-gray-400 w-48">
								<p className="font-semibold">
									Authorized Signature
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

InvoicePreview.displayName = "InvoicePreview";
