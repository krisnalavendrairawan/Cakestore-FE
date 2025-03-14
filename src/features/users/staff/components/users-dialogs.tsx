import { useUsers } from '../context/users-context'
import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'

interface UsersDialogsProps {
  onSuccess?: () => void
}

export function UsersDialogs({ onSuccess }: UsersDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  
  const handleCloseDialog = (dialogType: string) => {
    setOpen(dialogType)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }

  return (
    <>
      <UsersActionDialog
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
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => handleCloseDialog('edit')}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
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