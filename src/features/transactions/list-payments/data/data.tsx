// data.ts
import {
  IconCreditCard,
  IconCash,
  IconLoader,
  IconCheck,
  IconX,
} from '@tabler/icons-react'

export const paymentStatuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: IconLoader,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: IconCheck,
  },
  {
    value: 'failed',
    label: 'Failed',
    icon: IconX,
  },
]

export const paymentMethods = [
  {
    value: 'cash',
    label: 'Cash',
    icon: IconCash,
  },
  {
    value: 'transfer',
    label: 'Transfer',
    icon: IconCreditCard,
  },
  {
    value: 'credit_card',
    label: 'Credit Card',
    icon: IconCreditCard,
  },
  {
    value: 'debit_card',
    label: 'Debit Card',
    icon: IconCreditCard,
  },
  {
    value: 'digital_wallet',
    label: 'Digital Wallet',
    icon: IconCreditCard,
  },
]

export const labels = [
  {
    value: 'label1',
    label: 'Label 1',
  },
  {
    value: 'label2',
    label: 'Label 2',
  },
  {
    value: 'label3',
    label: 'Label 3',
  },
  {
    value: 'label4',
    label: 'Label 4',
  },
  {
    value: 'label5',
    label: 'Label 5',
  },
]