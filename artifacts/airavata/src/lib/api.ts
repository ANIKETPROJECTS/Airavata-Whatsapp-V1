// API client — all calls go to the API server at /api (routed by Replit's path-based proxy)
const BASE = "/api";

type FetchOptions = RequestInit & { json?: unknown };

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { json, ...rest } = options;
  const headers: Record<string, string> = {
    ...(rest.headers as Record<string, string>),
  };
  let body: BodyInit | undefined = rest.body;

  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include", // send httpOnly cookie
    ...rest,
    headers,
    body,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "GET" }),

  post: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "POST", json: body }),

  put: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "PUT", json: body }),

  delete: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
