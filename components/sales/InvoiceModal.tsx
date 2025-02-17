import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { addInvoice } from "@/apis";
import toast from "react-hot-toast";

export default function InvoiceDialog({ open, onOpenChange, selectedSale }:any) {
    console.log(selectedSale?.ID,"AM THE SALE")
  const [invoice, setInvoice] = useState({
    amount_payed: selectedSale?.total_price || 0,
    payment_date: selectedSale?.sale_date || "",
    sale_id: selectedSale?.ID ,
    created_by: "admin",
    updated_by: "admin",
  });

  const handleSave = async () => {
    try {
        const response = await addInvoice({
            url: "invoice",
            invoice: invoice,
          });

          if (response.data) {
            onOpenChange(false); // Close the modal
            toast.success("Attached Invoice successfully");
          }
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedSale ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label>Total Price</label>
            <Input
              type="number"
              value={invoice.amount_payed}
              onChange={(e) => setInvoice({ ...invoice, amount_payed: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <label>Payment Date</label>
            <Input
              type="date"
              value={invoice.payment_date}
              onChange={(e) => setInvoice({ ...invoice, payment_date: e.target.value })}
            />
          </div>

          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
