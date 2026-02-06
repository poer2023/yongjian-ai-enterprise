<script setup lang="ts">
import { ref } from 'vue';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-vue-next';

const props = defineProps<{
  message: string;
  visible: boolean;
  type?: 'warning' | 'success' | 'error' | 'info';
  duration?: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  info: Info
};

const icon = iconMap[props.type || 'warning'];
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast-container">
      <div class="toast-message" :class="`toast-${type || 'warning'}`">
        <component :is="icon" :size="18" />
        <span>{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.toast-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: #1e293b;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.toast-message.toast-warning svg {
  color: #fbbf24;
}

.toast-message.toast-success svg {
  color: #22c55e;
}

.toast-message.toast-error svg {
  color: #ef4444;
}

.toast-message.toast-info svg {
  color: #3b82f6;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
