import type { Metadata } from "next";
import Link from "next/link";
import BackgroundWrapper from "@/components/BackgroundWrapper";
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
        <BackgroundWrapper />
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="glass-header sticky top-0 z-20">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-xl font-bold text-gradient">
                Smart Link
              </Link>
              <nav className="flex gap-4 text-sm font-medium">
                <Link
                  href="/"
                  className="text-gray-300 transition hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href="/links"
                  className="text-gray-300 transition hover:text-white"
                >
                  All Links
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </main>
          <footer className="glass-footer py-6 text-center text-sm text-gray-500">
            Smart Link Shortener &amp; Analytics
          </footer>
        </div>
      </body>
    </html>
  );
}
