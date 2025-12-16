
<script setup lang="ts">
  // Components
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  
  // Dependencies
  import { toast } from 'vue-sonner'
  
  // Types
  import type { ServerResponse } from '../../../shared/types/serverResponse'
  
  interface Props {
    access: string
    userId: string
    refreshUsers?: () => void
  }
  
  const { getUserData } = useJwtData()
  const props = defineProps<Props>()
  
  const pendingRole = ref<string | null>(null)
  const isUpdating = ref(false)
  
  const handleRoleUpdate = async (newRole: string) => {
    await updateUserRole(newRole)
  }
  
  const updateUserRole = async (role: string) => {
    isUpdating.value = true
    try {
      const response = await $fetch<ServerResponse>('/api/supabase/users/update', {
        method: 'POST',
        body: {
          user_id: props.userId,
          access: role,
        },
      })
  
      if (response.success) {
        toast.success('Rôle mis à jour')
      } else {
        toast.error(response.error || 'Une erreur est survenue')
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Une erreur est survenue'
      toast.error(errorMessage)
    }
    props.refreshUsers?.()
    isUpdating.value = false
  }

  </script>
  
  <template>
    <div class="w-full">
      <Select 
        :key="props.access"
        :model-value="props.access"
        :disabled="getUserData().access === props.access"
        @update:model-value="handleRoleUpdate($event as string)"
      >
        <SelectTrigger class="w-full">
          <SelectValue :placeholder="'Admin'" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">
            Admin
          </SelectItem>
          <SelectItem value="user">
            Lecteur·rice
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </template>