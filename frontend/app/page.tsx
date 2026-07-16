import Link from "next/link";
import ShortenForm from "@/components/ShortenForm";
import { listLinks } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let recentLinks: Awaited<ReturnType<typeof listLinks>>["links"] = [];

  try {
    const data = await listLinks(1, 5);
    recentLinks = data.links;
  } catch {
    recentLinks = [];
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
          Shorten URLs. Track Clicks.
        </h1>
        <p className="mt-3 text-gray-400">
          Create smart links and monitor analytics in real time.
        </p>
      </section>

      <section className="card mx-auto max-w-xl">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Create a short link
        </h2>
        <ShortenForm />
      </section>

      {recentLinks.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent links</h2>
            <Link
              href="/links"
              className="text-sm text-indigo-300 transition hover:text-indigo-200"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentLinks.map((link) => (
              <div key={link.alias} className="glass-row">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/stats/${link.alias}`}
                    className="font-medium text-indigo-300 transition hover:text-indigo-200"
                  >
                    {baseUrl}/{link.alias}
                  </Link>
                  <p className="truncate text-sm text-gray-500">
                    {link.originalUrl}
                  </p>
                </div>
                <span className="badge ml-4">
                  {link.clickCount} clicks
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
