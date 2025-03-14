import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { paymentStatuses, paymentMethods } from '../data/data'
import { Payment } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { formatDate, formatTime, formatRupiah } from '../../helpers/helpers'
import { format } from 'path'


export const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.user?.name ?? `User ${row.user_id}`,
    id: 'customer_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Customer' />
    ),
    cell: ({ row }) => <div>{row.getValue('customer_name')}</div>,
  },
  {
    accessorFn: (row) => row.order?.order_number ?? `User ${row.order?.order_number}`,
    id: 'order_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order Number' />
    ),
    cell: ({ row }) => <div>{row.getValue('order_number')}</div>,
  },
  {
    accessorKey: 'payment_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Pembayaran' />
    ),
    cell: ({ row }) => {
      const paymentDate: string = row.getValue('payment_date');
      return paymentDate ? formatDate(paymentDate) : 'Belum Membayar';
    }
  },
  {
    accessorKey: 'payment_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pukul' />
    ),
    cell: ({ row }) => {
      const paymentDate: string = row.getValue('payment_date');
    return paymentDate ? formatTime(paymentDate) : 'Belum Membayar';
    }
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah' />
    ),
    cell: ({ row }) => (
      <div>
        {formatRupiah(row.getValue('amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'payment_method',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Metode Pembayaran' />
    ),
    cell: ({ row }) => {
      const method = paymentMethods.find(
        (method) => method.value === row.getValue('payment_method')
      )

      if (!method) {
        return <div>{row.getValue('payment_method')}</div>
      }

      return (
        <div className='flex w-[150px] items-center'>
          {method.icon && (
            <method.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span>{method.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = paymentStatuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]