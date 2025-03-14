import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Payment } from '../data/schema'

type PaymentsDialogType = 'detail' | 'create' | 'update' | 'delete' | 'import'

interface PaymentsContextType {
  open: PaymentsDialogType | null
  setOpen: (str: PaymentsDialogType | null) => void
  currentRow: Payment | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Payment | null>>
}

const PaymentsContext = React.createContext<PaymentsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function PaymentsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<PaymentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Payment | null>(null)
  return (
    <PaymentsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PaymentsContext.Provider>
  )
}

export const usePayment = () => {
  const paymentsContext = React.useContext(PaymentsContext)

  if (!paymentsContext) {
    throw new Error('usePayment has to be used within <PaymentsContext>')
  }

  return paymentsContext
}