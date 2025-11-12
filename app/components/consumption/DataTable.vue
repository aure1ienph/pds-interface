<script setup lang="ts" generic="TData, TValue">
// Components
import DataTablePagination from './DataTablePagination.vue'
import DataTableRowSheet from './DataTableRowSheet.vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FlexRender, useVueTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import Input from '@/components/ui/input/Input.vue'
import { Empty, EmptyHeader, EmptyMedia } from '@/components/ui/empty'
import { DropletOff, TriangleAlert } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'

// Types
import type { ColumnDef, ColumnSizingState, ColumnSizingInfoState, SortingState, ColumnFiltersState } from '@tanstack/vue-table'
import type { pdsData } from '../../../shared/types/pdsData'

// Props
const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
}>()

// Reactives states
const columnFilters = ref<ColumnFiltersState>([])
const sorting = ref<SortingState>([{ id: 'index_j7', desc: true }])
const columnSizing = ref<ColumnSizingState>({})
const columnSizingInfo = ref<ColumnSizingInfoState>({} as ColumnSizingInfoState)
const pds = ref<pdsData | null>(null)

// Table
const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnSizingChange: updaterOrValue => valueUpdater(updaterOrValue, columnSizing),
  onColumnSizingInfoChange: updaterOrValue => valueUpdater(updaterOrValue, columnSizingInfo),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  enableColumnResizing: true,
  enableSortingRemoval: false,
  state: {
    get columnSizing() { return columnSizing.value },
    get columnSizingInfo() { return columnSizingInfo.value },
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
  },
  initialState: {
    sorting: [{ id: 'index_j7', desc: true }],
    pagination: {
      pageSize: 20,
    },
    columnVisibility: {
      name_or_pds: false,
      warning_row: false,
    },
  },
  defaultColumn: {
    size: 200,
    minSize: 200,
    maxSize: Number.MAX_SAFE_INTEGER,
  },
  columnResizeMode: 'onChange',
})

const rowModel = computed(() => table.getRowModel())
const rows = computed(() => rowModel.value.rows)
const headerGroups = computed(() => table.getHeaderGroups())
const hasRows = computed(() => rowModel.value.rows.length > 0)

// Row sheet state
const openRowSheet = (row: pdsData) => {
  pds.value = row
}

const isSheetOpen = computed({
  get: () => pds.value !== null,
  set: (open: boolean) => {
    if (!open) pds.value = null
  },
})

// Filter state
const filterValue = ref('')
const showWarningRow = ref(false)

watch(filterValue, (newVal) => {
  // Filtrer sur la colonne virtuelle qui combine name et pds
  table.getColumn('name_or_pds')?.setFilterValue(newVal)
})

