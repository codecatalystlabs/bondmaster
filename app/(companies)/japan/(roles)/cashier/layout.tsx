export default function JapanCashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="cashier-layout">
      <nav>Japan Cashier Navigation</nav>
      {children}
    </div>
  )
}

