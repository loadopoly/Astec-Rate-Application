/// <reference types="vite/client" />

/**
 * Thin fetch wrapper for the IPS Freight API.
 *
 * Base URL is read from the Vite env variable VITE_API_URL (defaults to
 * "/api" so it works when the API and frontend share the same origin in
 * Docker / Render combined mode, or when Vite's dev proxy is active).
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/v1${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Quotes
// ---------------------------------------------------------------------------

export interface ApiQuote {
  id:               string;
  requestNumber:    string;
  type:             string;
  status:           string;
  jobId:            string;
  customer:         string;
  quoteToCustomer:  number;
  carrierTotal:     number;
  markup:           number;
  quoteDate:        string;
  notes:            string | null;
  lane: {
    id:          string;
    distance:    number | null;
    origin:      { city: string; state: string };
    destination: { city: string; state: string };
  };
  selectedCarrier: { id: string; name: string; mcNumber: string | null } | null;
  site:            { id: string; name: string; code: string };
}

export const quotesApi = {
  list: ()            => request<ApiQuote[]>('/quotes'),
  get:  (id: string)  => request<ApiQuote>(`/quotes/${id}`),
};

// ---------------------------------------------------------------------------
// Carriers
// ---------------------------------------------------------------------------

export interface ApiCarrier {
  id:          string;
  name:        string;
  mcNumber:    string | null;
  dotNumber:   string | null;
  type:        string;
  isPreferred: boolean;
  isActive:    boolean;
  notes:       string | null;
  contacts:    Array<{
    id:       string;
    name:     string;
    title:    string | null;
    phone:    string;
    email:    string;
    isPrimary: boolean;
  }>;
  performance: Array<{
    id:             string;
    period:         string;
    totalBids:      number;
    wonBids:        number;
    winRate:        number;
    onTimePickup:   number | null;
    onTimeDelivery: number | null;
  }>;
}

export const carriersApi = {
  list: ()            => request<ApiCarrier[]>('/carriers'),
  get:  (mc: string)  => request<ApiCarrier>(`/carriers/${mc}`),
};

// ---------------------------------------------------------------------------
// Lanes
// ---------------------------------------------------------------------------

export interface ApiLane {
  id:          string;
  distance:    number | null;
  origin:      { city: string; state: string };
  destination: { city: string; state: string };
  metrics:     Array<{
    id:            string;
    period:        string;
    equipmentType: string | null;
    minRate:       number;
    maxRate:       number;
    avgRate:       number;
    medianRate:    number;
    shipmentCount: number;
    ratePerMile:   number | null;
  }>;
}

export const lanesApi = {
  list: ()            => request<ApiLane[]>('/lanes'),
  get:  (id: string)  => request<ApiLane>(`/lanes/${id}`),
};

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

export interface ImportResult {
  filename:       string;
  recordsTotal:   number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed:  number;
  errors:         string[];
}

export const importApi = {
  uploadExcel: async (file: File, importedBy = 'user'): Promise<ImportResult> => {
    const form = new FormData();
    form.append('file', file);
    form.append('importedBy', importedBy);

    const res = await fetch(`${BASE_URL}/v1/import/excel`, {
      method: 'POST',
      body:   form,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<ImportResult>;
  },

  getLogs: () => request<unknown[]>('/import/logs'),
};

// ---------------------------------------------------------------------------
// Stats (Dashboard & Analytics)
// ---------------------------------------------------------------------------

export interface DashboardStats {
  kpis: {
    totalQuotes:    number;
    wonQuotes:      number;
    winRate:        number;
    avgMargin:      number;
    totalValue:     number;
    activeCarriers: number;
  };
  recentQuotes: ApiQuote[];
  topLanes:     Array<{ lane: string; count: number }>;
}

export interface AnalyticsStats {
  kpis: {
    totalSpend:    number;
    totalLoads:    number;
    avgMargin:     number;
    carriersUsed:  number;
  };
  spendByCarrier: Array<{
    carrier: string;
    spend:   number;
    loads:   number;
    pct:     number;
  }>;
  monthlyTrend: Array<{
    month:  string;
    loads:  number;
    spend:  number;
    margin: string;
  }>;
}

export const statsApi = {
  dashboard: () => request<DashboardStats>('/stats/dashboard'),
  analytics: () => request<AnalyticsStats>('/stats/analytics'),
};

// ---------------------------------------------------------------------------
// Quote Detail (extended with bids)
// ---------------------------------------------------------------------------

export interface ApiQuoteDetail extends ApiQuote {
  type:             string;
  flatbedQty:       number;
  stepDeckQty:      number;
  doubleDeckQty:    number;
  towawayQty:       number;
  dollyQty:         number;
  rgnQty:           number;
  quoteResult:      string | null;
  bids: Array<{
    id:               string;
    carrier:          { id: string; name: string; mcNumber: string | null };
    totalRate:        number;
    isSelected:       boolean;
    equipmentRating:  number | null;
    responseRating:   number | null;
    serviceRating:    number | null;
  }>;
}

// ---------------------------------------------------------------------------
// Carrier Detail (extended with bids/quotes)
// ---------------------------------------------------------------------------

export interface ApiCarrierDetail extends ApiCarrier {
  bids: Array<{
    id:        string;
    totalRate: number;
    isSelected: boolean;
    quote: {
      id:            string;
      requestNumber: string;
      quoteDate:     string;
      lane: {
        origin:      { city: string; state: string };
        destination: { city: string; state: string };
      };
    };
  }>;
}

// ---------------------------------------------------------------------------
// Lane Detail (extended with quotes)
// ---------------------------------------------------------------------------

export interface ApiLaneDetail extends ApiLane {
  quotes: Array<{
    id:              string;
    requestNumber:   string;
    quoteDate:       string;
    quoteToCustomer: number;
    status:          string;
    selectedCarrier: { id: string; name: string; mcNumber: string | null } | null;
  }>;
}
