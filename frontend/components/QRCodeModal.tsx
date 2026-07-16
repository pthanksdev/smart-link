"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeModalProps {
  url: string;
  alias: string;
  onClose: () => void;
}

export default function QRCodeModal({ url, alias, onClose }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 256, margin: 2 }).catch(
        () => setError("Failed to generate QR code"),
      );
    }
  }, [url]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${alias}-qr.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="QR code"
    >
      <div
        className="card max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold">QR Code</h3>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <canvas ref={canvasRef} className="mx-auto" />
        )}
        <p className="mt-3 break-all text-xs text-gray-500">{url}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button type="button" onClick={handleDownload} className="btn-primary">
            Download
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
