import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Search, ShoppingBag } from 'lucide-react';
import { productService, categoryService, cartService } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getImageProductUrl } from '@/utils/fileUpload';
import { Product, Category } from './types/interface';
import { toast } from '@/hooks/use-toast';
import CartDialog from './components/cart-dialog';
import CustomerNavbar from '../components/CustomerNavbar'; 

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  qty: number;
  price: number;
  subtotal: number;
}

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuthStore().auth.customer;
  
  // Cart related states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProduct(),
          categoryService.getCategory()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch cart items when user is logged in
  useEffect(() => {
    if (user?.id) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    // ... rest of the fetchCartItems function (unchanged)
    if (!user?.id) return;
    
    setCartLoading(true);
    try {
      const cartData = await cartService.getCart(user.id);
      setCartItems(cartData);
      
      // Calculate total
      const total = cartData.reduce((sum: number, item: CartItem) => sum + item.subtotal, 0);
      setCartTotal(total);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      toast({
        variant: "destructive",
        title: "Cart Error",
        description: "Failed to load your cart items"
      });
    } finally {
      setCartLoading(false);
    }
  };

  // ... rest of the component functions (unchanged)
  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * (discount / 100));
  };

  const formatToRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = async (product: Product) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to add items to your cart"
      });
      return;
    }

    if (product.stock === 0) {
      toast({
        variant: "destructive",
        title: "Out of Stock",
        description: "This product is currently unavailable"
      });
      return;
    }

    try {
      const cartData = {
        user_id: user.id,
        product_id: product.id,
        qty: 1,
        price: product.discount > 0 
          ? calculateDiscountedPrice(product.price, product.discount) 
          : product.price,
        subtotal: product.discount > 0 
          ? calculateDiscountedPrice(product.price, product.discount) 
          : product.price,
        created_by: user.id
      };

      await cartService.addToCart(cartData);
      toast({
        variant: "default",
        title: "Success",
        description: "Product added to cart!"
      });
      await fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart"
      });
    }
  };

  const removeCartItem = async (cartId: number) => {
    try {
      await cartService.removeFromCart(cartId);
      await fetchCartItems(); // Refresh cart items
      toast({
        variant: "default",
        title: "Item Removed",
        description: "Item removed from cart"
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    }
  };

  const updateCartItemQuantity = async (cartId: number, newQty: number, product: Product, currentPrice: number) => {
    if (newQty <= 0) {
      removeCartItem(cartId);
      return;
    }

    if (newQty > product.stock) {
      toast({
        variant: "destructive",
        title: "Stock Limit",
        description: `Only ${product.stock} items available in stock`
      });
      return;
    }

    try {
      const cartData = {
        user_id: user?.id || 0,
        product_id: product.id,
        qty: newQty,
        price: currentPrice,
        subtotal: currentPrice * newQty,
        created_by: user?.id || 0
      };
      
      await cartService.updateCartItem(cartId, cartData);
      await fetchCartItems(); // Refresh cart items
      toast({
        variant: "default",
        title: "Cart Updated",
        description: "Cart updated successfully"
      });
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update cart quantity"
      });
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setCartTotal(0);
      toast({
        variant: "default",
        title: "Cart Cleared",
        description: "Your cart has been cleared successfully"
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart"
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.category_id === parseInt(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const renderPaginationItems = () => {
    // ... pagination rendering logic (unchanged)
    let items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // If we're beyond page 3, show an ellipsis
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show the current page and pages around it
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // If we're not near the last page, show an ellipsis
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-white">
      <CustomerNavbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our delicious selection of freshly baked goods and custom cakes
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
          <Input
            placeholder="Search products..."
            className="h-9 w-full sm:flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue>
                {selectedCategory === 'all' 
                  ? 'All Categories' 
                  : categories.find(cat => cat.id === parseInt(selectedCategory))?.name || 'Select Category'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Cart Button */}
          <Button 
            className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Cart
            {cartItems.length > 0 && (
              <Badge className="ml-2 bg-white text-pink-600">{cartItems.length}</Badge>
            )}
          </Button>
        </div>

        {/* Products Grid or Empty State */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="relative p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={getImageProductUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-pink-600">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}
                    </Badge>
                    <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {product.discount > 0 ? (
                        <>
                        <span className="text-lg font-bold text-pink-600">
                          {formatToRupiah(calculateDiscountedPrice(product.price, product.discount))}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatToRupiah(product.price)}
                        </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-pink-600">
                            {formatToRupiah(product.price)} 
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Stock: {product.stock}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button 
                      className="flex-1 bg-pink-600 hover:bg-pink-700"
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button variant="outline" className="px-3">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={handlePreviousPage}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={handleNextPage}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-gray-200">
            <div className="relative mb-6">
                <svg
                  className="w-40 h-40 text-gray-200"
                  xmlns="/assets/image/ilustration/empty.png"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M36.8 192H603.2c20.3 0 36.8-16.5 36.8-36.8c0-7.3-2.2-14.4-6.2-20.4L558.2 21.4C549.3 8 534.4 0 518.3 0H121.7c-16 0-31 8-39.9 21.4L6.2 134.7c-4 6.1-6.2 13.2-6.2 20.4C0 175.5 16.5 192 36.8 192zM64 224V384v80c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V384 224H320V384H128V224H64zm448 0V480c0 17.7 14.3 32 32 32s32-14.3 32-32V224H512z"/>
                </svg>
              
              {/* Overlay search icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-20 h-20 text-pink-600 opacity-70" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 text-center max-w-md mb-4">
              We couldn't find any products that match your search criteria.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Reset Filters
              </Button>
              <Button 
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => setCurrentPage(1)}
              >
                Browse All Products
              </Button>
            </div>
          </div>
        )}

        {/* Cart Dialog Component */}
        <CartDialog
          open={cartOpen}
          onOpenChange={setCartOpen}
          cartItems={cartItems}
          cartLoading={cartLoading}
          cartTotal={cartTotal}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeCartItem}
          onCartClear={clearCart}
        />
      </div>
    </div>
  );
};

export default Catalog;