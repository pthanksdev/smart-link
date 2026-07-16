"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteLink } from "@/lib/api";
import type { LinkSummary } from "@/lib/types";
import CopyButton from "./CopyButton";

interface LinkTableProps {
  links: LinkSummary[];
  page: number;
  total: number;
  limit: number;
  baseUrl: string;
}

export default function LinkTable({
  links,
  page,
  total,
  limit,
  baseUrl,
}: LinkTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const totalPages = Math.ceil(total / limit);

  async function handleDelete(alias: string) {
    if (!confirm(`Delete link "${alias}"? This cannot be undone.`)) return;
    setDeleting(alias);
    try {
      await deleteLink(alias);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete link");
    } finally {
      setDeleting(null);
    }
  }

  if (links.length === 0) {
    return (
      <div className="card py-12 text-center text-gray-500">
        No links yet. Shorten your first URL on the home page.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="table-wrap">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Alias
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Original URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Clicks
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {links.map((link) => {
              const shortUrl = `${baseUrl}/${link.alias}`;
              return (
                <tr key={link.alias} className="transition hover:bg-white/[0.04]">
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href={`/stats/${link.alias}`}
                      className="font-medium text-indigo-300 hover:text-indigo-200"
                    >
                      {link.alias}
                    </Link>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-400">
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-indigo-300"
                      title={link.originalUrl}
                    >
                      {link.originalUrl}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-200">
                    {link.clickCount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CopyButton text={shortUrl} className="!px-2 !py-1 text-xs" />
                      <Link
                        href={`/stats/${link.alias}`}
                        className="btn-secondary !px-2 !py-1 text-xs"
                      >
                        Stats
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(link.alias)}
                        disabled={deleting === link.alias}
                        className="btn-danger !px-2 !py-1 text-xs"
                      >
                        {deleting === link.alias ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/links?page=${page - 1}`} className="btn-secondary">
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/links?page=${page + 1}`} className="btn-secondary">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
