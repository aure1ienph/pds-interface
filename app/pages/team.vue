<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="h-[calc(100svh-94px)] flex flex-col">
    <div class="w-full border-b border-zinc-200 dark:border-zinc-800 border-dashed flex-shrink-0">
      <div class="w-11/12 max-w-7xl mx-auto border-x border-zinc-200 dark:border-zinc-800 border-dashed px-6 py-6">
        <h1 class="text-black dark:text-white font-bold text-3xl">
        Paramètres d'équipe
        </h1>
      </div>
    </div>

    <div class="flex max-lg:flex-col gap-4 w-11/12 max-w-7xl mx-auto border-x border-b border-dashed border-zinc-200 dark:border-zinc-800 flex-shrink-0">
      <div class="w-full max-lg:border-b lg:w-1/3 lg:border-r border-dashed border-zinc-200 dark:border-zinc-800 px-6 py-6 lg:py-10">
        <h2 class="text-black dark:text-white font-semibold text-lg">
          Gérer les accès
        </h2>
        <div class="flex flex-col items-start gap-2 mt-2">
          <div class="flex items-center gap-2 text-sm dark:bg-zinc-900 bg-zinc-100 px-3 py-0.5 rounded-full w-fit">
            <div class="h-2 w-2 rounded-full bg-red-500">
            </div>
            Admin
          </div>
          <span class="text-xs text-zinc-500 dark:text-zinc-400">
            Permet de gérer les utilisateur·rices de l'application.
          </span>
        </div>

        <div class="flex flex-col items-start gap-2 mt-2">
          <div class="flex items-center gap-2 text-sm dark:bg-zinc-900 bg-zinc-100 px-3 py-0.5 rounded-full w-fit">
            <div class="h-2 w-2 rounded-full bg-blue-500">
            </div>
            Lecteur·rice
          </div>
          <span class="text-xs text-zinc-500 dark:text-zinc-400">
            Accès en lecture seule du tableau de consommation.
          </span>
        </div>

      </div>
      <div class="w-full lg:w-2/3 px-6 py-6">
        <Users />
      </div>
    </div>

    <div class="flex-1 min-h-0 w-11/12 max-w-7xl mx-auto border-x border-dashed border-zinc-200 dark:border-zinc-800">
    </div>
  </div>
</template>