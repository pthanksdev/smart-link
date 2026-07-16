"use client";

import { FormEvent, useState } from "react";
import { shortenUrl } from "@/lib/api";
import type { ShortenResponse } from "@/lib/types";
import CopyButton from "./CopyButton";
import QRCodeModal from "./QRCodeModal";

interface ShortenFormProps {
  onSuccess?: (result: ShortenResponse) => void;
}

export default function ShortenForm({ onSuccess }: ShortenFormProps) {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [showQR, setShowQR] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await shortenUrl(url, customAlias || undefined);
      setResult(response);
      onSuccess?.(response);
      setUrl("");
      setCustomAlias("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="mb-1 block text-sm font-medium text-gray-700">
            Long URL
          </label>
          <input
            id="url"
            type="url"
            required
            placeholder="https://example.com/very/long/path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="alias" className="mb-1 block text-sm font-medium text-gray-700">
            Custom alias (optional)
          </label>
          <input
            id="alias"
            type="text"
            placeholder="my-link"
            pattern="[a-zA-Z0-9_-]{4,20}"
            title="4-20 characters: letters, numbers, underscore, or hyphen"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="input-field"
          />
          <p className="mt-1 text-xs text-gray-500">
            4–20 characters: letters, numbers, underscore, or hyphen
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Shortening…" : "Shorten URL"}
        </button>
      </form>

      {result && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-sm font-medium text-green-800">
            Your short link is ready!
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-mono text-sm text-brand-600 hover:underline"
            >
              {result.shortUrl}
            </a>
            <CopyButton text={result.shortUrl} />
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="btn-secondary"
            >
              QR Code
            </button>
          </div>
        </div>
      )}

      {result && showQR && (
        <QRCodeModal
          url={result.shortUrl}
          alias={result.alias}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
