import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { orderStatuses, paymentStatuses } from '../data/data'
import { Order } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { formatDate, formatTime, formatRupiah } from '../../helpers/helpers'

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: 'order_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor Order' />
    ),
    cell: ({ row }) => <div>{row.getValue('order_number')}</div>,
  },
  {
    accessorKey: 'order_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Order' />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue('order_date'))}</div>,
  },
  {
    accessorKey: 'order_date',
    id: 'order_time', // Use a unique ID since we're reusing the same accessorKey
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pukul' />
    ),
    cell: ({ row }) => <div>{formatTime(row.getValue('order_date'))}</div>,
  },
  {
    accessorKey: 'total_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Harga' />
    ),
    cell: ({ row }) => (
      <div>
        {formatRupiah(row.getValue('total_price'))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = orderStatuses.find(
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
    accessorKey: 'payment_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status Pembayaran' />
    ),
    cell: ({ row }) => {
      const paymentStatus = paymentStatuses.find(
        (status) => status.value === row.getValue('payment_status')
      )

      if (!paymentStatus) {
        return null
      }

      return (
        <div className='flex items-center'>
          {paymentStatus.icon && (
            <paymentStatus.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span>{paymentStatus.label}</span>
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