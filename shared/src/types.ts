export interface Site {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  createdAt: string;
}

export interface Pageview {
  id: string;
  siteId: string;
  url: string;
  referrer: string | null;
  sessionId: string;
  ipHash: string;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  screenSize: string | null;
  language: string | null;
  createdAt: string;
}

export interface TrackPayload {
  siteId: string;
  url: string;
  referrer?: string;
  sessionId: string;
  screenSize?: string;
  language?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface OverviewStats {
  totalVisits: number;
  uniqueVisitors: number;
  avgDuration: number;
  bounceRate: number;
  timeSeries: TimeSeriesPoint[];
  devices: DeviceStats[];
  browsers: BrowserStats[];
  os: OsStats[];
  languages: { language: string; visits: number }[];
  screenSizes: { screenSize: string; visits: number }[];
}

export interface TimeSeriesPoint {
  date: string;
  visits: number;
  uniques: number;
}

export interface TopPage {
  url: string;
  visits: number;
  uniques: number;
}

export interface ReferrerStats {
  referrer: string;
  visits: number;
}

export interface GeoStats {
  country: string;
  city: string | null;
  visits: number;
}

export interface DeviceStats {
  device: string;
  visits: number;
}

export interface BrowserStats {
  browser: string;
  visits: number;
}

export interface OsStats {
  os: string;
  visits: number;
}

export interface SiteDetailStats {
  topPages: TopPage[];
  referrers: ReferrerStats[];
  geo: GeoStats[];
  devices: DeviceStats[];
  browsers: BrowserStats[];
  os: OsStats[];
  timeSeries: TimeSeriesPoint[];
}
