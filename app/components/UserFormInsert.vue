<script setup lang="ts">
// Components
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Types
import type { ServerResponse } from '../../shared/types/serverResponse'

// Libraries
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const disabledSubmitButton = ref(false)
const isCreating = ref(false)
const isDialogOpen = ref(false)

type FormValues = {
  first_name: string
  last_name: string
  access: 'admin' | 'user'
  email: string
}

const formSchema = toTypedSchema(z.object({
  first_name: z.string("Le prénom ne peut pas être vide"),
  last_name: z.string("Le nom ne peut pas être vide"),
  access: z.enum(["admin", "user"], { message: "L'accès est requis" }),
  email: z.email("L'email est invalide"),
}))

const form = useForm<FormValues>({
  initialValues: {
    first_name: '',
    last_name: '',
    access: 'user',
    email: '',
  },
  validationSchema: formSchema,
})

watch(isDialogOpen, (isOpen) => {
  if (isOpen) {
    form.resetForm({
      values: {
        first_name: '',
        last_name: '',
        access: 'user',
        email: '',
      }
    })
  }
})

const createUser = async (values: FormValues, resetForm: any) => {
  isCreating.value = true
  try {
    const response = await $fetch<ServerResponse>('/api/users/insert', {
      method: 'POST',
      body: values,
    })
    if (response.success) {
      toast.success('Utilisateur·rice créé avec succès')
      emit('userCreated')
      resetForm({
        values: {
          first_name: '',
          last_name: '',
          access: 'user',
          email: '',
        }
      })
      setTimeout(() => {
        isDialogOpen.value = false
      }, 100)
    } else {
      toast.error(response.error || 'Une erreur est survenue')
    }
  } catch (error: any) {
    const errorMessage = error?.data?.message || error?.message || 'Une erreur est survenue'
    toast.error(errorMessage)
  } finally {
    isCreating.value = false
  }
}

const emit = defineEmits<{
  userCreated: []
}>()

const onSubmit = form.handleSubmit(async (values, { resetForm }) => {
  await createUser(values, resetForm)
})

</script>
  
<template>
  <div class="w-full flex justify-end mb-4">
    <Button @click="isDialogOpen = true" class="flex items-center gap-1 h-[30px]">
      <PlusIcon class="w-3.5 h-3.5" />
      Créer un accès
    </Button>
  </div>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent>
      <DialogHeader class="mb-2 border-b pb-2 border-zinc-200 dark:border-zinc-800 border-dashed">
        <DialogTitle class="text-2xl font-semibold">Ajouter un·e utilisateur·rice</DialogTitle>
        <DialogDescription class="text-zinc-600 dark:text-zinc-400 mb-2">
          Les accès admin permettent de gérer les utilisateur·rices de l'application.
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="flex flex-col gap-4">
        <div class="flex gap-2 w-full items-start">
          <FormField v-slot="{ componentField }" name="first_name" max-w-md mx-auto>
            <FormItem class="w-full">
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input id="first_name" type="text" placeholder="John" required v-bind="componentField" class="w-full h-[30px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="last_name" class="flex-1">
            <FormItem class="w-full">
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input id="last_name" type="text" placeholder="Doe" required v-bind="componentField" class="w-full h-[30px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="access" class="flex-1">
          <FormItem class="w-full">
            <FormLabel>Accès</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un accès.." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div class="h-2 w-2 rounded-full bg-red-500">
                    </div>
                    Admin
                  </SelectItem>
                  <SelectItem value="user">
                    <div class="h-2 w-2 rounded-full bg-blue-500">
                    </div>
                    Lecteur·rice
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email" class="flex-1/2">
          <FormItem class="w-full">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input id="email" type="email" placeholder="m@example.com" v-bind="componentField" class="w-full h-[30px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-fit max-sm:w-full cursor-pointer mt-4 h-[30px] ms-auto px-6" :disabled="disabledSubmitButton">
          Ajouter
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>