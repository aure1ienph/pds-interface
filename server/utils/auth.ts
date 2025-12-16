import { jwtDecode } from 'jwt-decode'
import type { CustomJwtPayload } from '../../shared/types/customJwtPayload'
import { serverSupabaseClient } from '#supabase/server'
import type { H3Event } from 'h3'

export const getUserJwtToken = async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const { data: { session }, error } = await client.auth.getSession()
  if (error || !session) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  const token = session.access_token

  try {
    return jwtDecode<CustomJwtPayload>(token)
  } catch (err) {
    console.error('JWT decode error:', err)
    throw createError({ statusCode: 401, statusMessage: 'Token invalide' })
  }
}

export const isUserAdmin = (access: string) => {
  return access === 'admin'
}