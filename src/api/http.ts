import { useAuth } from "../store/auth";

interface Options {
  method?: string;
  body?: unknown;
}

export async function http<T>(url: string, { method = "GET", body }: Options = {}): Promise<T> {
  const token = useAuth.getState().token;
  const res = await fetch(url, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && token) useAuth.getState().clear(); // session expired
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
