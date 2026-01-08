import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import {
  AuthenticatedSidebar,
  MobileAuthenticatedSidebar,
} from "@/components/layout/authenticated-sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex  overflow-hidden bg-muted/30">
      <>
        {/* Desktop Sidebar */}
        <AuthenticatedSidebar />

        {/* Mobile Sidebar*/}
        <MobileAuthenticatedSidebar />
      </>

      {/* Main Content  */}
      <div className="relative transition-all h-screen overflow-scroll flex-1 duration-300 bg-primary/3">
        <AuthenticatedHeader />

        <main className="relative z-10 pt-16 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
