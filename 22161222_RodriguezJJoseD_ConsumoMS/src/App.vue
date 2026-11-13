<template>
  <div class="dashboard-layout">
    <Sidebar v-if="showSidebar" />
    <main class="dashboard-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/sidebar.components.vue'
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showSidebar = computed(() => authStore.isAuthenticated && route.name !== 'login')

onMounted(async () => {
  if (authStore.isAuthenticated) {
    const valid = await authStore.verifySession()
    if (!valid && route.name !== 'login') {
      router.push({ name: 'login' })
    }
  }
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f1f5f9;
}

.dashboard-main {
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
  background-color: #f8fafc;
}
</style>
