<script setup lang="ts">
import { columns } from './columns'
import DataTable from './DataTable.vue'

// Types
import type { pdsData } from '../../../shared/types/pdsData'
import type { Consumption } from '../../../shared/types/consumption'
import type { Building } from '../../../shared/types/building'

const supabase = useSupabaseClient()

const data = ref<pdsData[]>([])

async function getData(): Promise<pdsData[]> {
  const { data: consumption, error } = await supabase.rpc('get_consumptions')
  
  if (error) {
    throw error
  }

  const consumptionArray = (consumption as Consumption[]) || []
  const pdsList = consumptionArray.map((item: Consumption) => item.pds)

  const buildings = await $fetch<Building[]>('/api/buildings', {
    method: 'POST',
    body: {
      pds: pdsList
    }
  })

  const consumptionData = consumptionArray.map((consumption: Consumption) => {
    return {
      consumption: consumption,
      building: buildings.find((building: Building) => building.pds.includes(consumption.pds)),
    }
  })

  return consumptionData.filter((item): item is pdsData => item.building !== undefined) as pdsData[]
}

onMounted(async () => {
  try {
    data.value = await getData()
    console.log(data.value)
  } catch (error) {
    console.error('Failed to load consumption data:', error)
  }
})
</script>

<template>
  <DataTable :columns="columns" :data="data" />
</template>