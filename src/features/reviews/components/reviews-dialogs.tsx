import { useReview } from '../context/reviews-context'
import { ReviewsDeleteDialog } from './reviews-delete-dialog'
import { ReviewReplyDialog } from './reviews-reply-dialog'
import { ReviewsEditDialog } from './reviews-edit-dialog'
import { ReviewDetailDialog } from './review-detail-dialog'

interface ReviewDialogsProps {
  onSuccess?: () => void  
}

export function ReviewDialogs({ onSuccess }: ReviewDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useReview()
  
  const handleCloseDialog = (dialogType: any) => {
    setOpen(dialogType)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }

  return (
    <>
      {currentRow && (
        <>
          <ReviewDetailDialog
            key={`review-detail-${currentRow.id}`}
            open={open === 'detail'}
            onOpenChange={() => handleCloseDialog('detail')}
            currentRow={currentRow}
          />

          <ReviewReplyDialog
            key={`review-reply-${currentRow.id}`}
            open={open === 'reply'}
            onOpenChange={() => handleCloseDialog('reply')}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />

          <ReviewsEditDialog
            key={`review-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => handleCloseDialog('edit')}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />

          <ReviewsDeleteDialog
            key={`review-delete-${currentRow.id}`}
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