import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Category } from '../data/schema'

type CategoryDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface CategoryContextType {
  open: CategoryDialogType | null
  setOpen: (str: CategoryDialogType | null) => void
  currentRow: Category | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>
}

const CategoryContext = React.createContext<CategoryContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CategoryProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CategoryDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Category | null>(null)

  return (
    <CategoryContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoryContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategory = () => {
  const categoryContext = React.useContext(CategoryContext)

  if (!categoryContext) {
    throw new Error('useCategory has to be used within <CategoryContext>')
  }

  return categoryContext
}
