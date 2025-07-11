import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        errorMessage = json.error || json.message || res.statusText;
      } else {
        const text = await res.text();
        errorMessage = text || res.statusText;
      }
    } catch (e) {
      // Fallback to status text if parsing fails
      errorMessage = res.statusText;
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    
    // Handle empty responses
    const contentLength = res.headers.get('content-length');
    if (contentLength === '0') {
      return null;
    }
    
    // Check content type before parsing
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await res.text();
        if (!text.trim()) {
          return null;
        }
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parsing error in queryClient:', parseError);
        console.error('Response text that failed to parse:', await res.text());
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
    }
    
    // If not JSON, return null for queries
    return null;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
