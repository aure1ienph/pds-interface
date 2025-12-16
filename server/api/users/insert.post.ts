import type { ServerResponse } from '../../../shared/types/serverResponse'
import { getUserJwtToken, isUserAdmin } from '../../utils/auth'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { CustomJwtPayload } from '../../../shared/types/customJwtPayload'

const generatePassword = () => {
  let length = 20,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = ""
  for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

export default defineEventHandler(async (event): Promise<ServerResponse | void> => {
  const body = await readBody(event)

  console.log(body)

  // Set supabase service role
  const serviceRole = serverSupabaseServiceRole(event)

  // Get user role through JWT
  const jwt = await getUserJwtToken(event) as CustomJwtPayload
  const userAccess = jwt.access

  // If user is not authorized then throw an error
  if (!isUserAdmin(userAccess)) {
    throw createError({ statusCode: 403, statusMessage: 'Vous n\'avez pas les droits pour effectuer cette action' })
  }
  try {

    const { data: user, error } = await serviceRole.auth.admin.createUser({
      email: body.email,
      password: generatePassword(),
      user_metadata: { firstName: body.first_name, lastName: body.lastName }
    })

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    // If user is invited then create user_role row in database
    if (user) {
      try {
        const { data: profile, error } = await serviceRole
        .from('profiles')
        .insert([
          { user_id: user.user.id,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            access: body.access,
          },
        ] as any)
        .select()

        if (error) throw createError({ statusCode: 500, statusMessage: error.message })
        if (profile) return { success: true }

      } catch (error) {
        throw createError({ statusCode: 500, statusMessage: (error as any)?.message || 'Internal Server Error' })
      }
    }

  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: (error as any)?.message || 'Internal Server Error' })
  }
})