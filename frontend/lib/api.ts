const isServer = typeof window === 'undefined';

const API_BASE_URL = isServer 
  ? 'http://server:5000/api' 
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper para fazer requisições
async function fetchAPI(endpoint: string, options?: RequestInit) {
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

// Types para a API
export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  categoryId: string
  category?: Category
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateProductInput {
  name: string
  price: number
  imageUrl: string
  categoryId: string
}

export interface UpdateProductInput {
  name?: string
  price?: number
  imageUrl?: string
  categoryId?: string
}

// Products API
export const api = {
  products: {
    // GET /api/products
    getAll: async (): Promise<Product[]> => {
      return fetchAPI('/products')
    },

    // GET /api/products/:id
    getById: async (id: string): Promise<Product> => {
      return fetchAPI(`/products/${id}`)
    },

    // POST /api/products
    create: async (data: CreateProductInput): Promise<Product> => {
      return fetchAPI('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    // PUT /api/products/:id
    update: async (id: string, data: UpdateProductInput): Promise<Product> => {
      return fetchAPI(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    // DELETE /api/products/:id
    delete: async (id: string): Promise<void> => {
      return fetchAPI(`/products/${id}`, {
        method: 'DELETE',
      })
    },
  },

  categories: {
    // GET /api/categories
    getAll: async (): Promise<Category[]> => {
      return fetchAPI('/categories')
    },

    // GET /api/categories/:id
    getById: async (id: string): Promise<Category> => {
      return fetchAPI(`/categories/${id}`)
    },

    // POST /api/categories
    create: async (name: string): Promise<Category> => {
      return fetchAPI('/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
      })
    },
  },
}
