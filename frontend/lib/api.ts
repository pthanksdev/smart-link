import type {
  ApiError,
  LinksListResponse,
  ShortenResponse,
  StatsResponse,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const err = data as ApiError;
    throw new ApiClientError(err.error || "Request failed", response.status);
  }

  return data as T;
}

export async function shortenUrl(
  url: string,
  customAlias?: string,
): Promise<ShortenResponse> {
  return request<ShortenResponse>("/api/shorten", {
    method: "POST",
    body: JSON.stringify({ url, customAlias: customAlias || undefined }),
  });
}

export async function getStats(alias: string): Promise<StatsResponse> {
  return request<StatsResponse>(`/api/stats/${encodeURIComponent(alias)}`);
}

export async function listLinks(
  page = 1,
  limit = 20,
): Promise<LinksListResponse> {
  return request<LinksListResponse>(
    `/api/links?page=${page}&limit=${limit}`,
  );
}

export async function deleteLink(alias: string): Promise<void> {
  await request<void>(`/api/links/${encodeURIComponent(alias)}`, {
    method: "DELETE",
  });
}

export { ApiClientError };
