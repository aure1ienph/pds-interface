import type { ServerResponse } from '../../../shared/types/serverResponse'
import { getUserJwtToken, isUserAdmin } from '../../utils/auth'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { CustomJwtPayload } from '../../../shared/types/customJwtPayload'

export default defineEventHandler(async (event): Promise<ServerResponse | void> => {
  const body = await readBody(event)
  const targetId = body.user_id

  // Set supabase service role
  const serviceRole = serverSupabaseServiceRole(event)

  // Get user role through JWT
  const jwt = await getUserJwtToken(event) as CustomJwtPayload
  const userAccess = jwt.access

  // Security check using the body to avoid unecessary requests to db
  if (!isUserAdmin(userAccess)) {
    throw createError({ statusCode: 403, statusMessage: 'Vous n\'avez pas les droits pour effectuer cette action' })
  }
  // If all checks are passed, update user role
  try {
    const { error } = await serviceRole
      .from('profiles')
      .update({
        access: body.access,
      } as never)
      .eq('user_id', targetId)
      .select()

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 403, statusMessage: error instanceof Error ? error.message : 'Unknown error' })
  }
})