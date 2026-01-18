'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CatalogFilters } from '@/components/catalog-filters'
import {
  api,
  type Product,
  type Category,
  type ProductFilters,
  type PaginationInfo,
} from '@/lib/api'

interface ProductCatalogProps {
  initialProducts: Product[]
  initialPagination: PaginationInfo
  categories: Category[]
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full bg-gray-100" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-16 bg-gray-100" />
        <Skeleton className="h-5 w-3/4 bg-gray-100" />
        <Skeleton className="h-4 w-20 bg-gray-100" />
      </div>
    </div>
  )
}

export function ProductCatalog({
  initialProducts,
  initialPagination,
  categories,
}: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination)
  const [filters, setFilters] = useState<ProductFilters>({})
  const [isLoading, setIsLoading] = useState(false)

  const fetchProducts = useCallback(async (currentFilters: ProductFilters) => {
    setIsLoading(true)
    try {
      const response = await api.products.getAll(currentFilters)
      setProducts(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleFiltersChange = useCallback(
    (newFilters: ProductFilters) => {
      setFilters(newFilters)
      fetchProducts(newFilters)
    },
    [fetchProducts]
  )

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Header with filters */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-widest text-gray-400">
            Todos os Produtos
          </h3>
          <span className="text-sm text-gray-400">
            {pagination.total} {pagination.total === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <CatalogFilters
          categories={categories}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="text-center py-24">
          <p className="text-gray-400 text-base mb-2">
            Nenhum produto encontrado.
          </p>
          <p className="text-gray-300 text-sm">
            Tente ajustar os filtros para encontrar o que procura.
          </p>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group border-0 shadow-none bg-transparent rounded-none py-0 gap-0"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden mb-4">
                <img
                  src={product.imageUrl || '/placeholder.svg'}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500 ease-out"
                />
              </div>
              <CardContent className="p-0 space-y-2">
                {product.category && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-500 hover:bg-gray-100 font-normal text-[10px] uppercase tracking-wider rounded-sm"
                  >
                    {product.category.name}
                  </Badge>
                )}
                <h3 className="font-medium text-gray-900 text-base tracking-tight">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
