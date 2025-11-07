<script setup lang="ts">
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar'
import { User, LogOut } from 'lucide-vue-next'

const supabase = useSupabaseClient()

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>
        <div class="w-[30px] h-[30px] cursor-pointer rounded-full bg-gradient-to-r from-30% from-indigo-500 to-blue-400 rotate-45">
        </div>
      </MenubarTrigger>
      <MenubarContent align="end">
        <MenubarItem @click="navigateTo('/profile')">
          <User class="size-3.5" />
          Profil
        </MenubarItem>
        <MenubarItem @click="logout">
          <LogOut class="size-3.5" />
          Déconnexion
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>

</template>