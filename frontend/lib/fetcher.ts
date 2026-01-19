"use server";

const isServer = typeof window === 'undefined';

const API_BASE_URL = isServer
  ? 'http://server:5000/api'
  : process.env.API_URL || 'http://localhost:5000/api';

// Helper para fazer requisições
export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  // 204 No Content não tem body
  if (response.status === 204) {
    return null
  }

  return response.json()
}
