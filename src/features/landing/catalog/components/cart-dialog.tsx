import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { getImageProductUrl } from '@/utils/fileUpload';
import { Product } from '../types/interface';
import { orderService } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  qty: number;
  price: number;
  subtotal: number;
}

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  cartLoading: boolean;
  cartTotal: number;
  onUpdateQuantity: (cartId: number, newQty: number, product: Product, currentPrice: number) => void;
  onRemoveItem: (cartId: number) => void;
  onCartClear?: () => Promise<void>; // Added to clear cart after checkout
}

interface RemoveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToRemove: number | null;
  onConfirmRemove: () => void;
  onCancelRemove: () => void;
}

const formatToRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

// Remove Confirmation Dialog
const RemoveConfirmDialog = ({
  open,
  onOpenChange,
  onConfirmRemove,
  onCancelRemove
}: RemoveConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Remove Item</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to remove this item from your cart?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancelRemove}>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={onConfirmRemove}
          className="bg-red-600 hover:bg-red-700"
        >
          Remove
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Empty Cart Component
const EmptyCart = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
    <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
    <p className="text-gray-500 text-center mb-4">
      Looks like you haven't added any products to your cart yet.
    </p>
    <Button 
      className="bg-pink-600 hover:bg-pink-700"
      onClick={onClose}
    >
      Start Shopping
    </Button>
  </div>
);

// Cart Item Component
const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem 
}: { 
  item: CartItem;
  onUpdateQuantity: (cartId: number, newQty: number, product: Product, currentPrice: number) => void;
  onRemoveItem: (cartId: number) => void;
}) => (
  <div className="flex gap-4 py-3 border-b">
    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
      <img 
        src={getImageProductUrl(item.product.image)} 
        alt={item.product.name} 
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex-1">
      <h4 className="font-medium">{item.product.name}</h4>
      <p className="text-sm text-pink-600">{formatToRupiah(item.price)}</p>
      
      <div className="flex items-center gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onUpdateQuantity(item.id, item.qty - 1, item.product, item.price)}
        >
          -
        </Button>
        <span className="w-8 text-center">{item.qty}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onUpdateQuantity(item.id, item.qty + 1, item.product, item.price)}
        >
          +
        </Button>
      </div>
    </div>
    <div className="flex flex-col justify-between items-end">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
        onClick={() => onRemoveItem(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <span className="font-medium">{formatToRupiah(item.subtotal)}</span>
    </div>
  </div>
);

// Main Cart Dialog Component
const CartDialog = ({
  open,
  onOpenChange,
  cartItems,
  cartLoading,
  cartTotal,
  onUpdateQuantity,
  onRemoveItem,
  onCartClear
}: CartDialogProps) => {
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const { user } = useAuthStore().auth.customer;

  const handleRemoveItem = (cartId: number) => {
    setItemToRemove(cartId);
    setRemoveConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove !== null) {
      onRemoveItem(itemToRemove);
      // Toast message will be handled in the parent component after actual removal
    }
    setRemoveConfirmOpen(false);
    setItemToRemove(null);
  };

  const handleCancelRemove = () => {
    setRemoveConfirmOpen(false);
    setItemToRemove(null);
  };

  const handleCheckout = async () => {
    if (!user?.id || cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: "Cannot proceed with checkout. Please try again."
      });
      return;
    }

    setProcessingCheckout(true);

    try {
      // Format cart items into order items
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        qty: item.qty,
        price: item.price,
        subtotal: item.subtotal
      }));

      const formatedDate = (date: Date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      }
      const orderData = {
        user_id: user.id,
        order_date: formatedDate(new Date()),
        total_price: cartTotal,
        status: 'pending' as const, 
        payment_status: 'unpaid' as const,
        order_items: orderItems
      };

      // Submit the order
      const response = await orderService.createOrder(orderData);
      
      // Clear the cart after successful order
      if (onCartClear) {
        await onCartClear();
      }

      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${response.data.id} has been placed! Please complete the payment.`,
        variant: "default"
      });

      // Close the cart dialog
      onOpenChange(false);
      
      // Redirect to order confirmation page (if you have one)
      // router.push(`/order/confirmation/${response.data.id}`);
      
    } catch (error) {
      console.error('Checkout failed:', error);
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again."
      });
    } finally {
      setProcessingCheckout(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Shopping Cart</DialogTitle>
            <DialogDescription>
              Review the items in your cart before proceeding to checkout.
            </DialogDescription>
          </DialogHeader>
          
          {cartLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : cartItems.length > 0 ? (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onUpdateQuantity={onUpdateQuantity} 
                    onRemoveItem={handleRemoveItem} 
                  />
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatToRupiah(cartTotal)}</span>
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={processingCheckout}
                >
                  Continue Shopping
                </Button>
                <Button 
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={processingCheckout || cartItems.length === 0}
                  onClick={handleCheckout}
                >
                  {processingCheckout ? (
                    <>
                      <span className="mr-2">Processing...</span>
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <EmptyCart onClose={() => onOpenChange(false)} />
          )}
        </DialogContent>
      </Dialog>

      <RemoveConfirmDialog
        open={removeConfirmOpen}
        onOpenChange={setRemoveConfirmOpen}
        itemToRemove={itemToRemove}
        onConfirmRemove={handleConfirmRemove}
        onCancelRemove={handleCancelRemove}
      />
    </>
  );
};

export default CartDialog;