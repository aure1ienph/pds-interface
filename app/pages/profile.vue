<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="h-[calc(100svh-94px)] flex flex-col">
    <div class="w-full border-b border-zinc-200 dark:border-zinc-800 border-dashed flex-shrink-0">
      <div class="w-11/12 max-w-7xl mx-auto border-x border-zinc-200 dark:border-zinc-800 border-dashed px-6 py-6">
        <h1 class="text-black dark:text-white font-bold text-3xl">
        Gestion du profil
        </h1>
      </div>
    </div>

    <div class="flex max-lg:flex-col gap-4 w-11/12 max-w-7xl mx-auto border-x border-b border-dashed border-zinc-200 dark:border-zinc-800 flex-shrink-0">
      <div class="w-full max-lg:border-b lg:w-1/3 lg:border-r border-dashed border-zinc-200 dark:border-zinc-800 px-6 py-6 lg:py-10">
        <h2 class="text-black dark:text-white font-semibold text-lg">Modifier vos informations</h2>
      </div>
      <div class="w-full lg:w-2/3 px-6 py-6">
        <UserFormUpdate />
      </div>
    </div>

    <div class="flex-1 min-h-0 w-11/12 max-w-7xl mx-auto border-x border-dashed border-zinc-200 dark:border-zinc-800">
    </div>
  </div>
</template>