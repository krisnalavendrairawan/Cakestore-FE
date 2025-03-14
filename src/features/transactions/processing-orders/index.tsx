import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Calendar, Clock, DollarSign, User, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast'
import { orderService } from '@/services/api'
import { formatDate, formatTime, formatRupiah } from '../helpers/helpers';
import { Order } from './data/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const ordersPerPage = 6;

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders.filter((order: Order) => 
        order.status === 'processing' || 
        order.status === 'shipped' || 
        order.status === 'pending' || 
        order.status === 'completed'
      ));
      recalculatePagination();
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recalculatePagination = () => {
    const filteredOrders = orders.filter((order: Order) => order.status === activeTab);
    setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    recalculatePagination();
  }, [activeTab, orders]);

  const handleUpdateStatus = async (orderId: number, newStatus: 'processing' | 'shipped' | 'pending' | 'completed') => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast({
        title: "Success",
        description: `Order has been marked as ${newStatus}`,
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Get current orders based on active tab and pagination
  const filteredOrders = orders.filter(order => order.status === activeTab);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getBadgeStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'processing':
        return "bg-amber-100 text-amber-800";
      case 'shipped':
        return "bg-blue-100 text-blue-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return { status: 'processing', label: 'Mark as Processing' };
      case 'processing':
        return { status: 'shipped', label: 'Mark as Shipped' };
      case 'shipped':
        return { status: 'completed', label: 'Mark as Completed' };
      case 'completed':
        return { status: 'completed', label: 'Completed' };
      default:
        return { status: 'processing', label: 'Update Status' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
        <Button 
          variant="outline" 
          onClick={fetchOrders}
          className="flex items-center gap-1"
        >
          <Loader2 className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      <Tabs 
        defaultValue="pending" 
        className="mb-6"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no orders in {activeTab} status.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-primary/5 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {order.order_number}
                    </CardTitle>
                    <Badge variant="secondary" className={`px-2 py-1 ${getBadgeStyles(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.user?.name || 'User'}`} />
                        <AvatarFallback>{order.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.user?.name || `User ${order.user_id}`}</p>
                        <p className="text-xs text-muted-foreground">{order.user?.phone_number}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(order.order_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(order.order_date)}</span>
                      </div>
                      <div className="flex items-center gap-1 col-span-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{formatRupiah(order.total_price)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-1 text-muted-foreground" />
                        Order Items ({order.order_items?.length || 0})
                      </p>
                      <ul className="text-sm space-y-1 max-h-24 overflow-y-auto">
                        {order.order_items?.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span className="truncate max-w-[180px]">
                              {item.product?.name || `Product #${item.product_id}`}
                            </span>
                            <span className="text-muted-foreground">x{item.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {order.notes && (
                      <div className="border-t pt-2">
                        <p className="text-sm text-muted-foreground italic">
                          Notes: {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-primary/5 flex justify-end">
                  {order.status !== 'completed' ? (
                    <Button 
                      onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status).status as any)}
                      className="w-full"
                    >
                      {getNextStatus(order.status).label}
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      variant="outline"
                      className="w-full"
                    >
                      Order Completed
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredOrders.length > ordersPerPage && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <PaginationItem key={number}>
                    <PaginationLink
                      onClick={() => paginate(number)}
                      isActive={currentPage === number}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;