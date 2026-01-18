import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api, type Product } from "@/lib/api"

export default async function CatalogPage() {
  // Buscar produtos do servidor
  let products: Product[] = [];

  try {
    const response = await api.products.getAll()
    products = response.data
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif italic text-foreground">CéudePelúcia</h1>
          <Link href="/admin/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl md:text-6xl font-serif mb-4 text-balance text-foreground">
          Bem-vindo a um mundo de conforto
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Descubra nossa coleção cuidadosamente selecionada de companheiros de pelúcia que trazem alegria e aconchego
          para sua vida.
        </p>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-border hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-foreground text-lg">{product.name}</h3>
                    <p className="text-lg font-semibold text-primary whitespace-nowrap">R${product.price.toFixed(2)}</p>
                  </div>
                  {product.category && <p className="text-sm text-muted-foreground">{product.category.name}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 CéudePelúcia. Trazendo conforto para cada lar.</p>
        </div>
      </footer>
    </div>
  )
}
