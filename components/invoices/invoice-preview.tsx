import { forwardRef } from "react";

interface InvoicePreviewProps {
	invoice: {
		invoice_no: string;
		ship_date: string;
		currency: string;
		total_cost: number;
		vessel_name: string;
		from_location: string;
		to_location: string;
		created_by: string;
		updated_by: string;
	};
}

export const InvoicePreview = forwardRef<HTMLDivElement, any>(
	({ invoice }, ref) => {

		console.log(invoice,"ooooo")
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
							{invoice?.invoice?.ship_date}
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
						{invoice?.invoice?.ship_date}
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
							<th className="border border-gray-300 p-2 text-sm">
								BUY
							</th>
							<th className="border border-gray-300 p-2 text-sm">
								TAX
							</th>
							{/* <th className="border border-gray-300 p-2 text-sm">
								REC
							</th> */}
							<th className="border border-gray-300 p-2 text-sm">
								AUCTION
							</th>
							{/* <th className="border border-gray-300 p-2 text-sm">
								COMMISSION
							</th>
							<th className="border border-gray-300 p-2 text-sm">
								RIKSO
							</th>
							<th className="border border-gray-300 p-2 text-sm">
								FREIGHT
							</th> */}
							<th className="border border-gray-300 p-2 text-sm">
								TOTAL
							</th>
						</tr>
					</thead>
					<tbody>
						{invoice.cars.length > 0 ? (
							invoice.cars.map((car: any, index: any) => (
								<tr key={car.ID}>
									<td className="border border-gray-300 p-2 text-sm">
										{index + 1}
									</td>
									<td className="border border-gray-300 p-2 text-sm">
										{car.purchase_date}
									</td>
									<td className="border border-gray-300 p-2 text-sm">
										{car.model || "n/a"}
									</td>
									<td className="border border-gray-300 p-2 text-sm">
										{car.chasis_number || "n/a"}
									</td>
									<td className="border border-gray-300 p-2 text-sm text-right">
										{car.bid_price || "n/a"}
									</td>
									<td className="border border-gray-300 p-2 text-sm text-right">
										{(car.vat_tax / 100 )* car.bid_price ||
											"n/a"}
									</td>
									{/* <td className="border border-gray-300 p-2 text-sm text-right">
										{car.millage || "n/a"}
									</td> */}
									<td className="border border-gray-300 p-2 text-sm text-right">
										{car.auction || "n/a"}
									</td>
									{/* <td className="border border-gray-300 p-2 text-sm text-right">
										{car.commission || "n/a"}
									</td>
									<td className="border border-gray-300 p-2 text-sm text-right">
										{car.rikso || "n/a"}
									</td>
									<td className="border border-gray-300 p-2 text-sm text-right">
										{car.freight || "n/a"}
									</td> */}
									<td className="border border-gray-300 p-2 text-sm text-right">
										{car.bid_price + car.vat_tax}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={12}
									className="text-center p-2"
								>
									No cars available for this invoice.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
);

InvoicePreview.displayName = "InvoicePreview";
