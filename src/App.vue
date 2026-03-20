<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
const fullScreenWorkspaceNames = new Set(['sales-management', 'customer-service', 'ai-ticket', 'data-advisor'])

const isWorkspaceRoute = computed(() => {
  return fullScreenWorkspaceNames.has(String(route.name)) && route.query.workspace === '1'
})

const isFullScreen = computed(() => route.meta.fullScreen === true || isWorkspaceRoute.value)
</script>

<template>
  <div class="app-container">
    <Sidebar v-if="!isFullScreen" />
    <main class="main-content" :class="{ 'full-screen': isFullScreen }">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-color);
}

.main-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}

.main-content.full-screen {
  width: 100%;
}
</style>
