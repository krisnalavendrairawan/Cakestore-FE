import {
  IconUser,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'

export const userTypes = [

  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield,
  },
  {
    label: 'Staff',
    value: 'staff',
    icon: IconUsersGroup,
  },
  {
    label: 'Customer',
    value: 'customer',
    icon:  IconUser,
  },
] as const