const toggleOldIndexDateFilter = () => {
  showWarningRow.value = !showWarningRow.value
  table.getColumn('warning_row')?.setFilterValue(showWarningRow.value ? 'active' : '')
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex-shrink-0 w-full border-b border-zinc-200 dark:border-zinc-800 border-dashed">
      <div class="w-11/12 max-w-7xl mx-auto border-x border-zinc-200 dark:border-zinc-800 border-dashed px-6 py-6 flex max-md:flex-col max-md:items-start max-sm:justify-start items-center justify-between">
        <h1 class="text-black dark:text-white font-bold text-3xl">
          Suivi consommation
        </h1>
        <div class="flex items-center gap-2 py-4 w-full md:max-w-md">
          <Input
            class="h-[30px] text-[13px] rounded-full gap-1.5 px-3 has-[>svg]:px-2.5 flex-1 w-full"
            placeholder="Rechercher par immeuble ou numéro de compteur.."
            v-model="filterValue"
          />

          <HoverCard>
            <HoverCardTrigger>
              <Button
                @click="toggleOldIndexDateFilter"
                :variant="showWarningRow ? 'destructive' : 'outline'"
                size="icon-sm"
                class="h-[30px] text-[13px] border-red-200 dark:border-red-800"
              >
                <TriangleAlert :class="showWarningRow ? 'text-white' : 'text-red-500'" class="size-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent class="text-red-500" align="end">
              Afficher les immeubles dont la date d'index ou de qmin est antérieure à 1 semaine.
            </HoverCardContent>
          </HoverCard>


        </div>
      </div>
    </div>
    <div
      v-if="hasRows && !isLoading"
      class="flex-1 min-h-0 border-x border-zinc-200 dark:border-zinc-800 border-dashed w-11/12 max-w-7xl mx-auto"
    >
      <Table>
        <TableHeader>
          <TableRow 
            v-for="headerGroup in headerGroups" 
            :key="headerGroup.id" 
            class="!border-b border-dashed border-zinc-200 dark:border-zinc-800"
          >
            <TableHead 
              v-for="(header, headerIndex) in headerGroup.headers"
              :key="header.id"
              :style="{ width: `${header.getSize()}px`, left: headerIndex === 0 ? '0px' : '',   zIndex: headerIndex === 0 ? 40 : 20, }"
              :class="[
                'px-4 relative sticky top-0 z-20 bg-zinc-50 dark:bg-zinc-950',
                headerIndex === headerGroup.headers.length - 1 ? 'pr-6' : 'border-r border-dashed border-zinc-200 dark:border-zinc-800',

              ]"
            >
              <FlexRender
                v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <div
                v-if="header.column.getCanResize()"
                @mousedown="header.getResizeHandler()?.($event)"
                @touchstart="header.getResizeHandler()?.($event)"
                class="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out"
              ></div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="hasRows">
            <TableRow
              v-for="row in rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
              class="!border-b-0 hover:bg-zinc-100 group"
              @click="() => openRowSheet(row.original as pdsData)"
              data-role="org-table-row"
            >
              <TableCell 
                v-for="(cell, cellIndex) in row.getVisibleCells()" 
                :key="cell.id"
                :style="{ width: `${cell.column.getSize()}px`, position: cellIndex === 0 ? 'sticky' : '', left: cellIndex === 0 ? '0px' : '',   zIndex: cellIndex === 0 ? 30 : 10, }"
                :class="[
                  'overflow-hidden last:pr-6 px-4 bg-white border-r border-dashed border-zinc-200 dark:border-zinc-800 dark:bg-black group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 min-w-0 overflow-hidden group-hover:bg-zinc-50 dark:group-hover:bg-zinc-950 group-hover:cursor-pointer',
                  cellIndex === 0 ? 'shadow-xs' : ''
                ]"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div v-if="isLoading && !hasRows" class="flex-1 min-h-0 w-11/12 max-w-7xl mx-auto border-x border-zinc-200 dark:border-zinc-800 border-dashed flex items-center justify-center gap-2 text-center">
      <Spinner class="size-4" />
      <span class="text-sm">
        Récupération des données..
      </span>
    </div>

    <div v-else-if="!isLoading && !hasRows" class="flex-1 min-h-0 w-11/12 max-w-7xl mx-auto border-x border-zinc-200 dark:border-zinc-800 border-dashed flex items-center justify-center gap-2 text-center">
      <Empty>
        <EmptyHeader>
          <div class="flex gap-3 items-center justify-center">
            <EmptyMedia variant="icon">
              <div class="flex items-center justify-center rounded-full bg-primary text-white p-2">
                <DropletOff class="size-5" />
              </div>
            </EmptyMedia>
            <EmptyTitle class="text-lg font-bold">Aucune donnée</EmptyTitle>

          </div>
          <EmptyDescription>
            Aucun immeuble ou numéro de compteur ne correspond à votre recherche.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
    <div class="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 border-dashed" v-if="hasRows">
      <div class="w-11/12 max-w-7xl mx-auto border-x border-zinc-200 dark:border-zinc-800 border-dashed">
        <DataTablePagination :table="table" />
      </div>
    </div>

    <DataTableRowSheet
      :pds="pds"
      v-model:isOpen="isSheetOpen"
    />
    
  </div>
</template>