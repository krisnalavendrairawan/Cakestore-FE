import { Order } from "@/services/interface";
import { Clock, Package, CheckCircle} from 'lucide-react';
import React from "react";
import { IconTruckDelivery } from '@tabler/icons-react';


export const formatToRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

 export const getStatusColor = (status: Order['payment_status']) => {
    const statusColors = {
      unpaid: 'bg-red-500',
      partially_paid: 'bg-yellow-500',
      paid: 'bg-green-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

export  const getOrderStatusColor = (status: Order['status']) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped: 'bg-pink-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

 export const renderOrderTimeline = (status: Order['status']) => {
    const steps = [
      { status: 'pending', icon: Clock, label: 'Menunggu Pembayaran' },
      { status: 'processing', icon: Package, label: 'Pesanan Diproses' },
      { status: 'shipped', icon: IconTruckDelivery, label: 'Pesanan Sedang Dikirim' },
      { status: 'completed', icon: CheckCircle, label: 'Pesanan Selesai' }
    ];

    const currentStepIndex = steps.findIndex(step => step.status === status);

    return (
      <div className="flex items-center justify-between w-full mt-6 mb-8">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isActive = index <= currentStepIndex && status !== 'cancelled';
          const isCurrentStep = index === currentStepIndex;

          return (
            <React.Fragment key={step.status}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-500'
                } ${isCurrentStep ? 'ring-4 ring-pink-100' : ''}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className={`text-sm mt-2 ${
                  isActive ? 'text-pink-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  index < currentStepIndex ? 'bg-pink-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };