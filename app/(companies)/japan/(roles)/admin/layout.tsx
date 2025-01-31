export default function JapanAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-y-auto p-8">
      <nav>Japan </nav>
      {children}
    </div>
  )
}

