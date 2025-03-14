import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, ArrowRight, X, Search, Star } from 'lucide-react';
import { orderService, productService, reviewService } from '@/services/api';
import { Order } from '@/services/interface';
import { Product } from '@/features/products/data/schema';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { formatToRupiah, getStatusColor, getOrderStatusColor } from './utils/helper';
import CustomerNavbar from '../components/CustomerNavbar';
import CreateReviewModal from './components/CreateReviewModal';

const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelingOrder, setCancelingOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<number[]>([]);
  const [reviewProducts, setReviewProducts] = useState<Array<{id: number; name: string; image: string}>>([]);

  const ordersPerPage = 3;

  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    image: string;
  } | null>(null);


  const fetchUserReviews = async () => {
    try {
      const response = await reviewService.getUserProductReviews();
      const reviewedProductIds = response.data.map((review: any) => review.product_id);
      setReviewedProducts(reviewedProductIds);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  const fetchDataReview = async () => {
  try {
    setLoading(true);
    const [ordersData, productsData] = await Promise.all([
      orderService.getOrders(),
      productService.getProduct()
    ]);
    
    const sortedOrders = [...ordersData].sort((a, b) => 
      new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
    );
    
    setOrders(sortedOrders);
    setProducts(productsData);
    
    await fetchUserReviews();
  } catch (err) {
    setError('Failed to load orders');
    console.error('Error fetching data:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData] = await Promise.all([
        orderService.getOrders(),
        productService.getProduct()
      ]);
      
      // Sort orders by date (newest first)
      const sortedOrders = [...ordersData].sort((a, b) => 
        new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      );
      
      setOrders(sortedOrders);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  // Search function
  const filterOrders = (orders: Order[]) => {
    if (!searchTerm.trim()) return orders;
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    
    return orders.filter(order => {
      // Search by order date
      const orderDate = new Date(order.order_date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).toLowerCase();
      
      // Search by price
      const totalPrice = formatToRupiah(order.total_price).toLowerCase();
      
      // Search by product names
      const productNames = order.order_items?.map(item => 
        getProductName(item.product_id).toLowerCase()
      ).join(' ') || '';
      
      // Search by order ID
      const orderId = order.id.toString();
      
      return orderDate.includes(lowercaseSearchTerm) || 
              totalPrice.includes(lowercaseSearchTerm) ||
              productNames.includes(lowercaseSearchTerm) ||
              orderId.includes(lowercaseSearchTerm);
    });
  };

  const handleReviewSubmitted = async (productId: number) => {
    setReviewedProducts([...reviewedProducts, productId]);
    await fetchData();
  };

  const handleOpenCancelDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  // Cancel order
  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    
    try {
      setCancelingOrder(true);
      await orderService.cancelOrder(selectedOrderId);
      
      // Update orders list
      setOrders(orders.map(order => 
        order.id === selectedOrderId 
          ? { ...order, status: 'cancelled' as Order['status'] } 
          : order
      ));
      
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: "Failed to cancel your order. Please try again."
      });
    } finally {
      setCancelingOrder(false);
      setCancelDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination logic
  const filteredOrders = filterOrders(orders);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const canCancelOrder = (order: Order) => {
    return order.payment_status !== 'paid' && 
           order.status !== 'completed' && 
           order.status !== 'cancelled';
  };

  const getActionButtonText = (order: Order) => {
    if (order.status === 'cancelled') {
      return 'Lihat Detail';
    }
    return order.payment_status === 'unpaid' ? 'Bayar Sekarang' : 'Lihat Detail';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <CustomerNavbar />
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Riwayat Pesanan</h1>
        
        {/* Search box */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Cari pesanan berdasarkan tanggal, produk, atau harga..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {filteredOrders.length === 0 ? (
          <Alert className="mt-4">
            {searchTerm ? (
              <>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Tidak Ada Hasil</AlertTitle>
                <AlertDescription>
                  Tidak ada pesanan yang sesuai dengan pencarian "{searchTerm}".
                </AlertDescription>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Belum Ada Pesanan</AlertTitle>
                <AlertDescription>
                  Anda belum memiliki pesanan saat ini.
                </AlertDescription>
              </>
            )}
          </Alert>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {currentOrders.map((order) => (
                <Card key={order.id} className="w-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Pesanan #{order.order_number}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {new Date(order.order_date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${getOrderStatusColor(order.status)}`}>
                          {order.status === 'completed' ? 'SELESAI' :
                           order.status === 'processing' ? 'DIPROSES' :
                           order.status === 'pending' ? 'MENUNGGU' :
                           order.status === 'cancelled' ? 'DIBATALKAN' : (order.status as string).toUpperCase()}
                        </Badge>
                        <Badge className={`${getStatusColor(order.payment_status)}`}>
                          {order.payment_status === 'unpaid' ? 'BELUM BAYAR' : 
                           order.payment_status === 'partially_paid' ? 'DIBAYAR SEBAGIAN' : 'LUNAS'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Ringkasan Pesanan</h4>
                        <div className="space-y-2">
                          {order.order_items?.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{getProductName(item.product_id)} × {item.qty}</span>
                              <span>{formatToRupiah(item.price * item.qty)}</span>
                            </div>
                          ))}
                          {order.order_items?.length > 2 && (
                            <p className="text-sm text-gray-500">
                              Dan {order.order_items.length - 2} item lainnya...
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-bold text-pink-600">
                            {formatToRupiah(order.total_price)}
                          </div>
                      <div className="flex space-x-2">
                        {canCancelOrder(order) && (
                          <Button 
                            variant="outline" 
                            className="border-red-500 hover:bg-red-50 text-red-500"
                            onClick={() => handleOpenCancelDialog(order.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Batalkan
                          </Button>
                        )}
                          {/* {order.payment_status === 'paid' && order.status === 'completed' && ( */}
                          {order.payment_status === 'paid' && (
                            <>
                              {order.order_items && order.order_items.some(item => !reviewedProducts.includes(item.product_id)) ? (
                                <Button
                                  variant="outline"
                                  className="border-green-500 hover:bg-green-50 text-green-500"
                                  onClick={() => {
                                    const unreviewedProducts = order.order_items
                                      ?.filter(item => !reviewedProducts.includes(item.product_id))
                                      .map(item => {
                                        const product = products.find(p => p.id === item.product_id);
                                        return {
                                          id: item.product_id,
                                          name: product?.name || 'Unknown Product',
                                          image: product?.image || ''
                                        };
                                      });
                                      
                                    setReviewProducts(unreviewedProducts);
                                    setSelectedProduct(unreviewedProducts[0]); // Add this line
                                    setIsReviewModalOpen(true);
                                  }}
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  Buat Review
                                </Button>
                              ) : (
                                <div className="text-sm text-green-600 flex items-center">
                                  <Star className="h-4 w-4 mr-1 fill-current" />
                                  Semua produk telah direview
                                </div>
                              )}
                            </>
                          )}

                          <Link 
                            to="/landing/customer-orders/$orderId"
                            params={{ orderId: order.id.toString() }}
                          >
                            <Button className='text-white bg-pink-600'>
                              {getActionButtonText(order)}
                              <ArrowRight className="h-4 w-4 ml-2 " />
                            </Button>
                          </Link>
                        </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pesanan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelingOrder}>Tidak</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelOrder}
              className="bg-red-600 hover:bg-red-700"
              disabled={cancelingOrder}
            >
              {cancelingOrder ? (
                <>
                  <span className="mr-2">Memproses...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                </>
              ) : (
                "Ya, Batalkan Pesanan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        {selectedProduct && (
        <CreateReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setReviewProducts([]);
          }}
          orderProducts={reviewProducts}
          onReviewSubmitted={(productIds) => {
            setReviewedProducts([...reviewedProducts, ...productIds]);
            fetchData();
          }}
        />
        )}
    </div>
  </>
  );
};

export default CustomerOrders;