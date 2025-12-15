import { jwtDecode } from 'jwt-decode'
import type { CustomJwtPayload } from '../../shared/types/customJwtPayload'
import { serverSupabaseClient } from '#supabase/server'
import type { H3Event } from 'h3'
import { jwtVerify, createRemoteJWKSet } from 'jose'

const PROJECT_JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
)

export async function getUserJwtToken(event: H3Event) {
  const client = await serverSupabaseClient(event)
  const { data: { session }, error } = await client.auth.getSession()
  if (error || !session) return sendRedirect(event, '/login')

  const token = session.access_token

  try {
    await jwtVerify(token, PROJECT_JWKS)
    return jwtDecode<CustomJwtPayload>(token)
  } catch (err) {
    return sendRedirect(event, '/login')
  }
}

export function isUserAdmin(app_role: string) {
  return app_role === 'admin'
}