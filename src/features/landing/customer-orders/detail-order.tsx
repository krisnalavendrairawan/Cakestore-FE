import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { orderService, productService } from '@/services/api';
import { Order } from '@/services/interface';
import { Product } from '@/features/products/data/schema';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import PaymentButton from './components/PaymentButton';
import PaymentTypeSelector from './components/PaymentTypeSelector';
import { formatToRupiah, getOrderStatusColor, getStatusColor, renderOrderTimeline } from './utils/helper';

interface OrderDetailProps {
  orderId: string;
}

const OrderDetail = ({ orderId }: OrderDetailProps) => {

  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('bank_transfer');


  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const [orderData, productsData] = await Promise.all([
        orderService.getOrder(parseInt(orderId)),
        productService.getProduct()
      ]);
      
      setOrder(orderData);
      setProducts(productsData);
    } catch (err) {
      setError('Gagal memuat data pesanan');
      console.error('Error fetching order data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductDetails = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  // Helper function to get status message
  const getStatusMessage = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'processing':
        return 'Pesanan sedang diproses';
      case 'shipped':
        return 'Pesanan sedang dikirim';
      case 'completed':
        return 'Pesanan anda sudah selesai dan diterima. Silahkan menikmati!';
      case 'cancelled':
        return 'Pesanan Dibatalkan';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Check if order is cancelled or completed
  const isOrderCancelled = order.status === 'cancelled';
  const isOrderCompleted = order.status === 'completed';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/landing/customer-orders" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Detail Pesanan #{order.order_number}</h1>
        </div>

        {!isOrderCancelled && renderOrderTimeline(order.status)}

        {/* Status alert message */}
        {order.status && (
          <Alert 
            className={`mb-6 ${
              isOrderCancelled ? 'bg-red-50 border-red-200' : 
              isOrderCompleted ? 'bg-green-50 border-green-200' : 
              'bg-blue-50 border-blue-200'
            }`}
          >
            {isOrderCancelled ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isOrderCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-blue-500" />
            )}
            <AlertTitle className={`${
              isOrderCancelled ? 'text-red-600' : 
              isOrderCompleted ? 'text-green-600' : 
              'text-blue-600'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </AlertTitle>
            <AlertDescription className={`${
              isOrderCancelled ? 'text-red-600' : 
              isOrderCompleted ? 'text-green-600' : 
              'text-blue-600'
            }`}>
              {getStatusMessage(order.status)}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Informasi Pesanan</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(order.payment_status)}>
                    {order.payment_status === 'unpaid' ? 'BELUM BAYAR' : 
                     order.payment_status === 'partially_paid' ? 'DIBAYAR SEBAGIAN' : 'LUNAS'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tanggal Pesanan</p>
                    <p className="text-sm">{new Date(order.order_date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  {!isOrderCancelled && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Metode Pembayaran</p>
                      <p className="text-sm">Transfer Bank</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detail Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">Harga Satuan</TableHead>
                    <TableHead className="text-center">Jumlah</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items.map((item, index) => {
                    const product = getProductDetails(item.product_id);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {product?.name || 'Produk tidak ditemukan'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatToRupiah(item.price)}
                        </TableCell>
                        <TableCell className="text-center">{item.qty}</TableCell>
                        <TableCell className="text-right">
                          {formatToRupiah(item.price * item.qty)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatToRupiah(order.total_price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pengiriman</span>
                  <span>Gratis</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-pink-600">{formatToRupiah(order.total_price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.payment_status === 'unpaid' && !isOrderCancelled && (
            <>
              <PaymentTypeSelector
                selectedType={selectedPaymentType}
                onTypeChange={setSelectedPaymentType}
              />
              <Card>
                <CardContent className="pt-6">
                  <PaymentButton 
                    orderId={order.id} 
                    amount={order.total_price}
                    paymentStatus={order.payment_status}
                    paymentType={selectedPaymentType}
                  />
                </CardContent>
              </Card>
            </>
          )}
          

          
          {isOrderCancelled && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-600">Pesanan Dibatalkan</AlertTitle>
              <AlertDescription className="text-red-600">
                Pesanan ini telah dibatalkan dan tidak dapat diproses lagi.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;