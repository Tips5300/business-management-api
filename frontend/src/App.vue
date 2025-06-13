<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value.path)

const isAuthRoute = computed(() => {
  return ['/login', '/register', '/forgot-password'].includes(currentRoute.value)
})
</script>

<template>
  <AuthLayout v-if="isAuthRoute" />
  <MainLayout v-else />
</template>