import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productService } from '@/services/api';
import { Product } from '@/features/products/data/schema';
import { toast } from '@/hooks/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type CreateDiscountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdate: (updatedProduct: Product) => void;
};

export function CreateDiscountModal({ isOpen, onClose, products, onUpdate }: CreateDiscountModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast({
        title: 'Error',
        description: 'Please select a product first.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await productService.updateProductDiscount(selectedProduct.id.toString(), discount);
      
      if (response.status === 'success') {
        toast({
          title: 'Discount Created',
          description: 'Product discount has been successfully applied.',
        });
        onUpdate({ ...selectedProduct, discount });
        setSelectedProduct(null);
        setDiscount(0);
        onClose();
      }
    } catch (error) {
      console.error('Error creating discount:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply product discount. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedProduct(null);
    setDiscount(0);
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Product Discount</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Product Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-select" className="text-right">
                Product
              </Label>
              <div className="col-span-3">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between text-left"
                    >
                      {selectedProduct ? selectedProduct.name : "Select product..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search products..." />
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {products.map((product) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => {
                              setSelectedProduct(product);
                              setOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="flex-1">{product.name}</span>
                            {product.discount > 0 && (
                              <span className="ml-2 text-sm text-red-500">
                                -{product.discount}%
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Current Price if product selected */}
            {selectedProduct && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Current Price</Label>
                <div className="col-span-3">
                  <span className="font-medium">
                    Rp {selectedProduct.price.toLocaleString('id-ID')}
                  </span>
                  {selectedProduct.discount > 0 && (
                    <span className="ml-2 text-sm text-red-500">
                      (Current discount: {selectedProduct.discount}%)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Discount Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount (%)
              </Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
                step={0.1}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedProduct}>
              {isLoading ? 'Applying...' : 'Apply Discount'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}