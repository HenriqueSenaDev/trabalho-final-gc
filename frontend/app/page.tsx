import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProductCatalog } from "@/components/product-catalog"
import { CartDrawer } from "@/components/cart-drawer"
import { api, type Product, type Category, type PaginationInfo } from "@/lib/api"

export default async function CatalogPage() {
  let products: Product[] = []
  let categories: Category[] = []
  let pagination: PaginationInfo = {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  }

  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      api.products.getAll(),
      api.categories.getAll(),
    ])
    products = productsResponse.data
    pagination = productsResponse.pagination
    categories = categoriesResponse
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Tech Minimalist */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">
            STORE
          </h1>
          <div className="flex items-center gap-2">
            <CartDrawer />
            <Link href="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-xs uppercase tracking-wider font-medium"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Minimal */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
            Catálogo de Produtos
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight mb-6">
            Produtos selecionados com qualidade.
          </h2>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
            Uma coleção curada para atender às suas necessidades com simplicidade e elegância.
          </p>
        </div>
      </section>

      <Separator className="bg-gray-100" />

      {/* Products Catalog with Filters */}
      <ProductCatalog
        initialProducts={products}
        initialPagination={pagination}
        categories={categories}
      />

      {/* Footer - Minimal */}
      <footer className="border-t border-gray-100 py-10 mt-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            © 2026 Store
          </p>
          <p className="text-xs text-gray-400">
            Qualidade e simplicidade
          </p>
        </div>
      </footer>
    </div>
  )
}
