export default function UgandaAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
		<div className="overflow-y-auto p-8">
			<nav className="ml-9 mt-3">Uganda </nav>
			{children}
		</div>
  );
}




