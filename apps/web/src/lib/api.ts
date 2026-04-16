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
