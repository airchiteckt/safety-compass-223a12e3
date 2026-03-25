import { CFTSidebar } from "./CFTSidebar";

interface CFTLayoutProps {
  children: React.ReactNode;
}

export function CFTLayout({ children }: CFTLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <CFTSidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
