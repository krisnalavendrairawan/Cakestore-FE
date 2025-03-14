import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Order } from '../data/schema'
import { paymentService, orderService } from '@/services/api'
import { toast } from '@/hooks/use-toast'

type OrdersDialogType = 'create' | 'update' | 'delete' | 'import' | 'pay'

interface OrdersContextType {
  open: OrdersDialogType | null
  setOpen: (str: OrdersDialogType | null) => void
  currentRow: Order | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Order | null>>
  handlePayment: (orderId: number) => Promise<void>
}

const OrdersContext = React.createContext<OrdersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function OrdersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<OrdersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Order | null>(null)
  
  const handlePayment = async (orderId: number) => {
    try {
      if (!currentRow) return;
      const currentOrderDetails = await orderService.getOrder(orderId);
      
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 19).replace('T', ' ');
      
      const paymentResponse = await paymentService.createPayment({
        user_id: currentRow.user_id,
        order_id: orderId,
        payment_method: 'cash',
        payment_date: formattedDate, 
        amount: currentRow.total_price,
        status: 'completed'
      });
      
      console.log("Payment response:", paymentResponse);
      
      const updateResponse = await orderService.updateOrder(orderId, {
        user_id: currentRow.user_id,
        order_date: currentRow.order_date,
        total_price: currentRow.total_price,
        status: 'processing',
        payment_status: 'unpaid',
        order_items: currentOrderDetails.order_items
      });
      
      console.log("Order update response:", updateResponse);
      
      toast({
        title: "Payment Successful",
        description: "Order has been paid and marked as completed",
      });
      
      // Close the dialog
      setOpen(null);
      
      // Trigger a window reload to refresh the orders list
      window.location.reload();
      
    } catch (error) {
      console.error('Failed to process payment:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing the payment",
        variant: "destructive",
      });
    }
  };
  
  return (
    <OrdersContext.Provider value={{ 
      open, 
      setOpen, 
      currentRow, 
      setCurrentRow,
      handlePayment 
    }}>
      {children}
    </OrdersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => {
  const ordersContext = React.useContext(OrdersContext)

  if (!ordersContext) {
    throw new Error('useOrder has to be used within <OrdersContext>')
  }

  return ordersContext
}