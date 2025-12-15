export default defineNuxtRouteMiddleware(async (to, from) => {
  const protectedPaths = ['/team']
  if (!protectedPaths.includes(to.path)) return

  const allowedCallerRoles = ['user']
  const isUserAdmin = (role: string) => allowedCallerRoles.includes(role)

  const { initializeUserData, getUserData, isUserDataInitialized } = useJwtData()

  if (!isUserDataInitialized()) {
    await initializeUserData()
  }

  const access = getUserData().access

  if (!isUserAdmin(access)) {
    return navigateTo('/unauthorized', { replace: true })
  }
  
  return
})