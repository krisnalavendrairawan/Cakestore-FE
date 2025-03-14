import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/dialog/confirm-dialog'
import { usePayment } from '../context/payments-context'
import { PaymentsImportDialog } from './payments-import-dialog'
import { PaymentsMutateDrawer } from './payments-mutate-drawer'
import { PaymentDetailDialog } from './payments-detail-dialogs'

export function PaymentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePayment()
  return (
    <>
      <PaymentsMutateDrawer
        key='payment-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <PaymentsImportDialog
        key='payments-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          {/* Detail Dialog */}
          <PaymentDetailDialog
            key={`payment-detail-${currentRow.id}`}
            open={open === 'detail'}
            onOpenChange={() => {
              setOpen('detail')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            payment={currentRow}
          />

          <PaymentsMutateDrawer
            key={`payment-update-${currentRow.id}`}
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
            key='payment-delete'
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
                title: 'The following payment has been deleted:',
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
            title={`Delete this payment: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a payment with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}