import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Review } from '../data/schema'

type ReviewDialogType = 'reply' | 'detail' | 'edit' | 'delete'

interface CategoryContextType {
  open: ReviewDialogType | null
  setOpen: (str: ReviewDialogType | null) => void
  currentRow: Review | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Review | null>>
}

const ReviewContext = React.createContext<CategoryContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CategoryProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ReviewDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Review | null>(null)

  return (
    <ReviewContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ReviewContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useReview = () => {
  const reviewContext = React.useContext(ReviewContext)

  if (!reviewContext) {
    throw new Error('useReview has to be used within <ReviewContext>')
  }

  return reviewContext
}
