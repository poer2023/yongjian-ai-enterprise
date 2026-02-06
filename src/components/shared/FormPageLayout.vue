<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="form-page">
    <slot name="sidebar" />

    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <component :is="icon" :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">{{ title }}</h1>
          <p class="form-subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div class="form-content">
        <slot />
      </div>
    </main>

    <slot name="info-sidebar" />
  </div>
</template>

<style scoped>
.form-page {
  display: flex;
  height: 100%;
  background: #f8fafc;
}

.form-main {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -24px -32px 32px -32px;
  padding: 20px 32px;
  background: #eff6ff;
}

.form-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin: 0;
}

.form-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.form-content {
  max-width: 100%;
}
</style>
