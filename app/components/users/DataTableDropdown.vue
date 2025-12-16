<script setup lang="ts">
  // Components
  import { MoreHorizontal } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
  import { toast } from 'vue-sonner'
  
  // Types
  import type { ServerResponse } from '../../../shared/types/serverResponse'
  
  const user = useSupabaseUser()
  const { getUserData } = useJwtData()
  
  const props = defineProps<{
    user: {
      id: string
      access: string
    }
    refreshUsers?: () => void
  }>()
  
  const deleteUser = async (userId: string) => {
    try {
      const response = await $fetch<ServerResponse>('/api/users/delete', {
        method: 'POST',
        body: {
          user_id: userId,
        }
      })
      if (response.success) {
        toast.success('Utilisateur supprimé')
        if (props.refreshUsers) {
          props.refreshUsers()
        }
      } else {
        toast.error(response.error || 'Une erreur est survenue')
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Une erreur est survenue'
      toast.error(errorMessage)
    }
  }
  </script>
  
  <template>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem @click="deleteUser(props.user.id)"
        :disabled="user?.sub === props.user.id"
        variant="destructive"
        >
          Supprimer
        </DropdownMenuItem>     
      </DropdownMenuContent>
    </DropdownMenu>
  </template>