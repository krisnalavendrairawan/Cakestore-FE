import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { OrdersDialogs } from './components/orders-dialogs'
import { OrdersPrimaryButtons } from './components/orders-primary-buttons'
import OrdersProvider from './context/orders-context'
import { useEffect, useState } from 'react'
import { orderService } from '@/services/api'
import { Order } from './data/schema'
import { toast } from '@/hooks/use-toast'


export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders()
        setOrders(response)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch orders. Please try again later.',
          variant: 'destructive',
        })
        setLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  return (
    <OrdersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your orders!
            </p>
          </div>
          <OrdersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable data={orders} columns={columns} />
          )}
        </div>
      </Main>

      <OrdersDialogs />
    </OrdersProvider>
  )
}