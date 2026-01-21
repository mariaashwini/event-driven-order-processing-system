const API_BASE = import.meta.env.VITE_API_BASE;


type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
};

export async function api<T = any>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return response.json() as Promise<T>;
}
