import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { midtransService, orderService, paymentService } from '@/services/api';
import { loadMidtransScript } from '@/utils/midtrans';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';

interface PaymentButtonProps {
  orderId: number;
  amount: number;
  paymentStatus: string;
  paymentType: string;
}

const PaymentButton = ({ orderId, amount, paymentStatus, paymentType }: PaymentButtonProps) => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  
  const currentUserId = auth.customer.user?.id;

  if (paymentStatus === 'paid') {
    return null;
  }

  const createCashPayment = async () => {
    try {
      if (!currentUserId) {
        toast({
          title: "Error",
          description: "Silakan login terlebih dahulu",
          variant: "destructive",
        });
        return;
      }

      const paymentData = {
        user_id: currentUserId,
        order_id: orderId,
        payment_date: new Date().toISOString(),
        amount: amount,
        payment_method: 'cash',
        status: 'pending'
      };

      console.log('Sending payment data:', paymentData);

      const response = await paymentService.createCashPayment(paymentData);
      
      console.log('Payment response:', response);
      
      if (response.status === 'success') {
        toast({
          title: "Pembayaran Tunai Terdaftar",
          description: "Silakan lakukan pembayaran kepada staff kami",
        });
        navigate({ to: '/landing/customer-orders' });
      }
    } catch (error: any) { 
      console.error('Error creating cash payment:', error);
      
      let errorMessage = "Gagal mendaftarkan pembayaran tunai";
      if (error?.response?.data) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "Silakan login terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (paymentType === 'cash') {
      return createCashPayment();
    }

    try {
      await loadMidtransScript();
      
      const paymentData = {
        user_id: currentUserId,
        order_id: orderId,
        payment_date: new Date().toISOString(),
        payment_method: paymentType,
        amount: amount,
        status: 'pending'
      };
      
      const response = await midtransService.createPayment(paymentData);
      
      const token = response?.data?.token;
      if (!token) {
        throw new Error("Token Midtrans tidak ditemukan dalam response");
      }

      if (!(window as any).snap) {
        throw new Error("Snap belum terload dengan benar");
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const snap = (window as any).snap;
      snap.pay(token, {
        onSuccess: async (result: any) => {
          console.log("Payment success:", result);
          
          try {
            const statusResponse = await midtransService.checkPaymentStatus(orderId);
            
            if (statusResponse.data.payment_status === 'paid') {
              await orderService.updateStatus(orderId, 'processing');

              toast({
                title: "Pembayaran Berhasil",
                description: "Pesanan Anda sedang diproses",
              });
              navigate({ to: '/landing/customer-orders' });
            } else {
              toast({
                title: "Status Pembayaran",
                description: "Pembayaran sedang diproses, silakan refresh halaman dalam beberapa saat",
              });
            }
          } catch (error: any) {
            toast({
              title: "Error",
              description: "Terjadi kesalahan saat memproses status pembayaran",
              variant: "destructive",
            });
          }
        },
        onPending: (result: any) => {
          console.log('Pending:', result);
          toast({
            title: "Pembayaran Pending",
            description: "Silakan selesaikan pembayaran Anda",
          });
        },
        onError: (error: any) => {
          console.log('Error:', error);
          toast({
            title: "Pembayaran Gagal",
            description: "Terjadi kesalahan saat memproses pembayaran",
            variant: "destructive",
          });
        },
        onClose: () => {
          toast({
            title: "Pembayaran Dibatalkan",
            description: "Anda menutup halaman pembayaran",
          });
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memulai pembayaran",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center bg-pink-50 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <CreditCard className="h-5 w-5 text-pink-600" />
        <span className="font-medium">Lakukan Pembayaran Sekarang</span>
      </div>
      <Button 
        onClick={handlePayment}
        className="bg-pink-600 hover:bg-pink-700"
      >
        {`Bayar ${new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(amount)}`}
      </Button>
    </div>
  );
};

export default PaymentButton;