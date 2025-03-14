import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productService } from '@/services/api';
import { Product } from '@/features/products/data/schema';
import { toast } from '@/hooks/use-toast';

type UpdateStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (updatedProduct: Product) => void;
};

export function UpdateStockModal({ isOpen, onClose, product, onUpdate }: UpdateStockModalProps) {
  const [stock, setStock] = useState<number>(product?.stock || 0);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (product) {
      setStock(product.stock);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    try {
      setIsLoading(true);
      const response = await productService.updateProductStock(product.id.toString(), stock);
      
      if (response.status === 'success') {
        toast({
          title: 'Stock Updated',
          description: 'Product stock has been successfully updated.',
        });
        onUpdate({ ...product, stock });
        onClose();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product stock. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
        </DialogHeader>
        {product && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-name" className="text-right">
                  Product
                </Label>
                <div className="col-span-3 font-medium">{product.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  min={0}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Stock'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}