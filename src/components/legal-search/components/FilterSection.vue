<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';
import type { FilterItem } from '@/mocks/legalSearch';

interface Props {
  sectionKey: string;
  label: string;
  filters: FilterItem[];
  selectedFilters: Record<string, string[]>;
  hasChildren?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-filter', sectionKey: string, value: string): void;
}>();

// Collapsed state
const isCollapsed = ref(false);

// Region expand states
const expandedRegions = ref<Record<string, boolean>>({});

const toggleSection = () => {
  isCollapsed.value = !isCollapsed.value;
};

const toggleRegionExpand = (regionValue: string) => {
  expandedRegions.value[regionValue] = !expandedRegions.value[regionValue];
};

const isRegionExpanded = (regionValue: string) => {
  return expandedRegions.value[regionValue] || false;
};

const isFilterSelected = (value: string) => {
  return props.selectedFilters[props.sectionKey]?.includes(value) ?? false;
};

const handleToggle = (value: string) => {
  emit('toggle-filter', props.sectionKey, value);
};
</script>

<template>
  <div class="sidebar-section">
    <div class="section-title" @click="toggleSection">
      <component
        :is="isCollapsed ? ChevronRight : ChevronDown"
        :size="16"
        class="collapse-icon"
      />
      <span class="section-label">{{ label }}</span>
    </div>
    <div v-show="!isCollapsed" class="filter-group">
      <template v-for="filter in filters" :key="filter.value">
        <label
          class="filter-item"
          :class="{ active: isFilterSelected(filter.value) }"
        >
          <input
            type="checkbox"
            :checked="isFilterSelected(filter.value)"
            @change="handleToggle(filter.value)"
            class="filter-checkbox"
          />
          <span class="filter-label">{{ filter.label }} ({{ filter.count }})</span>
          <ChevronDown
            v-if="hasChildren && filter.children"
            :size="14"
            class="region-expand-icon"
            :class="{ expanded: isRegionExpanded(filter.value) }"
            @click.prevent.stop="toggleRegionExpand(filter.value)"
          />
        </label>
        <!-- Child filters -->
        <div
          v-if="hasChildren && filter.children && isRegionExpanded(filter.value)"
          class="sub-filter-group"
        >
          <label
            v-for="child in filter.children"
            :key="child.value"
            class="filter-item sub-item"
            :class="{ active: isFilterSelected(child.value) }"
          >
            <input
              type="checkbox"
              :checked="isFilterSelected(child.value)"
              @change="handleToggle(child.value)"
              class="filter-checkbox"
            />
            <span class="filter-label">{{ child.label }} ({{ child.count }})</span>
          </label>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.sidebar-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.section-title:hover {
  color: #2563eb;
}

.section-label {
  font-weight: 600;
}

.collapse-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 4px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  padding: 3px 0;
  transition: color 0.2s;
}

.filter-item:hover {
  color: #2563eb;
}

.filter-item.active {
  color: #2563eb;
  font-weight: 500;
}

.filter-checkbox {
  width: 14px;
  height: 14px;
  accent-color: #2563eb;
  cursor: pointer;
  flex-shrink: 0;
}

.region-expand-icon {
  color: #94a3b8;
  margin-left: auto;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.region-expand-icon.expanded {
  transform: rotate(180deg);
}

.filter-item:hover .region-expand-icon {
  color: #2563eb;
}

.sub-filter-group {
  margin-left: 20px;
  padding-left: 12px;
  border-left: 2px solid #e2e8f0;
}

.filter-item.sub-item {
  font-size: 12px;
  color: #64748b;
}

.filter-label {
  flex: 1;
}
</style>
