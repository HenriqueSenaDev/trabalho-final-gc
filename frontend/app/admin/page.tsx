"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isAuthenticated, logout } from "@/lib/auth"
import { api, type Product, type Category } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsTable } from "@/components/admin/products-table"
import { CreateProductDialog } from "@/components/admin/create-product-dialog"
import { EditProductDialog } from "@/components/admin/edit-product-dialog"
import { DeleteProductDialog } from "@/components/admin/delete-product-dialog"
import { Plus, Home, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 5

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
    } else {
      setIsAuthChecking(false)
      loadData()
    }
  }, [router])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
      ])
      setProducts(productsData.data)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar dados. Verifique se o servidor está rodando.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (formData: { name: string; price: string; imageUrl: string; categoryId: string }) => {
    try {
      await api.products.create({
        name: formData.name,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        categoryId: formData.categoryId,
      })

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!",
      })

      setCreateDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Erro",
        description: "Falha ao criar produto.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setEditDialogOpen(true)
  }

  const handleUpdate = async (formData: { name: string; price: string; imageUrl: string; categoryId: string }) => {
    if (!selectedProduct) return

    try {
      await api.products.update(selectedProduct.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        categoryId: formData.categoryId,
      })

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      })

      setEditDialogOpen(false)
      setSelectedProduct(null)
      loadData()
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar produto.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirm = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedProduct) return

    try {
      await api.products.delete(selectedProduct.id)

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      })

      setDeleteDialogOpen(false)
      setSelectedProduct(null)

      // Ajustar página se necessário
      const itemsPerPage = ITEMS_PER_PAGE
      const startIndex = (currentPage - 1) * itemsPerPage
      const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage)

      if (paginatedProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }

      loadData()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Erro",
        description: "Falha ao excluir produto.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (isAuthChecking || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          {isAuthChecking ? "Verificando autenticação..." : "Carregando produtos..."}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif italic text-foreground">CéudePelúcia Admin</h1>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Voltar à Loja
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-2xl">Gerenciamento de Produtos</CardTitle>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </CardHeader>
          <CardContent>
            <ProductsTable
              products={products}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>

      <CreateProductDialog
        open={createDialogOpen}
        categories={categories}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreate}
      />

      <EditProductDialog
        open={editDialogOpen}
        product={selectedProduct}
        categories={categories}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdate}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        product={selectedProduct}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  )
}
