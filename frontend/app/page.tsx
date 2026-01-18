import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api, type Product } from "@/lib/api"

export default async function CatalogPage() {
  let products: Product[] = [];

  try {
    const response = await api.products.getAll()
    products = response.data
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Tech Minimalist */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">
            STORE
          </h1>
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

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-sm uppercase tracking-widest text-gray-400">
            Todos os Produtos
          </h3>
          <span className="text-sm text-gray-400">
            {products.length} {products.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-base">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group border-0 shadow-none bg-transparent rounded-none py-0 gap-0"
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden mb-4">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
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
