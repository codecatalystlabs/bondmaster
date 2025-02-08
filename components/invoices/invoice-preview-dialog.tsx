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
}: InvoicePreviewDialogProps) {
	const previewRef = useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		if (previewRef.current) {
			window.print();
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Invoice Preview</DialogTitle>
				</DialogHeader>
				{invoice && (
					<InvoicePreview
						ref={previewRef}
						invoice={invoice}
					/>
				)}

				<Button onClick={handlePrint}>Print</Button>
				{/* <ReactToPrint
					trigger={() => <Button>Print</Button>}
					content={() => previewRef.current}
				/> */}
			</DialogContent>
		</Dialog>
	);
}
