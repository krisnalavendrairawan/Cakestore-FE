import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/category-columns'
import { CategoryDialogs } from './components/category-dialogs'
import { CategoryPrimaryButtons } from './components/category-primary-buttons'
import { CategoryTable } from './components/category-table'
import CategoryProvider from './context/category-context'
import { Category } from './data/schema'
import { useState, useEffect, useCallback } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { categoryService } from '@/services/api'

export default function Categories() {
  const [category, setCategory] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await categoryService.getCategory()
      setCategory(data)
      console.log(data)
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
    <CategoryProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Category List</h2>
            <p className='text-muted-foreground'>
              Manage your categories here.
            </p>
          </div>
          <CategoryPrimaryButtons />
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
            <CategoryTable data={category} columns={columns} />
          )}
        </div>
      </Main>

      <CategoryDialogs onSuccess={fetchUsers} />
    </CategoryProvider>
  )
}