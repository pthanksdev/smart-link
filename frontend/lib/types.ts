export interface ShortenResponse {
  alias: string;
  shortUrl: string;
  originalUrl: string;
}

export interface LinkSummary {
  alias: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
}

export interface LinksListResponse {
  page: number;
  limit: number;
  total: number;
  links: LinkSummary[];
}

export interface ReferrerStat {
  referrer: string;
  count: number;
}

export interface UserAgentStat {
  userAgent: string;
  count: number;
}

export interface RecentClick {
  timestamp: string;
  userAgent: string;
  referrer: string;
  ip: string;
}

export interface StatsResponse {
  alias: string;
  originalUrl: string;
  createdAt: string;
  totalClicks: number;
  clicksByDay: Record<string, number>;
  topReferrers: ReferrerStat[];
  topUserAgents: UserAgentStat[];
  recentClicks: RecentClick[];
}

export interface ApiError {
  error: string;
}
