import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import { addDeposit, addPayment } from "@/apis";

export default function PaymentDialog({ open, onOpenChange, onRefresh }: any) {
  const [paymentType, setPaymentType] = useState("payment");
  const [payment, setPayment] = useState({
    mode_of_payment: "",
    transaction_id: "",
    sale_payment_id: 0,
    created_by: "admin",
    updated_by: "admin",
  });

  const [deposit, setDeposit] = useState({
    bank_name: "",
    bank_account: "",
    bank_branch: "",
    amount_deposited: "",
    date_deposited: "",
    deposit_scan: "",
    sale_payment_id: 0,
    created_by: "admin",
    updated_by: "admin",
  });

  const handleSave = async () => {
    try {
      if (paymentType === "payment") {
        await addPayment({ url: "payment", payment: { ...payment, sale_payment_id: Number(payment.sale_payment_id) } });
      } else {
        await addDeposit({ url: "deposit", deposit: { ...deposit, sale_payment_id: Number(deposit.sale_payment_id) } });
      }
      toast.success("Payment saved successfully!");
      onOpenChange(false);
      onRefresh();
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Failed to save payment.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{paymentType === "payment" ? "New Payment" : "New Deposit"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
            </SelectContent>
          </Select>

          {paymentType === "payment" ? (
            <>
              <Input placeholder="Mode of Payment" value={payment.mode_of_payment} onChange={(e) => setPayment({ ...payment, mode_of_payment: e.target.value })} />
              <Input placeholder="Transaction ID" value={payment.transaction_id} onChange={(e) => setPayment({ ...payment, transaction_id: e.target.value })} />
              <Input placeholder="Sale Payment ID" type="number" value={payment.sale_payment_id} onChange={(e) => setPayment({ ...payment, sale_payment_id: Number(e.target.value) })} />
            </>
          ) : (
            <>
              <Input placeholder="Bank Name" value={deposit.bank_name} onChange={(e) => setDeposit({ ...deposit, bank_name: e.target.value })} />
              <Input placeholder="Bank Account" value={deposit.bank_account} onChange={(e) => setDeposit({ ...deposit, bank_account: e.target.value })} />
              <Input placeholder="Bank Branch" value={deposit.bank_branch} onChange={(e) => setDeposit({ ...deposit, bank_branch: e.target.value })} />
              <Input placeholder="Amount Deposited" type="number" value={deposit.amount_deposited} onChange={(e) => setDeposit({ ...deposit, amount_deposited: e.target.value })} />
              <Input placeholder="Date Deposited" type="date" value={deposit.date_deposited} onChange={(e) => setDeposit({ ...deposit, date_deposited: e.target.value })} />
              <Input placeholder="Sale Payment ID" type="number" value={deposit.sale_payment_id} onChange={(e) => setDeposit({ ...deposit, sale_payment_id: Number(e.target.value) })} />
            </>
          )}

          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
