import { Link, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import { Auth } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { getStaffProfileImageUrl } from '@/utils/fileUpload'

export function ProfileDropdown() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const user = useAuthStore((state) => state.auth.staff.user)
  const resetStaffAuth = useAuthStore((state) => state.auth.staff.reset)

  const handleLogout = async () => {
    try {
      await Auth.Logout()
      resetStaffAuth()
      toast({
        title: "Logout Berhasil",
        description: "Anda telah berhasil keluar dari sistem",
      })
      
      navigate({ to: '/sign-in' })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        resetStaffAuth()
        navigate({ to: '/sign-in' })
        toast({
          title: "Session Expired",
          description: "Sesi Anda telah berakhir. Silakan login kembali.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Gagal Logout",
          description: "Terjadi kesalahan saat mencoba keluar dari sistem",
        })
      }
      console.error('Logout error:', error)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarImage 
            src={user.image ? getStaffProfileImageUrl(user.image) : undefined} 
            alt={user.name} 
          />
          <AvatarFallback>
            {user.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/profile'>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/change-password'>
              Change Password
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown