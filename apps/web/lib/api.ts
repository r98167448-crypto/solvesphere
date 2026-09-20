const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:8000';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('solvesphere_token');
  }
  return null;
}

export function setAuthSession(token: string, user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('solvesphere_token', token);
    localStorage.setItem('solvesphere_user', JSON.stringify(user));
  }
}

export function getCurrentUser(): any | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('solvesphere_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('solvesphere_token');
    localStorage.removeItem('solvesphere_user');
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${CORE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData = 'Network error';
    try {
      const errJson = await response.json();
      errorData = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorData = await response.text();
    }
    throw new Error(errorData || `Error: ${response.statusText}`);
  }

  return response.json();
}
