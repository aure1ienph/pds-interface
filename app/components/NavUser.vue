<script setup lang="ts">
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar'
import { User, LogOut, Users } from 'lucide-vue-next'
import type { User as UserType } from '../../shared/types/user'

const supabase = useSupabaseClient()
const userData = ref<UserType | null>(null)
const { getUserData, isUserDataInitialized, initializeUserData } = useJwtData()

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}

onMounted(async () => {
  if (!isUserDataInitialized()) {
    await initializeUserData()
  }
  userData.value = await getUserData()
  console.log(userData.value)
})
</script>

<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>
        <div class="w-[30px] h-[30px] cursor-pointer rounded-full bg-gradient-to-r from-30% from-indigo-500 to-blue-400 rotate-45">
        </div>
      </MenubarTrigger>
      <MenubarContent align="end" class="shadow-xs">
        <div class="grid flex-1 text-left text-sm leading-tight py-1 mx-3">
          <span class="truncate font-bold">
            {{ userData?.first_name || '' }} {{ userData?.last_name || '' }}
          </span>
          <span class="truncate text-xs text-zinc-500">
            {{ userData?.email || '' }}
          </span>
        </div>
        <div class="flex w-full h-[1px] bg-zinc-200 dark:bg-zinc-800">
        </div>
          <MenubarSeparator />
        <MenubarItem @click="navigateTo('/profile')">
          <User class="size-3.5" />
          Profil
        </MenubarItem>
        <MenubarItem @click="navigateTo('/team')" v-if="userData?.access === 'admin'">
          <Users class="size-3.5" />
          Équipe
        </MenubarItem>
        <MenubarItem @click="logout">
          <LogOut class="size-3.5" />
          Déconnexion
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>

</template>