import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '../../../shared/types/user'
import { h } from 'vue'
import DropdownAction from './DataTableDropdown.vue'
import DataTableRoleSelect from './DataTableRoleSelect.vue'

export const columns = (
  refreshUsers?: () => void,
  currentUserRole?: string
): ColumnDef<User>[] => [
  {
    accessorKey: 'profil_picture',
    cell: ({ row }) => {
      return h('div', { class: 'w-8 h-8 hidden sm:flex items-center justify-center relative' }, [
        h('div', {
          class:
            'absolute inset-0 rounded-full bg-gradient-to-r from-30% from-indigo-500 to-blue-400 rotate-45',
        }),
        h('span', { class: 'relative text-sm font-medium text-white' }, row.original.first_name.charAt(0)),
      ])
    },
  },
  {
    accessorKey: 'user',
    cell: ({ row }) => {
      const firstName = row.original.first_name
      const lastName = row.original.last_name
      const email = row.original.email.toLowerCase()
      
      return h('div', { class: '' }, [
        h('div', { class: 'flex items-center gap-1 truncate' }, [
          h('span', { class: 'text-sm font-medium w-fit truncate' }, firstName),
          h('span', { class: 'text-sm font-medium truncate' }, lastName)
        ]),
        h('div', { class: 'text-sm text-gray-500 truncate' }, email)
      ])
    },
  },
  {
    accessorKey: 'access',
    cell: ({ row }) => {
      const access = row.getValue('access') as string
      const userId = row.original.id
      return h(DataTableRoleSelect, {
        access,
        userId,
        refreshUsers
      })
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const showActions = currentUserRole === 'admin'
      
      if (showActions) {
        return h('div', { class: 'relative' }, h(DropdownAction, {
          user: { id: row.original.id, access: row.original.access },
          refreshUsers,
        }))
      } else { 
        return h('div')
      }
    },
  },
]