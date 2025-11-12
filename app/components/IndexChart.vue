<script setup lang="ts">
// Types
import type { Index } from '../../shared/types/index'
import type { ChartData } from '../../shared/types/chartData'

// Props
const props = defineProps<{
  data: Index[]
}>()

// Reactive data
const data = computed<ChartData[]>(() => {
  return props.data.map((item) => ({
    metering: item.index,
    date: new Date(item.date_index).toISOString()
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const meteringValues = computed(() => data.value.map(d => d.metering))
const minValue = computed(() => meteringValues.value.length > 0 ? Math.min(...meteringValues.value) : 0)
const maxValue = computed(() => meteringValues.value.length > 0 ? Math.max(...meteringValues.value) : 100)
const yDomain = computed<[number, number]>(() => [minValue.value, maxValue.value])

// Chart configuration
const categories: Record<string, BulletLegendItemInterface> = {
  metering: {
    name: 'Index',
    color: 'var(--primary)',
  }
}

const xFormatter = (i: number) => {
  const dateStr = data.value[i]?.date
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }).charAt(0).toUpperCase() + date.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }).slice(1)
}
</script>

<template>
  <LineChart
    :data="data"
    :height="240"
    :categories="categories"
    :y-num-ticks="4"
    :x-num-ticks="4"
    :x-formatter="xFormatter"
    :hide-legend="true"
    :x-grid-line='false'
    :y-grid-line="true"
    :hide-tooltip='false'
    :x-domain-line='true'
    :y-domain-line='true'
    :x-tick-line='true'
    :y-tick-line='true'
    :y-domain="yDomain"
  >
    <template #tooltip="{ values }">
      <div class="flex flex-col items-start juystify-center gap-.5 rounded bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <span class="py-1 px-2 w-full text-red-6O0 text-sm">
          {{ values?.date ? new Date(values.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '' }}
        </span>
        <div class="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
        <div class="flex gap-2 items-center py-1 px-2 w-full text-sm">
          <!-- tailwind-safelist hidden -->
          <div class="w-2 h-2 rounded-full bg-primary"></div>
          Index - {{ values?.metering }}
        </div>
      </div>
    </template>
  </LineChart>

</template>
