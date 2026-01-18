'use client'

import { useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { type Category, type ProductFilters } from '@/lib/api'

interface CatalogFiltersProps {
  categories: Category[]
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  isLoading?: boolean
}

export function CatalogFilters({
  categories,
  filters,
  onFiltersChange,
  isLoading,
}: CatalogFiltersProps) {
  const handleCategoryChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        categoryId: value === 'all' ? undefined : value,
        page: 1,
      })
    },
    [filters, onFiltersChange]
  )

  const handleMinPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      onFiltersChange({
        ...filters,
        minPrice: value ? Number(value) : undefined,
        page: 1,
      })
    },
    [filters, onFiltersChange]
  )

  const handleMaxPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      onFiltersChange({
        ...filters,
        maxPrice: value ? Number(value) : undefined,
        page: 1,
      })
    },
    [filters, onFiltersChange]
  )

  const handleClearFilters = useCallback(() => {
    onFiltersChange({})
  }, [onFiltersChange])

  const hasActiveFilters =
    filters.categoryId || filters.minPrice !== undefined || filters.maxPrice !== undefined

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Category Filter */}
      <div className="w-full sm:w-auto">
        <Select
          value={filters.categoryId || 'all'}
          onValueChange={handleCategoryChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 text-gray-700 text-sm">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Input
          type="number"
          placeholder="Min"
          value={filters.minPrice ?? ''}
          onChange={handleMinPriceChange}
          disabled={isLoading}
          className="w-24 bg-white border-gray-200 text-gray-700 text-sm placeholder:text-gray-400"
          min={0}
        />
        <span className="text-gray-400 text-sm">—</span>
        <Input
          type="number"
          placeholder="Max"
          value={filters.maxPrice ?? ''}
          onChange={handleMaxPriceChange}
          disabled={isLoading}
          className="w-24 bg-white border-gray-200 text-gray-700 text-sm placeholder:text-gray-400"
          min={0}
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          disabled={isLoading}
          className="text-gray-500 hover:text-gray-900 text-xs uppercase tracking-wider"
        >
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
