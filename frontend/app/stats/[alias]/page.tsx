import Link from "next/link";
import { notFound } from "next/navigation";
import ClicksByDayChart from "@/components/ClicksByDayChart";
import CopyButton from "@/components/CopyButton";
import ReferrerBreakdown from "@/components/ReferrerBreakdown";
import { ApiClientError, getStats } from "@/lib/api";

export const dynamic = "force-dynamic";

interface StatsPageProps {
  params: { alias: string };
}

export default async function StatsPage({ params }: StatsPageProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  let stats;
  try {
    stats = await getStats(params.alias);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      notFound();
    }
    return (
      <div className="card text-center text-red-300">
        <p>Failed to load stats. Is the backend running?</p>
      </div>
    );
  }

  const shortUrl = `${baseUrl}/${stats.alias}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/links"
            className="text-sm text-indigo-300 transition hover:text-indigo-200"
          >
            ← Back to links
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white">{stats.alias}</h1>
          <p className="mt-1 truncate text-sm text-gray-500">
            {stats.originalUrl}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-indigo-300">{shortUrl}</span>
          <CopyButton text={shortUrl} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <p className="text-3xl font-bold text-gradient">
            {stats.totalClicks}
          </p>
          <p className="text-sm text-gray-500">Total clicks</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">
            {stats.topReferrers.length}
          </p>
          <p className="text-sm text-gray-500">Referrer sources</p>
        </div>
        <div className="card text-center">
          <p className="text-sm font-medium text-gray-200">
            {new Date(stats.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-500">Created</p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Clicks by day
        </h2>
        <ClicksByDayChart data={stats.clicksByDay} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Top referrers
          </h2>
          <ReferrerBreakdown referrers={stats.topReferrers} />
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Top user agents
          </h2>
          {stats.topUserAgents.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              No user agent data yet
            </p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {stats.topUserAgents.map(({ userAgent, count }) => (
                <div
                  key={userAgent}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <span
                    className="truncate text-gray-400"
                    title={userAgent}
                  >
                    {userAgent}
                  </span>
                  <span className="shrink-0 font-medium text-gray-200">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent clicks</h2>
        {stats.recentClicks.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            No clicks recorded yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Referrer</th>
                  <th className="px-3 py-2">IP</th>
                  <th className="px-3 py-2">User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentClicks.map((click, i) => (
                  <tr key={i} className="text-gray-400">
                    <td className="whitespace-nowrap px-3 py-2">
                      {new Date(click.timestamp).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{click.referrer}</td>
                    <td className="whitespace-nowrap px-3 py-2">
                      {click.ip || "—"}
                    </td>
                    <td
                      className="max-w-xs truncate px-3 py-2"
                      title={click.userAgent}
                    >
                      {click.userAgent || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
