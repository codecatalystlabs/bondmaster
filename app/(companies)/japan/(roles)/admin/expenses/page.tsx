import { ExpensesModule } from "@/components/expenses/expenses-module";

export default function ExpensesPage() {
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Expense Management</h1>
			<ExpensesModule />
		</div>
	);
}
