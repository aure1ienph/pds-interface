<script setup lang="ts">
const navItems = [
  {
    name: 'Accueil',
    href: '/',
  },
]
</script>

<template>
  <div class="flex items-center justify-center sticky top-0 z-10 bg-white dark:bg-black max-w-screen border-b border-zinc-200 dark:border-zinc-800 border-dashed">
    <div class="flex items-center justify-between gap-2 max-w-7xl w-11/12 py-2 border-x border-zinc-200 dark:border-zinc-800 border-dashed px-6">
      <div class="flex gap-2">
        <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href" class="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
          {{ item.name }}
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2">
        <NavTheme />
        <NavUser />
      </div>
    </div>
  </div>
</template>