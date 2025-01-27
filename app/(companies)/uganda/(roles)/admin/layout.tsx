export default function UgandaAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <nav className="ml-9 mt-3">Uganda </nav>
      {children}
    </div>
  )
}




