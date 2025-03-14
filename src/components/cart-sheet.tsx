import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconShoppingCart, IconTrash } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { getImageProductUrl } from '@/utils/fileUpload';
import { CartItem } from '@/services/interface';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { orderService, cartService, productService } from '@/services/api';
import { CreateOrderData } from '@/services/interface';

interface CustomerCartGroup {
  [userId: string]: CartItem[];
}

interface CustomerCartSheetProps {
  customerCarts: CustomerCartGroup;
  onRemoveItem: (cartId: number) => Promise<void>;
}

const CustomerCartSheet = ({ customerCarts, onRemoveItem }: CustomerCartSheetProps) => {
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalItems = Object.values(customerCarts).reduce(
    (sum, cart) => sum + cart.length,
    0
  );

  const handleOrderAll = (userId: string, cartItems: CartItem[]) => {
    setSelectedUserId(userId);
    setSelectedCartItems(cartItems);
    setShowOrderDialog(true);
  };

  const deleteCartItems = async (cartItems: CartItem[]) => {
    try {
      // Delete each cart item sequentially
      for (const item of cartItems) {
        await cartService.removeFromCart(item.id);
      }
    } catch (error: any) {
      throw new Error('Failed to delete cart items: ' + error.message);
    }
  };

   const updateProductStocks = async (cartItems: CartItem[]) => {
    try {
      // Update stock for each product
      for (const item of cartItems) {
        if (item.product) {
          const newStock = item.product.stock - item.qty;
          await productService.updateProductStock(item.product.id.toString(), newStock);
        }
      }
    } catch (error: any) {
      throw new Error('Failed to update product stocks: ' + error.message);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedUserId || selectedCartItems.length === 0) return;

    setIsProcessing(true);
    try {
      const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      const orderData: CreateOrderData = {
        user_id: Number(selectedUserId),
        order_date: new Date().toISOString().split('T')[0],
        total_price: totalPrice,
        status: 'pending' as 'pending',  // Gunakan assertion
        payment_status: 'unpaid' as 'unpaid', // Gunakan assertion
        order_items: selectedCartItems.map(item => ({
          product_id: item.product_id,
          qty: item.qty,
          price: item.price,
          subtotal: item.subtotal
        }))
      };

      // Create the order first
      await orderService.createOrder(orderData);

           // Update product stocks
      await updateProductStocks(selectedCartItems);

      // After successful order creation, delete the cart items
      await deleteCartItems(selectedCartItems);

      setShowOrderDialog(false);
      toast({
        title: "Order created successfully",
        description: "Status: pending, Payment status: unpaid"
      });

      // Clear the selected items
      setSelectedUserId(null);
      setSelectedCartItems([]);

      // Force reload of the page to refresh the cart list
      window.location.reload();

    } catch (error: any) {
      toast({
        title: "Failed to process order",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="icon" className="relative">
      <IconShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  </SheetTrigger>
  <SheetContent className="w-full sm:max-w-lg">
    <SheetHeader>
      <SheetTitle>All Customer Carts</SheetTitle>
    </SheetHeader>

    <ScrollArea className="h-[calc(100vh-120px)] pr-4">
      <div className="mt-6 space-y-8">
        {Object.entries(customerCarts).length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No items in any cart
          </div>
        ) : (
          Object.entries(customerCarts).map(([userId, cartItems]) => (
            <div key={userId} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  Customer: {cartItems[0]?.user?.name || `ID: ${userId}`}
                </h3>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                      {item.product?.image && (
                        <img
                          src={getImageProductUrl(item.product.image)}
                          alt={item.product?.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.src = '/placeholder-image.jpg';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {item.qty} x Rp {item.price.toLocaleString('id-ID')}
                      </div>
                      <div className="mt-1 font-medium">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* Tombol hapus item per produk */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <IconTrash size={18} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-medium">
                <span>Cart Total:</span>
                <span>
                  Rp {cartItems.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString('id-ID')}
                </span>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={() => handleOrderAll(userId, cartItems)}
              >
                Checkout
              </Button>

              <Separator />
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  </SheetContent>
</Sheet>


      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto space-y-4">
              {selectedCartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.qty} x Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <p className="font-medium">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-medium text-lg">
              <span>Total Amount:</span>
              <span>
                Rp {selectedCartItems.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOrderDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerCartSheet;