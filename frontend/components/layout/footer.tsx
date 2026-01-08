import { Info, Mail, Sparkles, Tag } from "lucide-react";

const footerLinks = [
  { label: "Features", href: "/features", icon: Sparkles },
  { label: "Pricing", href: "/pricing", icon: Tag },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      {/* Copyright Bar - Full Width */}
      <div className="bg-primary py-3">
        <p className="text-xs text-white text-center">
          &copy; {new Date().getFullYear()} LinkShort. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
