import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, formatRupiah } from '../../helpers/helpers';
import { getImageProductUrl } from '@/utils/fileUpload'

import { Order } from '../data/schema';

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const OrderDetailDialog = ({ open, onOpenChange, order }: OrderDetailDialogProps) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-teal-100 text-teal-800"
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.order_number}</span>
            <div className="flex gap-2">
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              <Badge className={getPaymentStatusColor(order.payment_status)}>{order.payment_status}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(90vh-10rem)]">
            <div className="space-y-6 p-4">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{order.user?.name ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.user?.email ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.user?.phone_number ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {formatDate(order.order_date)} {formatTime(order.order_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {order.payments && order.payments[0] && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-medium">{order.payments[0].payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Date</p>
                        <p className="font-medium">
                          {order.payments[0].payment_date ? 
                            `${formatDate(order.payments[0].payment_date)} ${formatTime(order.payments[0].payment_date)}` : 
                            'Not paid yet'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Quantity</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.order_items?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                              {item.product?.image ? (
                              <img
                                  src={getImageProductUrl(item.product.image)}
                                  alt={item.product?.name || 'Product'}
                                  className="h-16 w-16 rounded-md object-cover"
                                  onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
                                  }}
                              />
                              ) : (
                              <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                                  <span className="text-gray-400">No image</span>
                              </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                                {item.product?.discount > 0 && (
                                  <p className="text-sm text-green-600">Discount: {item.product.discount}%</p>
                                )}
                              </div>
                          </div>
                          </td>
                          <td className="px-4 py-4 text-right">{formatRupiah(item.price)}</td>
                          <td className="px-4 py-4 text-right">{item.qty}</td>
                          <td className="px-4 py-4 text-right">{formatRupiah(item.qty * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-semibold">Total</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatRupiah(order.total_price)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;