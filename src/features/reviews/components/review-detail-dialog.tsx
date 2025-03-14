import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Review } from '../data/schema'
import { format } from 'date-fns'

interface ReviewDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Review | null
}

export function ReviewDetailDialog({
  open,
  onOpenChange,
  currentRow,
}: ReviewDetailDialogProps) {
  if (!currentRow) return null

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy HH:mm')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Review Detail</DialogTitle>
          <DialogDescription>
            Review for {currentRow.product?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            {/* Customer Information */}
            <div className="rounded-lg bg-muted p-4">
              <h4 className="text-sm font-semibold mb-2">Customer Information</h4>
              <p className="text-sm">Name: {currentRow.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                Review Date: {formatDate(currentRow.created_at)}
              </p>
            </div>

            {/* Review Content */}
            <div className="rounded-lg bg-muted p-4">
              <h4 className="text-sm font-semibold mb-2">Review</h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Rating:</span>
                <span className="text-sm">{currentRow.rating} stars</span>
              </div>
              <p className="text-sm">{currentRow.review_text}</p>
            </div>

            {/* Reply Content - Only show if there's a reply */}
            {currentRow.reply && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="text-sm font-semibold mb-2">Admin Reply</h4>
                <p className="text-sm">{currentRow.reply}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Reply Date: {currentRow.reply_date ? formatDate(currentRow.reply_date) : 'N/A'}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}