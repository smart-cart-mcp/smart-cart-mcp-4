export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
