import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Review } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import StarRating from './star-rating'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { formatDateIndonesian } from '../utils/helper'
import { ratingOptions } from '../data/data'

export const columns: ColumnDef<Review>[] = [
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
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
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
    accessorKey: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const { user } = row.original;
      return <div>{user?.name || `Customer ${row.original.user_id}`}</div>;
    },
    meta: { className: 'w-36' },
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
    cell: ({ row }) => {
      const { product } = row.original
      return <div>{product.name}</div>
    },
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'review_text',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Review' />
    ),
    cell: ({ row }) => <div>{row.getValue('review_text')}</div>,
    enableSorting: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <DataTableColumnHeader column={column} title='Rating' />
        <DataTableFacetedFilter
          column={column}
          title="Rating"
          options={ratingOptions}
        />
      </div>
    ),
    cell: ({ row }) => <StarRating rating={row.getValue('rating')} />,
    enableSorting: true,
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as number | string; // Pastikan tipe data
      return value.includes(cellValue.toString());
    },

  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Review' />
    ),
    cell: ({ row }) => {
      return formatDateIndonesian(row.getValue('created_at'))
    },
    enableSorting: true,
    enableGlobalFilter: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = new Date(rowA.getValue(columnId))
      const b = new Date(rowB.getValue(columnId))
      return a.getTime() - b.getTime()
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]