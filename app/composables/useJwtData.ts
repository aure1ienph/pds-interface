import { jwtDecode } from 'jwt-decode'
import type { CustomJwtPayload } from '../../shared/types/customJwtPayload'
import type { User } from '../../shared/types/user'

// Global reactive state for JWT custom claims
const access = ref<string>('')
const userId = ref<string>('')
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')

const isInitialized = ref<boolean>(false)
let authListenerInitialized = false

export const useJwtData = () => {
  const supabase = useSupabaseClient()

  const initializeUserData = async () => {
    if (isInitialized.value) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const jwt = jwtDecode<CustomJwtPayload>(session.access_token)
        access.value = jwt.access
        userId.value = jwt.user_id
        firstName.value = jwt.first_name
        lastName.value = jwt.last_name
        email.value = jwt.email
        isInitialized.value = true
      }

    } catch (error) {
      console.error('Erreur lors de l\'initialisation des données utilisateur:', error)
    }
  }

  // Initialize auth listener only once
  if (!authListenerInitialized) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const jwt = jwtDecode<CustomJwtPayload>(session.access_token)
        access.value = jwt.access
        userId.value = jwt.user_id
        firstName.value = jwt.first_name
        lastName.value = jwt.last_name
        email.value = jwt.email
        isInitialized.value = true
      } else {
        // Reset values on logout
        access.value = ''
        userId.value = ''
        firstName.value = ''
        lastName.value = ''
        email.value = ''
        isInitialized.value = false
      }
    })
    authListenerInitialized = true
  }

  const isUserDataInitialized = () => isInitialized.value

  const getUserData = (): User => {
    return {
      id: userId.value,
      access: access.value as User['access'],
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
    }
  }

  return {
    initializeUserData,
    getUserData,
    isUserDataInitialized,
  }
}