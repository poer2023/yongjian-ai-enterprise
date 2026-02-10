<script setup lang="ts">
import { computed } from 'vue';
import { X } from 'lucide-vue-next';

interface SelectableItem {
  id: string;
  name: string;
  desc: string;
}

interface Props {
  items: SelectableItem[];
  modelValue: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

// Only show selected items
const selectedItems = computed(() => {
  return props.items.filter(item => props.modelValue.includes(item.id));
});

const remove = (id: string) => {
  emit('update:modelValue', props.modelValue.filter(v => v !== id));
};
</script>

<template>
  <div class="checklist-grid" v-if="selectedItems.length">
    <div
      v-for="item in selectedItems"
      :key="item.id"
      class="checklist-item"
    >
      <button class="checklist-remove" @click="remove(item.id)" title="移除">
        <X :size="14" />
      </button>
      <span class="checklist-item-name">{{ item.name }}</span>
      <span class="checklist-item-desc">{{ item.desc }}</span>
    </div>
  </div>
  <div v-else class="checklist-empty">
    暂未添加，请通过搜索添加
  </div>
</template>

<style scoped>
.checklist-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.checklist-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 8px 10px;
  padding-right: 28px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.15s;
}

.checklist-item:hover {
  border-color: #cbd5e1;
}

.checklist-item:hover .checklist-remove {
  opacity: 1;
}

.checklist-remove {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #c0c9d4;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s;
  padding: 0;
}

.checklist-remove:hover {
  background: #fee2e2;
  color: #ef4444;
}

.checklist-item-name {
  font-size: 12px;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.checklist-item-desc {
  font-size: 10px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.checklist-empty {
  text-align: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 12px;
}
</style>
