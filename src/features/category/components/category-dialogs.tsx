import { useCategory } from '../context/category-context'
import { CategoryActionDialog } from './category-action-dialog'
import { CategoryDeleteDialog } from './category-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'

interface CategoryDialogsProps {
  onSuccess?: () => void  
}

export function CategoryDialogs({ onSuccess }: CategoryDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useCategory()
  
  const handleCloseDialog = (dialogType: string) => {
    setOpen(dialogType)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }

  return (
    <>
      <CategoryActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        onSuccess={onSuccess}
      />

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <CategoryActionDialog
            key={`category-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => handleCloseDialog('edit')}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />

          <CategoryDeleteDialog
            key={`category-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => handleCloseDialog('delete')}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />
        </>
      )}
    </>
  )
}