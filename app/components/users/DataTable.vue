<script setup lang="ts" generic="TData, TValue">
  import type { ColumnDef } from '@tanstack/vue-table'
  import { FlexRender, getCoreRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
  import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
  import DataTablePagination from './DataTablePagination.vue'
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
  
  const props = defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
  }>()
  
  const table = useVueTable({
    get data() { return props.data },
    get columns() { return props.columns },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
  })
  
  // Set columns width
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isBelowSm = breakpoints.smaller('sm')
  const getColumnWidth = (columnId: string) => {
    const widthMap: Record<string, string> = isBelowSm.value
      ? {
          'profil_picture': '0%',
          'user': '40%',
          'app_role': '40%',
          'actions': '20%'
        }
      : {
          'profil_picture': '8%',
          'user': '42%',
          'app_role': '40%',
          'actions': '10%'
        }
    return widthMap[columnId] || 'auto'
  }

  const emit = defineEmits<{
    userCreated: []
  }>()
  </script>
  
  <template>
    <UserFormInsert @userCreated="emit('userCreated')" />
    <div class="border border-zinc-200 dark:border-zinc-800 rounded-md w-full overflow-hidden">
      <Table class="w-full table-fixed border-collapse">
        <TableBody>
          <template v-if="table.getPaginationRowModel().rows?.length">
            <TableRow
              v-for="row in table.getPaginationRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
              class="border-zinc-200 dark:border-zinc-800"
            >
              <TableCell 
                v-for="cell in row.getVisibleCells()" 
                :key="cell.id" 
                class="px-4 py-3"
                :style="{ width: getColumnWidth(cell.column.id) }"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                Pas de résultats.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <DataTablePagination :table="table" />
  </template>