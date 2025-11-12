<script setup lang="ts">
import type { TagField } from '../../shared/types/tag'
import { getTagMeta } from '../lib/tags'

const props = defineProps<{
  field: TagField
  value?: string | null
}>()

const meta = computed(() => getTagMeta(props.field, props.value))

const classes = computed(() => {
  const base = 'inline-flex min-w-0 max-w-full w-fit items-center rounded-full px-2.5 py-0.5 text-sm max-sm:text-xs font-normal'
  const fallback = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
  return `${base} ${meta.value?.colorClass ?? fallback}`
})

const label = computed(() => meta.value?.label ?? (props.value ?? ''))
</script>

<template>
  <span :class="classes">
    <span class="min-w-0 max-w-full truncate">{{ label }}</span>
  </span>
</template>