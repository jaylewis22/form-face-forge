import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background w-full">
      <Sidebar />
      <Header />
      <main className="ml-20 mt-16 p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-[1920px] w-full">
          {children}
        </div>
      </main>
    </div>
  );
}