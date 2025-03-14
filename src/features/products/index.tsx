import { useState, useEffect } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconPlus,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconShoppingCart,
  IconPercentage,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { productService, categoryService } from '@/services/api'
import { Product } from '@/features/products/data/schema'
import { Category } from '@/features/category/data/schema'
import { Link } from '@tanstack/react-router'
import { getImageProductUrl } from '@/utils/fileUpload';

import { toast } from '@/hooks/use-toast'
import { DeleteProductModal } from '@/components/dialog/delete-product-modal'
import { UpdateStockModal } from '@/components/update-stock-modal'
import { CreateDiscountModal } from '@/components/dialog/create-discount-modal'

const stockText = new Map<string, string>([
  ['all', 'All Products'],
  ['inStock', 'In Stock'],
  ['outOfStock', 'Out of Stock'],
])

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState('ascending')
  const [stockStatus, setStockStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productForStock, setProductForStock] = useState<Product | null>(null);
  const [showCreateDiscount, setShowCreateDiscount] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productService.getProduct(),
          categoryService.getCategory()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((product) =>
      stockStatus === 'inStock'
        ? product.stock > 0
        : stockStatus === 'outOfStock'
          ? product.stock === 0
          : true
    )
    .filter((product) =>
      selectedCategory === 'all' ? true : product.category_id === parseInt(selectedCategory)
    )
    .filter((product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const handleUpdateStock = (product: Product) => {
    setProductForStock(product);
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <DeleteProductModal 
          product={productToDelete}
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onDelete={(deletedId) => {
            setProducts(products.filter(p => p.id !== deletedId))
          }}
        />
        
        <UpdateStockModal
          product={productForStock}
          isOpen={!!productForStock}
          onClose={() => setProductForStock(null)}
          onUpdate={handleProductUpdate}
        />
        
        <CreateDiscountModal
          products={products}
          isOpen={showCreateDiscount}
          onClose={() => setShowCreateDiscount(false)}
          onUpdate={handleProductUpdate}
        />

        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Our Products
          </h1>
          <p className='text-muted-foreground'>
            Browse through our collection of premium beverages
          </p>
        </div>

        <div className='my-4 flex flex-col gap-4 sm:my-0 sm:flex-row sm:items-center justify-between'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Search products...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-36'>
                <SelectValue>
                  {selectedCategory === 'all' 
                    ? 'All Categories' 
                    : categories.find(cat => cat.id === parseInt(selectedCategory))?.name || 'Select Category'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Stock Status Filter */}
            <Select value={stockStatus} onValueChange={setStockStatus}>
              <SelectTrigger className='w-36'>
                <SelectValue>{stockText.get(stockStatus)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Products</SelectItem>
                <SelectItem value='inStock'>In Stock</SelectItem>
                <SelectItem value='outOfStock'>Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            
            {/* New Create Discount Button */}
            <Button 
              variant="outline"
              className="flex items-center"
              onClick={() => setShowCreateDiscount(true)}
              >
              <IconPercentage size={18} className="mr-2" />
              Create Discount
            </Button>
          </div>

          {/* Group Create Button and Sort Select */}
          <div className='flex items-center gap-2'>
            <Link to="/products/create">
              <Button className="flex items-center rounded-r-none mr-3">
                <IconPlus size={18} />
                <span>Create Product</span>
              </Button>
            </Link>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className='w-16 rounded-l-none border-l-0'>
                <SelectValue>
                  <IconAdjustmentsHorizontal size={18} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent align='end'>
                <SelectItem value='ascending'>
                  <div className='flex items-center gap-4'>
                    <IconSortAscendingLetters size={16} />
                    <span>A-Z</span>
                  </div>
                </SelectItem>
                <SelectItem value='descending'>
                  <div className='flex items-center gap-4'>
                    <IconSortDescendingLetters size={16} />
                    <span>Z-A</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className='shadow' />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600">
            {error}
          </div>
        ) : (
          <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredProducts.map((product) => {
              const discountedPrice = product.price * (1 - product.discount / 100);
              
              return (
                <li
                  key={product.id}
                  className='rounded-lg border p-4 hover:shadow-md'
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img 
                      src={getImageProductUrl(product.image)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = '/placeholder-image.jpg';
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className='font-semibold'>{product.name}</h2>
                      {product.discount > 0 && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <p className='line-clamp-2 text-gray-500'>{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                        )}
                        <span className="font-semibold">
                          Rp {discountedPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}
                      >
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center text-blue-600 hover:bg-blue-50"
                        onClick={() => handleUpdateStock(product)}
                      >
                        <IconShoppingCart size={16} className="mr-2" />
                        Update Stock
                      </Button>
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <Link to={`/products/${product.slug}/edit`}>
                        <Button variant="outline" size="sm">
                          <IconEdit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <IconTrash size={16} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Main>
    </>
  )
}