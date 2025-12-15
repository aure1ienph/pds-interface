<script lang="ts" setup>
  import type { ToasterProps } from "vue-sonner"
  import { Toaster as Sonner } from "vue-sonner"
  import { computed } from "vue"
  
  const props = defineProps<ToasterProps>()
  
  type SonnerTheme = 'light' | 'dark' | 'system'
  
  const colorMode = useColorMode()
  const sonnerTheme = computed<SonnerTheme>(() => {
    const pref = colorMode.preference as string
    if (pref === 'dark' || pref === 'light' || pref === 'system') return pref as SonnerTheme
    return colorMode.value === 'dark' ? 'dark' : 'light'
  })
  </script>
  
  <template>
    <Sonner
      class="toaster group"
      v-bind="props"
      :toast-options="{
        class: 'custom-toast',
        style: {
          padding: '8px 16px 8px 16px',
        }
      }"
      :theme="sonnerTheme"
    />
  </template>