export default function JapanAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <nav>Japan Admin Navigation</nav>
      {children}
    </div>
  )
}

