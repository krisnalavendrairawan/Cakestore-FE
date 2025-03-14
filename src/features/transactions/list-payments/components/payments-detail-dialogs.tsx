import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Payment } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { IconCreditCard, IconReceipt, IconUser, IconCalendar, IconHash, IconCurrencyDollar } from "@tabler/icons-react";
import { formatDate, formatTime, formatRupiah } from "../../helpers/helpers";
import { paymentStatuses, paymentMethods } from "../data/data";

interface PaymentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

export function PaymentDetailDialog({ open, onOpenChange, payment }: PaymentDetailDialogProps) {
  if (!payment) return null;

  const paymentStatus = paymentStatuses.find((status) => status.value === payment.status);
  const paymentMethod = paymentMethods.find((method) => method.value === payment.payment_method);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Payment Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Top Section - Key Info & Status */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Payment ID</span>
              <span className="text-lg font-semibold">#{payment.id}</span>
            </div>
            
            {paymentStatus && (
              <Badge 
                className={`px-3 py-1 ${
                  payment.status === 'completed' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                    : payment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}
              >
                {paymentStatus.icon && <paymentStatus.icon className="mr-2 h-4 w-4" />}
                {paymentStatus.label}
              </Badge>
            )}
          </div>

          {/* Customer Info */}
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center mb-3">
              <IconUser className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="font-medium">Customer Information</h3>
            </div>
            <div className="pl-7">
              <p className="text-lg font-medium">{payment.user?.name || `User ${payment.user_id}`}</p>
              <p className="text-sm text-muted-foreground">Customer ID: {payment.user_id}</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center mb-3">
              <IconReceipt className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="font-medium">Order Information</h3>
            </div>
            <div className="pl-7 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order Number:</span>
                <span className="font-medium">{payment.order?.order_number || `Order ${payment.order_id}`}</span>
              </div>
              {payment.order?.order_date && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Order Date:</span>
                  <span>{formatDate(payment.order.order_date)}</span>
                </div>
              )}
              {payment.order?.total_price && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Order Total:</span>
                  <span className="font-semibold">{formatRupiah(payment.order.total_price)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center mb-3">
              <IconCreditCard className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="font-medium">Payment Details</h3>
            </div>
            <div className="pl-7 space-y-3">
              {/* Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-lg font-bold">{formatRupiah(payment.amount)}</span>
              </div>
              
              {/* Method */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Method:</span>
                <div className="flex items-center">
                  {paymentMethod?.icon && <paymentMethod.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                  <span>{paymentMethod?.label || payment.payment_method}</span>
                </div>
              </div>
              
              {/* Date/Time */}
              {payment.payment_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Date:</span>
                  <div className="flex items-center">
                    <IconCalendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(payment.payment_date)} {formatTime(payment.payment_date)}</span>
                  </div>
                </div>
              )}
              
              {/* Transaction ID (if available) */}
              {payment.id && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-sm">{payment.id}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}