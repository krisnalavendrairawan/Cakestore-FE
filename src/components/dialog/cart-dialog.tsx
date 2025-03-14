import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/features/products/data/schema';
import { User } from '@/features/users/staff/data/schema';

interface CartDialogProps {
  showCartDialog: boolean;
  setShowCartDialog: (show: boolean) => void;
  selectedProduct: Product | null;
  cartQuantity: number;
  setCartQuantity: (quantity: number) => void;
  cartTotal: number;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  customers: User[];
  handleAddToCart: () => void;
}

const CartDialog = ({
  showCartDialog,
  setShowCartDialog,
  selectedProduct,
  cartQuantity,
  setCartQuantity,
  cartTotal,
  selectedCustomerId,
  setSelectedCustomerId,
  customers,
  handleAddToCart,
}: CartDialogProps) => {
  if (!selectedProduct) return null;

  const discountedPrice = selectedProduct.price * (1 - selectedProduct.discount / 100);

  return (
    <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Cart</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Customer</label>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Product</label>
            <p className="mt-1">{selectedProduct.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Price</label>
            <p className="mt-1">
              {selectedProduct.discount > 0 && (
                <span className="text-sm text-gray-500 line-through mr-2">
                  Rp {selectedProduct.price.toLocaleString('id-ID')}
                </span>
              )}
              <span>Rp {discountedPrice.toLocaleString('id-ID')}</span>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min={1}
              max={selectedProduct.stock}
              value={cartQuantity}
              onChange={(e) => setCartQuantity(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Total</label>
            <p className="mt-1 text-lg font-semibold">
              Rp {cartTotal.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCartDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;