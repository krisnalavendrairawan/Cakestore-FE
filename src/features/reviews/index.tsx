import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/reviews-columns'
import { ReviewDialogs } from './components/reviews-dialogs'
import { ReviewTable } from './components/reviews-table'
import ReviewProvider from './context/reviews-context'
import { Review } from './data/schema'
import { useState, useEffect, useCallback } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { reviewService } from '@/services/api'


export default function Reviews() {
  const [review, setReview] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

const fetchUsers = useCallback(async () => {
  try {
    setIsLoading(true)
    // Change this line
    const response = await reviewService.getAllReviews()
    setReview(response.data)
    setError(null)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred while fetching users')
    console.error('Error fetching users:', err)
  } finally {
    setIsLoading(false)
  }
}, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <ReviewProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Review List</h2>
            <p className='text-muted-foreground'>
              Manage your reviews here.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <ReviewTable data={review} columns={columns} />
          )}
        </div>
      </Main>

      <ReviewDialogs onSuccess={fetchUsers} />
    </ReviewProvider>
  )
}