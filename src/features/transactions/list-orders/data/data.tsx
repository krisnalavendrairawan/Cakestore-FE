
import {
  IconCreditCard,
  IconCash,
  IconClock,
  IconCheck,
  IconX,
  IconLoader,
} from '@tabler/icons-react'

export const orderStatuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: IconClock,
  },
  {
    value: 'processing',
    label: 'Processing',
    icon: IconLoader,
  },
  {
    value: 'shipped',
    label: 'Shipped',
    icon: IconCheck,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: IconCheck,
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    icon: IconX,
  },
]

export const paymentStatuses = [
  {
    value: 'unpaid',
    label: 'Belum Bayar',
    icon: IconX,
  },
  // {
  //   value: 'partially_paid',
  //   label: 'Partially Paid',
  //   icon: IconCreditCard,
  // },
  {
    value: 'paid',
    label: 'Sudah Bayar',
    icon: IconCash,
  },
]