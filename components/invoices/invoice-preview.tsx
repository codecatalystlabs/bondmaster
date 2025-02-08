import { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
	({ invoice }, ref) => {
		return (
			<div
				ref={ref}
				className="p-8 bg-white"
			>
				<Card>
					<CardHeader>
						<CardTitle>
							Invoice {invoice?.invoice_no}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p>
									<strong>Ship Date:</strong>{" "}
									{invoice?.ship_date}
								</p>
								<p>
									<strong>Vessel Name:</strong>{" "}
									{invoice?.vessel_name}
								</p>
								<p>
									<strong>From:</strong>{" "}
									{invoice?.from_location}
								</p>
								<p>
									<strong>To:</strong>{" "}
									{invoice?.to_location}
								</p>
							</div>
							<div>
								<p>
									<strong>Currency:</strong>{" "}
									{invoice?.currency}
								</p>
								<p>
									<strong>Total Cost:</strong>{" "}
									{invoice?.total_cost
										? invoice.total_cost.toLocaleString()
										: "N/A"}
								</p>

								<p>
									<strong>Created By:</strong>{" "}
									{invoice?.created_by}
								</p>
								<p>
									<strong>Updated By:</strong>{" "}
									{invoice?.updated_by}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}
);

InvoicePreview.displayName = "InvoicePreview";
