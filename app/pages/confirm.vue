<script setup lang="ts">
const route = useRoute()
const email = computed(() => route.query.email as string | undefined)

definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <AuthOtpForm v-if="email" :email="email" />
</template>