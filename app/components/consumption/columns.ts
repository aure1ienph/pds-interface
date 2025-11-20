// Components
import TagBadge from '../TagBadge.vue'
import { ArrowUpDown } from 'lucide-vue-next'

// Types
import type { pdsData } from '../../../shared/types/pdsData'
import type { ColumnDef } from '@tanstack/vue-table'

// Utils
import { isDateOlderThanOneWeek } from '@/utils/isDateOlderThanOneWeek'
import { formatDate } from '@/utils/formatDate'
import { toRaw } from 'vue'

export const columns: ColumnDef<pdsData>[] = [
  {
    id: 'name_or_pds',
    accessorFn: (row) => `${row.building?.name ?? ''} ${row.consumption?.pds ?? ''}`.toLowerCase(),
    enableHiding: true,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      const searchValue = String(filterValue).toLowerCase().trim()
      if (!searchValue) return true
      const name = String(row.original.building?.name ?? '').toLowerCase().trim()
      const pds = String(row.original.consumption?.pds ?? '').toLowerCase().trim()
      return name.includes(searchValue) || pds.includes(searchValue)
    },
  },
  {
    id: 'warning_row',
    accessorFn: (row) => row.consumption?.last_index_date ?? '',
    enableHiding: true,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true
      
      const lastIndexDate = row.original.consumption?.last_index_date
      const lastQminDate = row.original.consumption?.last_qmin_date
      
      return isDateOlderThanOneWeek(lastIndexDate) || isDateOlderThanOneWeek(lastQminDate)
    },
  },
  {
    id: 'name',
    accessorFn: (row) => row.building.name,
    header: () => h('div', { class: 'text-start truncate' }, 'Immeuble'),
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const name = rawData.building?.name ?? ''
      return h('div', { class: 'text-start truncate' }, name)
    },
  },
  {
    id: 'pds',
    accessorFn: (row) => row.consumption?.pds ?? '',
    header: () => h('div', { class: 'text-start truncate' }, 'Numéro de compteur'),
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const pds = rawData.consumption?.pds ?? ''
      return h('div', { class: 'text-start truncate ' }, pds)
    },
  },
  {
    id: 'number_of_lofts',
    accessorFn: (row) => row.building.number_of_lofts,
    header: () => h('div', { class: 'text-start truncate' }, 'Nombre de lots'),
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const number_of_lofts = rawData.building?.number_of_lofts ?? ''
      return h('div', { class: 'text-start' }, number_of_lofts)
    },
  },
  {
    id: 'last_index_date',
    accessorFn: (row) => row.consumption.last_index_date,
    header: () => h('div', { class: 'text-start truncate' }, 'Index : Date dernière mesure'),
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const last_index_date = rawData.consumption?.last_index_date
      const formattedDate = formatDate(last_index_date)
      const isOld = isDateOlderThanOneWeek(last_index_date)
      return h('div', { 
        class: isOld ? 'text-start text-red-500' : 'text-start' 
      }, formattedDate)
    },
  },
  {
    id: 'last_index',
    accessorFn: (row) => row.consumption.last_index,
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Index : dernière mesure'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const last_index = rawData.consumption?.last_index
      return h('div', { class: 'text-start' }, last_index ?? '')
    },
  },
  {
    id: 'index_j1',
    accessorFn: (row) => {
      if (row.consumption.index_daily_differential) {
        return row.consumption.last_index - row.consumption.index_daily_differential
      }
      return null
    },
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Index: différentiel J-1'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      let index_j1 = null
      if (rawData.consumption?.index_daily_differential != null && rawData.consumption?.last_index != null) {
        index_j1 = (rawData.consumption.last_index - rawData.consumption.index_daily_differential).toFixed(2)
      }
      return h('div', 
        { 
          class: index_j1 && Number(index_j1) > 50 ? 'text-start text-red-500' :
          index_j1 && Number(index_j1) < -50 ? 'text-start text-green-500' :
          'text-start'
        }, index_j1 ?? '')
    },
  },
  {
    id: 'index_j1_by_loft',
    accessorFn: (row) => {
      if (row.consumption.index_daily_differential && row.building.number_of_lofts > 0) {
        return (row.consumption.last_index - row.consumption.index_daily_differential) / row.building.number_of_lofts
      }
      return null
    },
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Index: différentiel J-1 par lot'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      let index_j1 = null
      if (rawData.consumption?.index_daily_differential != null && rawData.consumption?.last_index != null && rawData.building?.number_of_lofts > 0) {
        index_j1 = ((rawData.consumption.last_index - rawData.consumption.index_daily_differential) / rawData.building.number_of_lofts).toFixed(2)
      }
      return h('div', 
        { 
          class: index_j1 && Number(index_j1) > 50 ? 'text-start text-red-500' :
          index_j1 && Number(index_j1) < -50 ? 'text-start text-green-500' :
          'text-start'
        }, index_j1 ?? '')
    },
  },
  {
    id: 'index_j7',
    accessorFn: (row) => {
      if (row.consumption.index_weekly_differential) {
        return row.consumption.last_index - row.consumption.index_weekly_differential
      }
      return null
    },
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Index: différentiel J-7'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      let index_j7 = null
      if (rawData.consumption?.index_weekly_differential != null && rawData.consumption?.last_index != null) {
        index_j7 = (rawData.consumption.last_index - rawData.consumption.index_weekly_differential).toFixed(2)
      }
      return h('div', 
        { 
          class: index_j7 && Number(index_j7) >= 50 ? 'text-start text-red-500' :
          index_j7 && Number(index_j7) <= -50 ? 'text-start text-green-500' :
          'text-start'
        }, index_j7 ?? '')
    },
  },
  {
    id: 'index_j7_by_loft',
    accessorFn: (row) => {
      if (row.consumption.index_weekly_differential && row.building.number_of_lofts > 0) {
        return (row.consumption.last_index - row.consumption.index_weekly_differential) / row.building.number_of_lofts
      }
      return null
    },
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Index: différentiel J-7 par lot'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      let index_j7 = null
      if (rawData.consumption?.index_weekly_differential != null && rawData.consumption?.last_index != null && rawData.building?.number_of_lofts > 0) {
        index_j7 = ((rawData.consumption.last_index - rawData.consumption.index_weekly_differential) / rawData.building.number_of_lofts).toFixed(2)
      }
      return h('div', 
        { 
          class: index_j7 && Number(index_j7) >= 50 ? 'text-start text-red-500' :
          index_j7 && Number(index_j7) <= -50 ? 'text-start text-green-500' :
          'text-start'
        }, index_j7 ?? '')
    },
  },
  {
    id: 'last_qmin_date',
    accessorFn: (row) => row.consumption.last_qmin_date,
    header: () => h('div', { class: 'text-start truncate' }, 'Qmin : Date dernière mesure'),
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const last_qmin_date = rawData.consumption?.last_qmin_date
      const formattedDate = formatDate(last_qmin_date)
      const isOld = isDateOlderThanOneWeek(last_qmin_date)
      return h('div', { 
        class: isOld ? 'text-start text-red-500' : 'text-start' 
      }, formattedDate)
    },
  },
  {
    id: 'last_qmin',
    accessorFn: (row) => row.consumption.last_qmin,
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Qmin : dernière mesure'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const last_qmin = rawData.consumption?.last_qmin
      return h('div', { class: 'text-start' }, last_qmin ?? '')
    },
  },
  {
    id: 'qmin_j1',
    accessorFn: (row) => {
      if (row.consumption.qmin_daily_differential) {
        return row.consumption.last_qmin - row.consumption.qmin_daily_differential
      }
      return null
    },
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Qmin: différentiel J-1'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      let qmin_j1 = null
      if (rawData.consumption?.qmin_daily_differential != null && rawData.consumption?.last_qmin != null) {
        qmin_j1 = (rawData.consumption.last_qmin - rawData.consumption.qmin_daily_differential).toFixed(2)
      }
    return h('div', 
      { 
        class: qmin_j1 && Number(qmin_j1) >= 50 ? 'text-start text-red-500' :
        qmin_j1 && Number(qmin_j1) <= -50 ? 'text-start text-green-500' :
        'text-start'
      }, qmin_j1 ?? '')
    },
  },
  {
    id: 'qmin_j7',
    accessorFn: (row) => {
      if (row.consumption.qmin_weekly_differential) {
        return row.consumption.last_qmin - row.consumption.qmin_weekly_differential
      }
      return null
    },
    header: ({ column }) => {
      return h('div', {
        onClick: () => column.toggleSorting(),
        class: 'text-start truncate cursor-pointer flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:outline-1 hover:outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 transition-all duration-200 ease-in-out px-2 py-0.5 rounded-full'
      }, [
        h('span', { class: 'text-start truncate' }, 'Qmin: différentiel J-7'),
        h(ArrowUpDown, { class: 'size-3.5 shrink-0' })
      ])
    },
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      let qmin_j7 = null
      if (rawData.consumption?.qmin_weekly_differential != null && rawData.consumption?.last_qmin != null) {
        qmin_j7 = (rawData.consumption.last_qmin - rawData.consumption.qmin_weekly_differential).toFixed(2)
      }
    return h('div', 
      { 
        class: qmin_j7 && Number(qmin_j7) >= 50 ? 'text-start text-red-500' :
        qmin_j7 && Number(qmin_j7) <= -50 ? 'text-start text-green-500' :
        'text-start'
      }, qmin_j7 ?? '')
    },
  },
  {
    id: 'missions_status',
    accessorFn: (row) => row.building.missions_status,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === '' || filterValue === 'all') return true
      
      const missions_status = row.original.building?.missions_status
      if (!missions_status || !Array.isArray(missions_status)) {
        return false
      }
      
      return missions_status.includes(filterValue)
    },
    header: () => h('div', { class: 'text-start truncate' }, 'Statut dernière mission'),
    cell: ({ row }) => {
      const rawData = toRaw(row.original)
      const missions_status = rawData.building?.missions_status
      if (!missions_status) {
        return h('div', { class: 'flex gap-2 justify-end' }, '')
      }
      return h('div', { class: 'flex gap-2 justify-end' }, 
        missions_status.map((status: string, index: number) => 
          h(TagBadge, { key: `${row.id}-${status}-${index}`, field: 'missions_status', value: status })
        )
      )
    },
  },
]