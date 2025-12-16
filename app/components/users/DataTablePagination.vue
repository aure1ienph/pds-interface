<script setup lang="ts" generic="TData">
  import { type Table } from '@tanstack/vue-table'
  import {ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  
  interface DataTablePaginationProps {
    table: Table<TData>
  }
  defineProps<DataTablePaginationProps>()
  </script>
  
  <template>
    <div class="flex items-center justify-between mt-4">
      <div class="flex-1 text-sm text-muted-foreground hidden sm:block">
        {{ table.getPaginationRowModel().rows.length }} sur {{ table.getFilteredRowModel().rows.length }} utilsateur·rice(s) affiché·e(s).
      </div>
  
      <div class="flex items-center space-x-6 lg:space-x-8 ml-auto">
        
        <div class="flex w-[100px] items-center justify-center text-xs font-medium">
          Page {{ table.getState().pagination.pageIndex + 1 }} sur
          {{ table.getPageCount() }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            class="w-8 h-8 p-0"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            <span class="sr-only">Go to previous page</span>
            <ChevronLeftIcon class="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            class="w-8 h-8 p-0"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            <span class="sr-only">Go to next page</span>
            <ChevronRightIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </template>