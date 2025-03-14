import { useState, useEffect } from 'react'
import {
  IconShoppingCart,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
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
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { productService, categoryService, orderService, userService, cartService, Auth } from '@/services/api'
import { Product } from '@/features/products/data/schema'
import { Category } from '@/features/category/data/schema'
import { getImageProductUrl } from '@/utils/fileUpload'
import { toast } from '@/hooks/use-toast'
import OrderDialog from '@/components/dialog/order-dialog'

// New imports for order functionality
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { User } from '@/features/users/staff/data/schema'
import CartDialog from '@/components/dialog/cart-dialog'
import { CartItem } from '@/services/interface'
import { useAuthStore } from '@/stores/authStore'
import CustomerCartSheet from '@/components/cart-sheet'

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
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderTotal, setOrderTotal] = useState(0)
  const [showCartDialog, setShowCartDialog] = useState(false)
  const [cartQuantity, setCartQuantity] = useState(1)
  const [cartTotal, setCartTotal] = useState(0)
  const [allCustomerCarts, setAllCustomerCarts] = useState<Record<string, CartItem[]>>({});


  useEffect(() => {
  const restoreSession = async () => {
    try {
    const token = useAuthStore.getState().auth.customer.accessToken;
    if (token && !useAuthStore.getState().auth.customer.user) {
      await Auth.getCurrentUser();
    }
    } catch (error) {
      console.error('Failed to restore session:', error);
      // Optionally handle the error (e.g., redirect to login)
    }
  };

  restoreSession();
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData, customersData] = await Promise.all([
          productService.getProduct(),
          categoryService.getCategory(),
          userService.getCustomers()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
        setCustomers(customersData)
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

  const handleOrder = (product: Product) => {
    setSelectedProduct(product)
    setOrderQuantity(1)
    setSelectedCustomerId('')
    setOrderTotal(product.price * (1 - product.discount / 100))
    setShowOrderDialog(true)
  }

  const handleConfirmOrder = async () => {
    if (!selectedProduct || !selectedCustomerId) {
      toast({
        title: "Error",
        description: "Please select a customer first",
        variant: "destructive"
      })
      return
    }

    try {
      // Calculate final price with discount
      const discountedPrice = selectedProduct.price * (1 - selectedProduct.discount / 100);
      const totalItemPrice = discountedPrice * orderQuantity;

      const orderData = {
        user_id: Number(selectedCustomerId),
        order_date: new Date().toISOString().split('T')[0],
        total_price: totalItemPrice,
        status: 'pending' as 'pending',
        payment_status: 'unpaid' as 'unpaid',
        order_items: [
          {
            product_id: selectedProduct.id,
            qty: orderQuantity,
            price: selectedProduct.price,
            subtotal: totalItemPrice,
          }
        ]
      }

      const orderResponse = await orderService.createOrder(orderData);
      
      if (orderResponse.data?.id) {
        // Update stock product
        const newStock = selectedProduct.stock - orderQuantity;
        await productService.updateProductStock(selectedProduct.id.toString(), newStock);
        
        setShowOrderDialog(false);
        toast({
          title: "Order created successfully",
          description: "Status: pending, Payment status: unpaid"
        });

        // Refresh product list to update stock
        const productsData = await productService.getProduct();
        setProducts(productsData);
      }
    } catch (error: any) {
      console.error('Order error:', error);
      console.error('Error response data:', error.response?.data);
      toast({
        title: "Failed to process order",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive"
      })
    }
  }

  const handlePayment = async () => {
    try {
      setShowPaymentDialog(false)
      toast({
        title: "Payment successful",
        description: "Thank you for your purchase!"
      })
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again later",
        variant: "destructive"
      })
    }
  }

  const handleAddToCartClick = (product: Product) => {
    setSelectedProduct(product)
    setCartQuantity(1)
    setSelectedCustomerId('')
    setCartTotal(product.price * (1 - product.discount / 100))
    setShowCartDialog(true)
  }

const handleAddToCart = async () => {
  if (!selectedProduct || !selectedCustomerId) {
    toast({
      title: "Error", 
      description: "Please select a customer first",
      variant: "destructive"
    })
    return
  }

  const currentUser = useAuthStore.getState().auth.staff.user;
  
  if (!currentUser?.id) {
    toast({
      title: "Error",
      description: "Please login first to add items to cart",
      variant: "destructive"
    });
    return;
  }

  try {
    const discountedPrice = selectedProduct.price * (1 - selectedProduct.discount / 100);
    
    const cartData = {
      user_id: Number(selectedCustomerId),
      product_id: selectedProduct.id,
      qty: cartQuantity,
      price: discountedPrice,
      subtotal: cartTotal,
      created_by: currentUser.id
    };

    await cartService.addToCart(cartData);
      
    await fetchAllCustomerCarts();
    
    setShowCartDialog(false);
    toast({
      title: "Success",
      description: "Product added to cart successfully"
    });

  } catch (error: any) {
    console.error('Error adding to cart:', error);
    toast({
      title: "Failed to add to cart",
      description: error.response?.data?.message || "Please try again later",
      variant: "destructive"  
    });
  }
};


const fetchAllCustomerCarts = async () => {
  try {
    const response = await cartService.getAllCustomerCarts();
    setAllCustomerCarts(response.data);
  } catch (error) {
    console.error('Error fetching all customer carts:', error);
    toast({
      title: "Failed to fetch customer carts",
      description: "Please try again later",
      variant: "destructive"
    });
  }
};

const handleRemoveFromCart = async (cartId: number) => {
  try {
    await cartService.removeFromCart(cartId);
    // Immediately fetch updated cart data
    await fetchAllCustomerCarts();
    
    toast({
      title: "Success",
      description: "Item removed from cart"
    });
  } catch (error) {
    toast({
      title: "Failed to remove item",
      description: "Please try again later",
      variant: "destructive"
    });
  }
};


  // Calculate order total based on selected product and order quantity
  useEffect(() => {
    if (selectedProduct) {
      const discountedPrice = selectedProduct.price * (1 - selectedProduct.discount / 100)
      setOrderTotal(discountedPrice * orderQuantity)
    }
  }, [selectedProduct, orderQuantity])

  useEffect(() => {
    if (selectedProduct) {
      const discountedPrice = selectedProduct.price * (1 - selectedProduct.discount / 100)
      setCartTotal(discountedPrice * cartQuantity)
    }
  }, [selectedProduct, cartQuantity])

  useEffect(() => {
    if (selectedProduct) {
      const discountedPrice = selectedProduct.price * (1 - selectedProduct.discount / 100)
      setCartTotal(discountedPrice * cartQuantity)
    }
  }, [selectedProduct, cartQuantity])

  useEffect(() => {
  fetchAllCustomerCarts();
}, []);

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
        {/* Order Dialog */}
        <OrderDialog
          showOrderDialog={showOrderDialog}
          setShowOrderDialog={setShowOrderDialog}
          selectedProduct={selectedProduct}
          orderQuantity={orderQuantity}
          setOrderQuantity={setOrderQuantity}
          orderTotal={orderTotal}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          customers={customers}
          handleConfirmOrder={handleConfirmOrder}
        />

        <CartDialog
          showCartDialog={showCartDialog}
          setShowCartDialog={setShowCartDialog}
          selectedProduct={selectedProduct}
          cartQuantity={cartQuantity}
          setCartQuantity={setCartQuantity}
          cartTotal={cartTotal}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          customers={customers}
          handleAddToCart={handleAddToCart}
        />

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>Rp {orderTotal.toLocaleString('id-ID')}</span>
              </div>
              {/* Add payment method selection and other payment details here */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePayment}>
                Pay Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Manual Order
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
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-36'>
              <SelectValue>
                {sort === 'ascending' ? 'A to Z' : 'Z to A'}
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

        <CustomerCartSheet 
          customerCarts={allCustomerCarts}
          onRemoveItem={handleRemoveFromCart}
        />
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
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={product.stock === 0}
                        onClick={() => handleAddToCartClick(product)}
                      >
                        <IconShoppingCart size={18} className="mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        className="w-full"
                        disabled={product.stock === 0}
                        onClick={() => handleOrder(product)}
                      >
                        Order Now
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