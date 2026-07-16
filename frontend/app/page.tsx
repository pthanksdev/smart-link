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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Shorten URLs. Track Clicks.
        </h1>
        <p className="mt-2 text-gray-500">
          Create smart links and monitor analytics in real time.
        </p>
      </section>

      <section className="card mx-auto max-w-xl">
        <h2 className="mb-4 text-lg font-semibold">Create a short link</h2>
        <ShortenForm />
      </section>

      {recentLinks.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent links</h2>
            <Link href="/links" className="text-sm text-brand-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentLinks.map((link) => (
              <div
                key={link.alias}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/stats/${link.alias}`}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    {baseUrl}/{link.alias}
                  </Link>
                  <p className="truncate text-sm text-gray-500">
                    {link.originalUrl}
                  </p>
                </div>
                <span className="ml-4 shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
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
