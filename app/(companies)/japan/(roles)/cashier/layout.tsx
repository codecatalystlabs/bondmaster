export default function JapanCashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
		<div className="overflow-y-auto p-8">
			<nav>Japan Cashier Navigation</nav>
			{children}
		</div>
  );
}

