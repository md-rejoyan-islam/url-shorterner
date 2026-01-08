import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f1f1_1px,transparent_1px),linear-gradient(to_bottom,#f1f1f1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem]" />

      {/* Primary Color Accent Orbs */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#e6560f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#e6560f]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#e6560f]/3 rounded-full blur-3xl" />

      <div className="relative w-full max-w-lg px-4 py-12 sm:px-6">
        <div className="mb-10 flex justify-center">
          <Logo size="lg" />
        </div>
        {children}
      </div>
    </div>
  );
}
