<script setup lang="ts">
// Components
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Types
import type { User } from '../../shared/types/user'

// Libraries
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const userObject = ref<User | null>(null)
const disabledSubmitButton = ref(false)

type FormValues = {
  first_name: string
  last_name: string
  email: string
  daily_differential_warning_notification: boolean
}

const formSchema = toTypedSchema(z.object({
  first_name: z.string("Le prénom ne peut pas être vide"),
  last_name: z.string("Le nom ne peut pas être vide"),
  email: z.email().optional(),
  daily_differential_warning_notification: z.boolean(),
}))

const form = useForm<FormValues>({
  validationSchema: formSchema,
})

const getUserData = async () => { 
  const { data } = await supabase
  .from('profiles').select('id, first_name, last_name, email, daily_differential_warning_notification')
  .single()

  return data ? data as unknown as User : null
}

const updateProfile = async (values: FormValues) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(values as never)
    .eq('user_id', user?.value?.sub as string)
    .select()
}

const onSubmit = form.handleSubmit(async (values) => {
  disabledSubmitButton.value = true
  try {
    await updateProfile(values)
    userObject.value = await getUserData()
  } catch (err) {
    console.error('Unexpected error:', err)
  } finally {
    disabledSubmitButton.value = false
  }
})

onMounted(async () => {
  userObject.value = await getUserData()
})

watch(userObject, (data) => {
  if (data) {
    form.setFieldValue('first_name', data.first_name || '')
    form.setFieldValue('last_name', data.last_name || '')
    form.setFieldValue('email', data.email || '')
    form.setFieldValue('daily_differential_warning_notification', data.daily_differential_warning_notification || false)
  }
}, { immediate: true })
</script>

<template>
  <form @submit="onSubmit" class="flex flex-col gap-4">
    <div class="flex max-sm:flex-col gap-4">
      <FormField v-slot="{ componentField }" name="first_name" max-w-md mx-auto>
        <FormItem class="w-full">
          <FormLabel>Prénom</FormLabel>
          <FormControl>
            <Input id="first_name" type="text" required v-bind="componentField"/>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="last_name" class="flex-1">
        <FormItem class="w-full">
          <FormLabel>Nom</FormLabel>
          <FormControl>
            <Input id="last_name" type="text" required v-bind="componentField"/>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField v-slot="{ componentField }" name="email" class="flex-1/2">
      <FormItem class="w-full">
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input id="email" type="email" :value="userObject?.email || ''" disabled="true" v-bind="componentField"/>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div>
      <p class="font-medium mb-6 mt-2">
        Notifications Email
      </p>

      <div class="space-y-4">
        <FormField v-slot="{ value, handleChange }" name="daily_differential_warning_notification">
          <FormItem class="flex max-sm:flex-col max-sm:items-start flex-row items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 border-dashed px-4 py-2">
            <div class="space-y-0.5">
              <FormLabel class="text-xs sm:text-sm">
                Notifications de différentiel quotidien
              </FormLabel>
              <FormDescription class="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                Recevez une notification par email lorsque le différentiel quotidien est supérieur à 50.
              </FormDescription>
            </div>
            <FormControl>
              <Switch 
                id="daily_differential_warning_notification"
                :model-value="value"
                @update:model-value="handleChange"
              />
            </FormControl>
          </FormItem>
        </FormField>

      </div>
    </div>

    <Button type="submit" class="w-fit max-sm:w-full cursor-pointer mt-4" :disabled="disabledSubmitButton">
      Mettre à jour
    </Button>
  </form>
</template>