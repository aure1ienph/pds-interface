<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div>
    <div class="px-6 py-6 lg:py-10">
      <h1 class="text-black dark:text-white font-bold text-3xl">
        Gestion du profil
      </h1>
    </div>

    <div class="flex max-lg:flex-col gap-4 w-full border-y border-dashed border-zinc-200 dark:border-zinc-800">
      <div class="w-full max-lg:border-b lg:w-1/3 lg:border-r border-dashed border-zinc-200 dark:border-zinc-800 px-6 py-6 lg:py-10">
        <h2 class="text-black dark:text-white font-semibold text-lg">Modifier vos informations</h2>
      </div>
      <div class="w-full lg:w-2/3 px-6 py-6 lg:py-10">
        <ProfilUserForm />
      </div>
    </div>
  </div>
</template>