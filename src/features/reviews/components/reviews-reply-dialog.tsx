import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { Review } from '../data/schema'
import { reviewService } from '@/services/api'

interface ReviewReplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Review | null
  onSuccess?: () => void
}

export function ReviewReplyDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: ReviewReplyDialogProps) {
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async () => {
  if (!replyText.trim()) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Reply text is required",
    })
    return
  }

  try {
    setIsSubmitting(true)
    
    // Use the review service instead of fetch
    await reviewService.addReply(currentRow?.id as number, replyText);

    toast({
      title: "Success",
      description: "Reply submitted successfully",
    })

    onOpenChange(false)
    setReplyText('')
    if (onSuccess) onSuccess()
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to submit reply",
    })
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
          <DialogDescription>
            Reply to customer review for {currentRow?.product?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Customer Review:</p>
              <p className="mt-1 text-sm">{currentRow?.review_text}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Rating: {currentRow?.rating} stars
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Textarea
              id="reply"
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}