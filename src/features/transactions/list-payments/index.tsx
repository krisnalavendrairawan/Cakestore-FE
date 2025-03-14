import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { PaymentsDialogs } from './components/payments-dialogs'
import { PaymentsPrimaryButtons } from './components/payments-primary-buttons'
import PaymentsProvider from './context/payments-context'
import { useEffect, useState } from 'react'
import { paymentService } from '@/services/api'
import { Payment } from './data/schema'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/authStore'


export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  // Add to the top of your Payments component
useEffect(() => {
  const staffToken = useAuthStore.getState().auth.staff.accessToken;
  console.log("Current staff token:", staffToken);
  
  // Check Authorization header in a sample request
  const checkAuth = async () => {
    try {
      const headers = { Authorization: `Bearer ${staffToken}` };
      console.log("Using headers:", headers);
    } catch (error) {
      console.error("Token check error:", error);
    }
  };
  
  checkAuth();
}, []);
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await paymentService.getPayments()
        setPayments(response)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch payments:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch payments. Please try again later.',
          variant: 'destructive',
        })
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  return (
    <PaymentsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Payments</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your payments!
            </p>
          </div>
          <PaymentsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable data={payments} columns={columns} />
          )}
        </div>
      </Main>

      <PaymentsDialogs />
    </PaymentsProvider>
  )
}