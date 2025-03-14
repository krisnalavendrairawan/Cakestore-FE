import {
  IconBrowserCheck,
  IconHelp,
  IconLayoutDashboard,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconProgressAlert,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
  IconUserShield,
  IconShovelPitchforks,
  IconCategory,
  IconShoppingBag,
  IconReceiptDollar,
  IconListDetails,
  IconShoppingCartStar
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },

        {
          title: 'Users',
          icon: IconUsers,
          items: [
            {
              title: 'Staff',
              url: '/users/staff',
              icon: IconUserCog,
            },
            {
              title: 'Customer',
              url: '/users/customer',
              icon: IconUserShield,
            },
          ],
        },

        {
          title: 'Category',
          url: '/category',
          icon: IconCategory,
        },
        {
          title: 'Products',
          url: '/products',
          icon: IconShovelPitchforks,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },        
      ],
    },
    {
      title: 'Transactions',
      items: [
        {
          title: 'Transactions',
          icon: IconLockAccess,
          items: [
            {
              title: 'Manual Orders',
              url: '/transactions/orders',
              icon: IconShoppingBag ,
            },
            {
              title: 'Processing Orders',
              url: '/transactions/processing-orders',
              icon: IconProgressAlert ,
            },
            {
              title: 'List Pesanan',
              url: '/transactions/list-order',
              icon: IconListDetails,
            },
            {
              title: 'List Pembayaran',
              url: '/transactions/list-payment',
              icon: IconReceiptDollar,
            }
          ],
        },
      ],
    },
        {
      title: 'Reviews',
      items: [
        {
          title: 'Reviews Customer',
          url: '/reviews',
          icon: IconShoppingCartStar,
        },
  
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
