<script setup lang="ts">
import { Check, X, Clock } from 'lucide-vue-next';

defineProps<{
  status: 'pending' | 'accepted' | 'rejected';
  acceptedText?: string;
  rejectedText?: string;
  pendingText?: string;
}>();
</script>

<template>
  <span class="status-badge" :class="`status-${status}`">
    <Clock v-if="status === 'pending'" :size="14" />
    <Check v-else-if="status === 'accepted'" :size="14" />
    <X v-else :size="14" />
    <span v-if="status === 'pending'">{{ pendingText || '待处理' }}</span>
    <span v-else-if="status === 'accepted'">{{ acceptedText || '已接受' }}</span>
    <span v-else>{{ rejectedText || '已拒绝' }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fcd34d;
}

.status-badge.status-accepted {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status-badge.status-rejected {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}
</style>
