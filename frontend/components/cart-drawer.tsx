'use client'

import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/use-cart'

export function CartDrawer() {
  const { items, itemCount, total, removeItem, updateQuantity, clearCart } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="text-lg font-medium tracking-tight text-gray-900">
            Carrinho
          </SheetTitle>
          <p className="text-sm text-gray-400">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </p>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingCart className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm">Seu carrinho está vazio</p>
            <p className="text-gray-300 text-xs mt-1">
              Adicione produtos para continuar
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 px-4">
                  <div className="h-20 w-20 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl || '/placeholder.svg'}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 border-gray-200"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm text-gray-700 w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 border-gray-200"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 ml-auto text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t border-gray-100 pt-4">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-lg font-medium text-gray-900">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <Separator className="bg-gray-100" />
                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  size="lg"
                >
                  Finalizar Compra
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-900 text-xs uppercase tracking-wider"
                  onClick={clearCart}
                >
                  Limpar Carrinho
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
