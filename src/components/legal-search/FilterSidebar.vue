<script setup lang="ts">
import { computed } from 'vue';
import FilterSection from './components/FilterSection.vue';
import type { FilterSection as FilterSectionType, FilterItem } from '@/mocks/legalSearch';

interface Props {
  activeTab: 'cases' | 'regulations';
  filterSections: FilterSectionType[];
  filters: Record<string, FilterItem[]>;
  selectedFilters: Record<string, string[]>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-filter', sectionKey: string, value: string): void;
}>();

// Handler for filter toggle events from child component
const handleToggleFilter = (sectionKey: string, value: string) => {
  emit('toggle-filter', sectionKey, value);
};

// Check if section has children (for region filters)
const hasChildren = (sectionKey: string) => {
  return sectionKey === 'region' && props.activeTab === 'cases';
};
</script>

<template>
  <aside class="inner-sidebar">
    <FilterSection
      v-for="section in filterSections"
      :key="section.key"
      :section-key="section.key"
      :label="section.label"
      :filters="filters[section.key] || []"
      :selected-filters="selectedFilters"
      :has-children="hasChildren(section.key)"
      @toggle-filter="handleToggleFilter"
    />
  </aside>
</template>

<style scoped>
.inner-sidebar {
  width: 220px;
  padding: 24px;
  background: white;
  flex-shrink: 0;
  overflow-y: auto;
}

/* Scrollbar styling */
.inner-sidebar::-webkit-scrollbar {
  width: 6px;
}

.inner-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.inner-sidebar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.inner-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
