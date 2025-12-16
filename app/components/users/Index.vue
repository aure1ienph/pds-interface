<script setup lang="ts">
// Components
import DataTable from './DataTable.vue'

// Dependencies
import { toast } from 'vue-sonner'
import { columns } from './columns'

// Types
import type { User } from '../../../shared/types/user'

// References
const data = ref<User[]>([])

// Initialize Supabase
const supabase = useSupabaseClient()
const { getUserData } = useJwtData()

// Get users list
const getUsers = async (): Promise<User[]> => {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name, email, access')

  if (error) {
    toast.error(error.message)
    return []
  }

  const usersList = users.map((user: any) => ({
    id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    access: user.access,
  })).sort((a: User, b: User) => a.first_name.localeCompare(b.first_name))

  return usersList
}

// Reload data function
const refreshUsers = async () => {
  data.value = await getUsers()
}

// Create columns with callback and current user role (computed to be reactive)
const columnsData = computed(() => columns(refreshUsers, getUserData().access))

// Get users on mount
onMounted(async () => {
  data.value = await getUsers()
})
</script>

<template>
  <DataTable :columns="columnsData" :data="data" @userCreated="refreshUsers"/>
</template>