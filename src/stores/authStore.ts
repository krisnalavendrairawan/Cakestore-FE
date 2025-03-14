import { create } from 'zustand'
import Cookies from 'js-cookie'

// Constants for storage keys
const STAFF_ACCESS_TOKEN = 'staff_access_token'
const STAFF_USER_DATA = 'staff_user_data'
const CUSTOMER_ACCESS_TOKEN = 'customer_access_token'
const CUSTOMER_USER_DATA = 'customer_user_data'

// Type definitions
interface AuthUser {
  id: number
  name: string
  email: string
  roles: string[]
  status: string
  image: string
  phone_number: string
  address: string
  gender: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface AuthState {
  auth: {
    staff: {
      user: AuthUser | null
      setUser: (user: AuthUser | null) => void
      accessToken: string
      setAccessToken: (accessToken: string) => void
      resetAccessToken: () => void
      reset: () => void
    }
    customer: {
      user: AuthUser | null
      setUser: (user: AuthUser | null) => void
      accessToken: string
      setAccessToken: (accessToken: string) => void
      resetAccessToken: () => void
      reset: () => void
    }
  }
}

// Helper functions
const getStoredStaffUser = (): AuthUser | null => {
  try {
    const storedData = localStorage.getItem(STAFF_USER_DATA)
    return storedData ? JSON.parse(storedData) : null
  } catch (error) {
    console.error('Error parsing staff user data:', error)
    return null
  }
}

const getStoredCustomerUser = (): AuthUser | null => {
  try {
    const storedData = localStorage.getItem(CUSTOMER_USER_DATA)
    return storedData ? JSON.parse(storedData) : null
  } catch (error) {
    console.error('Error parsing customer user data:', error)
    return null
  }
}

const getStoredToken = (key: string): string => {
  try {
    const token = Cookies.get(key)
    return token ? JSON.parse(token) : ''
  } catch (error) {
    console.error(`Error parsing token for ${key}:`, error)
    return ''
  }
}

// Create the store
export const useAuthStore = create<AuthState>()((set) => {
  // Initialize state from storage
  const initStaffToken = getStoredToken(STAFF_ACCESS_TOKEN)
  const initCustomerToken = getStoredToken(CUSTOMER_ACCESS_TOKEN)
  const initStaffUser = getStoredStaffUser()
  const initCustomerUser = getStoredCustomerUser()

  return {
    auth: {
      staff: {
        user: initStaffUser,
        setUser: (user) => {
          if (user) {
            const userData: AuthUser = {
              id: user.id,
              name: user.name,
              email: user.email,
              roles: user.roles || [],
              status: user.status,
              image: user.image || '',
              phone_number: user.phone_number || '',
              address: user.address || '',
              gender: user.gender || '',
              created_at: user.created_at,
              updated_at: user.updated_at,
              deleted_at: user.deleted_at
            }
            
            // Store in localStorage
            localStorage.setItem(STAFF_USER_DATA, JSON.stringify(userData))
            
            // Update state
            set((state) => ({
              ...state,
              auth: {
                ...state.auth,
                staff: { ...state.auth.staff, user: userData }
              }
            }))
          } else {
            // Remove from localStorage and clear state
            localStorage.removeItem(STAFF_USER_DATA)
            set((state) => ({
              ...state,
              auth: {
                ...state.auth,
                staff: { ...state.auth.staff, user: null }
              }
            }))
          }
        },
        accessToken: initStaffToken,
        setAccessToken: (accessToken) => {
          // Store in cookies
          Cookies.set(STAFF_ACCESS_TOKEN, JSON.stringify(accessToken))
          
          // Update state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              staff: { ...state.auth.staff, accessToken }
            }
          }))
        },
        resetAccessToken: () => {
          // Remove from cookies
          Cookies.remove(STAFF_ACCESS_TOKEN)
          
          // Update state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              staff: { ...state.auth.staff, accessToken: '' }
            }
          }))
        },
        reset: () => {
          // Clear all staff auth data
          Cookies.remove(STAFF_ACCESS_TOKEN)
          localStorage.removeItem(STAFF_USER_DATA)
          
          // Reset state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              staff: { ...state.auth.staff, user: null, accessToken: '' }
            }
          }))
        }
      },
      customer: {
        user: initCustomerUser,
        setUser: (user) => {
          if (user) {
            const userData: AuthUser = {
              id: user.id,
              name: user.name,
              email: user.email,
              roles: user.roles || [],
              status: user.status,
              image: user.image || '',
              phone_number: user.phone_number || '',
              address: user.address || '',
              gender: user.gender || '',
              created_at: user.created_at,
              updated_at: user.updated_at,
              deleted_at: user.deleted_at
            }
            
            // Store in localStorage
            localStorage.setItem(CUSTOMER_USER_DATA, JSON.stringify(userData))
            
            // Update state
            set((state) => ({
              ...state,
              auth: {
                ...state.auth,
                customer: { ...state.auth.customer, user: userData }
              }
            }))
          } else {
            // Remove from localStorage and clear state
            localStorage.removeItem(CUSTOMER_USER_DATA)
            set((state) => ({
              ...state,
              auth: {
                ...state.auth,
                customer: { ...state.auth.customer, user: null }
              }
            }))
          }
        },
        accessToken: initCustomerToken,
        setAccessToken: (accessToken) => {
          // Store in cookies
          Cookies.set(CUSTOMER_ACCESS_TOKEN, JSON.stringify(accessToken))
          
          // Update state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              customer: { ...state.auth.customer, accessToken }
            }
          }))
        },
        resetAccessToken: () => {
          // Remove from cookies
          Cookies.remove(CUSTOMER_ACCESS_TOKEN)
          
          // Update state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              customer: { ...state.auth.customer, accessToken: '' }
            }
          }))
        },
        reset: () => {
          // Clear all customer auth data
          Cookies.remove(CUSTOMER_ACCESS_TOKEN)
          localStorage.removeItem(CUSTOMER_USER_DATA)
          
          // Reset state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              customer: { ...state.auth.customer, user: null, accessToken: '' }
            }
          }))
        }
      }
    }
  }
})

// Custom hooks for easier access to auth state
export const useAuth = () => {
  const store = useAuthStore()
  return store.auth
}

export const useStaffAuth = () => {
  const store = useAuthStore()
  return store.auth.staff
}

export const useCustomerAuth = () => {
  const store = useAuthStore()
  return store.auth.customer
}