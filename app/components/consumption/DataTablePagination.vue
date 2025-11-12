<script setup lang="ts" generic="TData">
import { type Table } from '@tanstack/vue-table'
import { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface DataTablePaginationProps {
  table: Table<TData>
}
defineProps<DataTablePaginationProps>()

const containerRef = ref<HTMLElement>()
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

const showFirstLastButtons = computed(() => containerWidth.value >= 720) // lg breakpoint
const showPageSizeLabel = computed(() => containerWidth.value >= 640) // sm breakpoint
const showPageInfo = computed(() => containerWidth.value >= 240) // custom breakpoint
const showSelectionInfo = computed(() => containerWidth.value >= 400) // custom breakpoint

const updateContainerWidth = (entries: ResizeObserverEntry[]) => {
  if (entries.length > 0) {
    const entry = entries[0]
    if (entry) {
      containerWidth.value = entry.contentRect.width
    }
  }
}

onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
    resizeObserver = new ResizeObserver(updateContainerWidth)
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div ref="containerRef" class="flex items-center justify-between px-6 py-3">

    <div class="w-fit text-sm text-muted-foreground text-xs" :class="{ 'hidden': !showSelectionInfo }">
      {{ table.getRowModel().rows.length }} sur
      {{ table.getFilteredRowModel().rows.length }} lignes affichées
    </div>

    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2" :class="{ 'hidden': !showPageSizeLabel }">
        <p class="text-xs" >
          Lignes par page
        </p>
        <Select
          :key="`pageSize-${table.getState().pagination.pageSize}`"
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="(value) => table.setPageSize(Number(value))"
        >
          <SelectTrigger class=" py-0 w-[80px] text-xs">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [20, 50, 100]" :key="pageSize" :value="`${pageSize}`" class="text-xs">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-fit items-center justify-center text-xs" :class="{ 'hidden': !showPageInfo }">
        Page {{ table.getState().pagination.pageIndex + 1 }} sur
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :class="{ 'hidden': !showFirstLastButtons }"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRight class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :class="{ 'hidden': !showFirstLastButtons }"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>