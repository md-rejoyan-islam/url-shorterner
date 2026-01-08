"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  url: string;
  qrCodeUrl?: string;
  size?: number;
  showDownload?: boolean;
  fileName?: string;
}

export function QRCodeDisplay({
  url,
  qrCodeUrl,
  size = 200,
  showDownload = true,
  fileName = "qr-code",
}: QRCodeDisplayProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      // Fallback: open in new tab
      window.open(qrCodeUrl, "_blank");
    }
  };

  if (!qrCodeUrl) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-lg"
        style={{ width: size, height: size }}
      >
        <p className="text-sm text-muted-foreground text-center px-4">
          QR code not available
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative bg-white rounded-lg overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src={qrCodeUrl}
          alt={`QR Code for ${url}`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      {showDownload && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download QR Code
        </Button>
      )}
      <a ref={linkRef} className="hidden" />
    </div>
  );
}
