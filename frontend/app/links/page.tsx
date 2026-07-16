import LinkTable from "@/components/LinkTable";
import { listLinks } from "@/lib/api";

export const dynamic = "force-dynamic";

interface LinksPageProps {
  searchParams: { page?: string };
}

export default async function LinksPage({ searchParams }: LinksPageProps) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const limit = 20;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  let data;
  try {
    data = await listLinks(page, limit);
  } catch {
    return (
      <div className="card text-center text-red-600">
        <p>Failed to load links. Is the backend running?</p>
        <p className="mt-2 text-sm text-gray-500">
          Expected API at {baseUrl}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Links</h1>
        <p className="mt-1 text-gray-500">
          {data.total} shortened link{data.total !== 1 ? "s" : ""} total
        </p>
      </div>
      <LinkTable
        links={data.links}
        page={data.page}
        total={data.total}
        limit={data.limit}
        baseUrl={baseUrl}
      />
    </div>
  );
}
