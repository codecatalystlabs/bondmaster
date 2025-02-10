"use client";

import { useRef } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvoicePreview } from "./invoice-preview";
import ReactToPrint from "react-to-print";

interface InvoicePreviewDialogProps {
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
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function InvoicePreviewDialog({
	invoice,
	open,
	onOpenChange,
}: any) {
	const previewRef = useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		console.log("log")
		// if (previewRef.current) {
		// 	ReactToPrint({
		// 		content: () => previewRef.current,
		// 	});
		// }
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Invoice Preview</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<InvoicePreview
						ref={previewRef}
						invoice={invoice}
					/>
				</div>
				<div className="sticky bottom-0 bg-background p-4 border-t">
					<Button onClick={handlePrint}>Print</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
