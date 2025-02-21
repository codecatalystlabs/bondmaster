export default function UgandaAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
		<div className="overflow-y-auto p-8">
			
			{children}
		</div>
  );
}




