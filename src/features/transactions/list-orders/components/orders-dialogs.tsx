import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/dialog/confirm-dialog'
import { useOrder } from '../context/orders-context'
import { OrdersImportDialog } from './orders-import-dialog'
import { OrdersMutateDrawer } from './orders-mutate-drawer'

export function OrdersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, handlePayment  } = useOrder()
  return (
    <>
      <OrdersMutateDrawer
        key='order-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <OrdersImportDialog
        key='orders-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <OrdersMutateDrawer
            key={`order-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='order-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              toast({
                title: 'The following order has been deleted:',
                description: (
                  <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                      {JSON.stringify(currentRow, null, 2)}
                    </code>
                  </pre>
                ),
              })
            }}
            className='max-w-md'
            title={`Delete this order: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a order with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />

          <AlertDialog open={open === 'pay'} onOpenChange={(isOpen) => {
        if (!isOpen) setOpen(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process this payment? This will mark the order as completed and payment status as paid.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (currentRow) {
                  handlePayment(currentRow.id);
                }
              }}
            >
              Yes, Process Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </>
      )}
    </>
  )
}
