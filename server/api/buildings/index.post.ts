import { newAirtable } from "../../../shared/utils/airtable"
import type { Building } from "../../../shared/types/building"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  let pds: string[] = []
  if (body.pds) {
    if (Array.isArray(body.pds)) {
      pds = body.pds as string[]
    } else {
      pds = [body.pds as string]
    }
  }

  try {
    const base = await newAirtable(config.airtableAccessToken as string)
    
    const records = await base("tblQeMdTYx3mDfWnU").select({
      filterByFormula: "NOT({// N° PDS} = '')",
      fields: ["// N° PDS", "ID interne", "// Statut de la dernière mission", "// Nbre lots terrain"]
    }).all()

    let buildings = records.map(record => ({ 
      name: record.get("ID interne"), 
      pds: record.get("// N° PDS") as string,
      number_of_lofts: record.get("// Nbre lots terrain") as number,
      missions_status: record.get("// Statut de la dernière mission") as string,
    }))

    if (pds.length > 0) {
      const pdsSet = new Set(pds)
      buildings = buildings.filter(building => {
        const buildingPdsArray = building.pds.split(",").map(p => p.trim())
        return buildingPdsArray.some(buildingPds => pdsSet.has(buildingPds))
      })
    }

    return buildings.map(building => ({
      name: building.name,
      pds: building.pds.split(",").map(p => p.trim()),
      number_of_lofts: building.number_of_lofts,
      missions_status: typeof building.missions_status === 'string' 
        ? building.missions_status.split(",").map(p => p.trim())
        : Array.isArray(building.missions_status)
        ? building.missions_status
        : [],
    })) as Building[]
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch buildings from Airtable: ${errorMessage}`
    })
  }
})

