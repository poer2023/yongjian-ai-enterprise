<script setup lang="ts">
import { ref, watch } from 'vue';
import { Check } from 'lucide-vue-next';
import { provinces } from '../../mocks/salarySurvey';

interface Props {
  modelValue: string[];
  nationalLabel?: string;
  nationalDesc?: string;
  regionalLabel?: string;
  regionalDesc?: string;
  selectorLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  nationalLabel: '全国范围',
  nationalDesc: '采集全国各地区数据',
  regionalLabel: '指定地区',
  regionalDesc: '选择特定省市进行对比分析',
  selectorLabel: '选择对比地区',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

// Use a separate ref so clicking "指定地区" always expands the grid
const isRegional = ref(
  props.modelValue.length > 0 &&
  !(props.modelValue.length === 1 && props.modelValue[0] === '全国')
);

// Sync when parent changes modelValue externally
watch(() => props.modelValue, (val) => {
  const isNat = val.length === 0 || (val.length === 1 && val[0] === '全国');
  // Only collapse back to national if parent explicitly sets it
  if (isNat && !isRegional.value) return;
  if (!isNat) isRegional.value = true;
}, { deep: true });

const setNational = () => {
  isRegional.value = false;
  emit('update:modelValue', ['全国']);
};

const setRegional = () => {
  isRegional.value = true;
  // Keep existing selections if they're real provinces, otherwise start empty
  const current = props.modelValue.filter(r => r !== '全国');
  if (current.length === 0) {
    // Don't emit yet, just show the grid. modelValue stays as-is until user picks.
  }
};

const toggleRegion = (region: string) => {
  const current = props.modelValue.filter(r => r !== '全国');
  const idx = current.indexOf(region);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(region);
  }
  if (current.length === 0) {
    // All deselected, switch back to national
    isRegional.value = false;
    emit('update:modelValue', ['全国']);
  } else {
    emit('update:modelValue', current);
  }
};

const isRegionSelected = (region: string) => {
  return props.modelValue.includes(region);
};

const selectAllRegions = () => {
  const current = props.modelValue.filter(r => r !== '全国');
  if (current.length === provinces.length) {
    emit('update:modelValue', [...provinces]); // keep regional, just toggle
  } else {
    emit('update:modelValue', [...provinces]);
  }
};

const deselectAllRegions = () => {
  isRegional.value = false;
  emit('update:modelValue', ['全国']);
};

const selectedCount = props.modelValue.filter(r => r !== '全国').length;
</script>

<template>
  <div class="region-selector-component">
    <!-- Scope type toggle -->
    <div class="scope-options">
      <div class="radio-card" :class="{ active: !isRegional }" @click="setNational">
        <div class="radio-content">
          <span class="radio-title">{{ nationalLabel }}</span>
          <span class="radio-desc">{{ nationalDesc }}</span>
        </div>
        <Check v-if="!isRegional" :size="18" class="check-icon" />
      </div>

      <div class="radio-card" :class="{ active: isRegional }" @click="setRegional">
        <div class="radio-content">
          <span class="radio-title">{{ regionalLabel }}</span>
          <span class="radio-desc">{{ regionalDesc }}</span>
        </div>
        <Check v-if="isRegional" :size="18" class="check-icon" />
      </div>
    </div>

    <!-- Region grid selector -->
    <div v-if="isRegional" class="region-selector">
      <div class="region-header">
        <div class="region-header-left">
          <span class="region-label">{{ selectorLabel }}</span>
          <span v-if="modelValue.filter(r => r !== '全国').length" class="region-count">{{ modelValue.filter(r => r !== '全国').length }}</span>
        </div>
        <button class="select-all-btn" @click="modelValue.filter(r => r !== '全国').length === provinces.length ? deselectAllRegions() : selectAllRegions()">
          {{ modelValue.filter(r => r !== '全国').length === provinces.length ? '取消全选' : '全选' }}
        </button>
      </div>
      <div class="region-grid">
        <button
          v-for="region in provinces"
          :key="region"
          class="region-tag"
          :class="{ selected: isRegionSelected(region) }"
          @click="toggleRegion(region)"
        >
          {{ region }}
          <Check v-if="isRegionSelected(region)" :size="12" />
        </button>
      </div>
      <p class="region-hint">已选择 {{ modelValue.filter(r => r !== '全国').length }} 个地区</p>
    </div>
  </div>
</template>

<style scoped>
.scope-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.radio-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-card:hover {
  border-color: #cbd5e1;
}

.radio-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.radio-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.radio-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.radio-desc {
  font-size: 12px;
  color: #64748b;
}

.check-icon {
  color: #2563eb;
}

/* Region Selector */
.region-selector {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.region-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.region-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.region-label {
  font-size: 13px;
  color: #64748b;
}

.region-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #2563eb;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
}

.select-all-btn {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.region-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.region-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.region-tag:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.region-tag.selected {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.region-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 12px 0 0 0;
}
</style>
