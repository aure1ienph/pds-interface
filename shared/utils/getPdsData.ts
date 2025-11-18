import type { Consumption } from '../types/consumption'
import type { Building } from '../types/building'
import type { pdsData } from '../types/pdsData'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getPdsData(
  supabaseClient: SupabaseClient,
  getBuildings: (pdsList: string[]) => Promise<Building[]>
): Promise<pdsData[]> {
  const { data: consumption, error } = await supabaseClient.rpc('get_consumptions')
  
  if (error) {
    throw error
  }

  const consumptionArray = (consumption as Consumption[]) || []
  const pdsList = consumptionArray.map((item: Consumption) => item.pds)

  const buildings = await getBuildings(pdsList)

  const consumptionData = consumptionArray.map((consumption: Consumption) => {
    return {
      consumption: consumption,
      building: buildings.find((building: Building) => building.pds.includes(consumption.pds)),
    }
  })

  return consumptionData.filter((item): item is pdsData => item.building !== undefined) as pdsData[]
}

