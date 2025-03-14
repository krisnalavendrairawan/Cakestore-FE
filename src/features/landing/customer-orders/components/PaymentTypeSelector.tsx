import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet, QrCode, BanknoteIcon } from 'lucide-react';

interface PaymentTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
const paymentTypes = [
  {
    id: 'bank_transfer',  // Sesuaikan dengan tipe yang diterima Midtrans
    label: 'Transfer Bank',
    description: 'Pembayaran melalui transfer bank (Virtual Account)',
    icon: CreditCard
  },
  {
    id: 'qris',  // Sesuaikan dengan tipe yang diterima Midtrans
    label: 'QRIS',
    description: 'Scan QR code untuk pembayaran instan',
    icon: QrCode
  },
  {
    id: 'gopay',  // Sesuaikan dengan tipe yang diterima Midtrans
    label: 'E-Wallet',
    description: 'GoPay, OVO, DANA, LinkAja, dll',
    icon: Wallet
  },
  {
    id: 'cash',
    label: 'Tunai',
    description: 'Pembayaran tunai langsung ke staff',
    icon: BanknoteIcon
  }
];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Metode Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {paymentTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <div 
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`
                  flex items-start space-x-4 rounded-lg border p-4 
                  cursor-pointer transition-colors
                  ${isSelected ? 'border-pink-600 bg-pink-50' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => onTypeChange(type.id)}
                      className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                    />
                  </div>
                  <Icon className="h-5 w-5 text-pink-600" />
                  <div className="flex-grow">
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTypeSelector;