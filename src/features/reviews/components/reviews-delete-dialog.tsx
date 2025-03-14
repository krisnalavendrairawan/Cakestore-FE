import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Review } from '../data/schema'
import { reviewService } from '@/services/api'

interface ReviewDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Review | null
  onSuccess?: () => void
}

export function ReviewsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: ReviewDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!currentRow?.id) return

    try {
      setIsDeleting(true)
      await reviewService.deleteReview(currentRow.id)

      toast({
        title: "Success",
        description: "Review has been deleted successfully",
      })

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete review. Please try again later.",
      })
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Review</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Review to be deleted:</p>
            <p className="mt-1 text-sm">{currentRow?.review_text}</p>
            <div className="mt-2 text-sm text-muted-foreground">
              Product: {currentRow?.product?.name}
              <br />
              Rating: {currentRow?.rating} stars
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}