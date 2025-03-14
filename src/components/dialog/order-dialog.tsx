import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/features/products/data/schema';
import { User } from '@/features/users/staff/data/schema';

interface OrderDialogProps {
  showOrderDialog: boolean;
  setShowOrderDialog: (show: boolean) => void;
  selectedProduct: Product | null;
  orderQuantity: number;
  setOrderQuantity: (quantity: number) => void;
  orderTotal: number;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  customers: User[];
  handleConfirmOrder: () => void;
}

export default function OrderDialog({
  showOrderDialog,
  setShowOrderDialog,
  selectedProduct,
  orderQuantity,
  setOrderQuantity,
  orderTotal,
  selectedCustomerId,
  setSelectedCustomerId,
  customers,
  handleConfirmOrder
}: OrderDialogProps) {
  const [open, setOpen] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value);
    if (!isNaN(qty) && qty >= 1 && qty <= (selectedProduct?.stock || 0)) {
      setOrderQuantity(qty);
    }
  };

  return (
    <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Customer</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between text-left"
                >
                  {selectedCustomerId
                    ? customers.find((customer) => customer.id.toString() === selectedCustomerId)?.name
                    : "Select a customer..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search customers..." />
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {customers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.name}
                        onSelect={() => {
                          setSelectedCustomerId(customer.id.toString());
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCustomerId === customer.id.toString() ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{customer.name}</span>
                          <span className="text-sm text-muted-foreground">{customer.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Product Details</Label>
            <div className="rounded-lg border p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Name:</span>
                <span className="text-sm font-medium">{selectedProduct?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price:</span>
                <span className="text-sm font-medium">
                  Rp {selectedProduct?.price.toLocaleString('id-ID')}
                </span>
              </div>
                {selectedProduct && selectedProduct.discount !== undefined && selectedProduct.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm">Discount:</span>
                    <span className="text-sm font-medium text-red-600">
                      {selectedProduct.discount}%
                    </span>
                  </div>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity</Label>
            <Input
              type="number"
              min={1}
              max={selectedProduct?.stock}
              value={orderQuantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Method</Label>
            <Input
              type="text"
              value="Cash"
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>Rp {orderTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmOrder} disabled={!selectedCustomerId}>
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}