<script setup lang="ts">
  import { MoveLeft } from 'lucide-vue-next'
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="flex flex-col items-start  max-w-[480px]">
    <h1 class="text-2xl font-bold">Accès refusé</h1>
      <span class="text-lg text-zinc-500 dark:text-zinc-400 max-w-[600px] mt-2 font-medium">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </span>
      <NuxtLink to="/" class="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 mt-4 text-sm cursor-pointer border-b border-blue-500">
        <MoveLeft class="w-4 h-4" />
        Retour
      </NuxtLink>
    </div>
  </div>
</template>