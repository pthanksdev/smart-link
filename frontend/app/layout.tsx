import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Smart Link — URL Shortener & Analytics",
  description: "Shorten URLs and track click analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold text-brand-600">
              Smart Link
            </Link>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/" className="text-gray-600 hover:text-brand-600">
                Home
              </Link>
              <Link href="/links" className="text-gray-600 hover:text-brand-600">
                All Links
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
          Smart Link Shortener &amp; Analytics
        </footer>
      </body>
    </html>
  );
}
