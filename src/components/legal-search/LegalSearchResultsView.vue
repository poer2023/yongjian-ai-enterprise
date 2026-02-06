<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchHeader from './SearchHeader.vue';
import FilterSidebar from './FilterSidebar.vue';
import ResultsList from './ResultsList.vue';
import {
  casesFilters,
  regulationsFilters,
  casesFilterSections,
  regulationsFilterSections,
  caseResults,
  regulationResults,
} from '@/mocks/legalSearch';

const route = useRoute();
const router = useRouter();

// Core state
const searchQuery = ref((route.query.q as string) || '缓刑条件');
const currentPage = ref(1);
const totalPages = 10;
const activeTab = ref<'cases' | 'regulations'>('cases');
const searchInResults = ref(false);

// Selected filter states
const selectedFilters = ref<Record<string, string[]>>({});

// Selected results for batch operations
const selectedResults = ref<number[]>([]);

// Computed: current filters based on tab
const currentFilters = computed(() => {
  return activeTab.value === 'cases' ? casesFilters : regulationsFilters;
});

// Computed: filter sections based on tab
const filterSections = computed(() => {
  return activeTab.value === 'cases' ? casesFilterSections : regulationsFilterSections;
});

// Computed: total results
const totalResults = computed(() => 9999);

// Computed: active filter tags for display
const activeFilterTags = computed(() => {
  const tags: Array<{sectionKey: string; sectionLabel: string; filterLabel: string; filterValue: string}> = [];

  for (const section of filterSections.value) {
    const selectedValues = selectedFilters.value[section.key] || [];
    for (const selectedValue of selectedValues) {
      const filters = (currentFilters.value as any)[section.key];
      const filter = filters?.find((f: any) => f.value === selectedValue);
      if (filter) {
        tags.push({
          sectionKey: section.key,
          sectionLabel: section.label,
          filterLabel: filter.label,
          filterValue: selectedValue
        });
      }
    }
  }

  return tags;
});

// Methods
const handleTabChange = (tab: 'cases' | 'regulations') => {
  activeTab.value = tab;
  selectedResults.value = [];
  selectedFilters.value = {};
};

const handleSearch = () => {
  console.log('Searching:', searchQuery.value);
};

const toggleFilter = (sectionKey: string, value: string) => {
  if (!selectedFilters.value[sectionKey]) {
    selectedFilters.value[sectionKey] = [];
  }
  const index = selectedFilters.value[sectionKey].indexOf(value);
  if (index > -1) {
    selectedFilters.value[sectionKey].splice(index, 1);
  } else {
    selectedFilters.value[sectionKey].push(value);
  }
};

const removeFilter = (sectionKey: string, filterValue: string) => {
  if (selectedFilters.value[sectionKey]) {
    const index = selectedFilters.value[sectionKey].indexOf(filterValue);
    if (index > -1) {
      selectedFilters.value[sectionKey].splice(index, 1);
    }
  }
};

const clearAllFilters = () => {
  selectedFilters.value = {};
};

const toggleResultSelection = (id: number) => {
  const index = selectedResults.value.indexOf(id);
  if (index > -1) {
    selectedResults.value.splice(index, 1);
  } else {
    selectedResults.value.push(id);
  }
};

const addToKnowledgeBase = (id: number) => {
  console.log('Adding to knowledge base:', id);
  alert(`已添加到知识库`);
};

const addSelectedToKnowledgeBase = () => {
  console.log('Adding selected to knowledge base:', selectedResults.value);
  alert(`已添加 ${selectedResults.value.length} 个项目到知识库`);
  selectedResults.value = [];
};

const goToDocumentDetail = (id: number) => {
  router.push({ name: 'legal-document-detail', params: { id: id.toString() } });
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page;
  }
};
</script>

<template>
  <div class="search-results-page">
    <!-- Header Area with Tabs -->
    <SearchHeader
      :active-tab="activeTab"
      :search-query="searchQuery"
      :search-in-results="searchInResults"
      @update:active-tab="handleTabChange"
      @update:search-query="searchQuery = $event"
      @update:search-in-results="searchInResults = $event"
      @search="handleSearch"
    />

    <!-- Selected Filters Bar -->
    <div class="selected-filters-bar" v-if="activeFilterTags.length > 0">
      <span class="filter-bar-label">已选:</span>
      <div
        v-for="tag in activeFilterTags"
        :key="`${tag.sectionKey}-${tag.filterValue}`"
        class="selected-filter-tag"
      >
        {{ tag.sectionLabel }}: {{ tag.filterLabel }}
        <button class="tag-remove" @click="removeFilter(tag.sectionKey, tag.filterValue)">×</button>
      </div>
      <button class="clear-all-btn" @click="clearAllFilters">清空</button>
    </div>

    <div class="main-content">
      <!-- Main White Card Container -->
      <div class="content-card">
        <!-- Filter Sidebar -->
        <FilterSidebar
          :active-tab="activeTab"
          :filter-sections="filterSections"
          :filters="currentFilters"
          :selected-filters="selectedFilters"
          @toggle-filter="toggleFilter"
        />

        <!-- Divider -->
        <div class="divider-vertical"></div>

        <!-- Results List -->
        <ResultsList
          :active-tab="activeTab"
          :case-results="caseResults"
          :regulation-results="regulationResults"
          :search-query="searchQuery"
          :selected-results="selectedResults"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-results="totalResults"
          @toggle-selection="toggleResultSelection"
          @add-to-kb="addToKnowledgeBase"
          @add-selected-to-kb="addSelectedToKnowledgeBase"
          @view-detail="goToDocumentDetail"
          @go-to-page="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-results-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f4fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

/* Selected Filters Bar */
.selected-filters-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 40px;
  background: #f0f4fa;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.filter-bar-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.selected-filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #2563eb;
  border-radius: 4px;
  font-size: 13px;
  color: #2563eb;
}

.selected-filter-tag .tag-remove {
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
  line-height: 1;
}

.selected-filter-tag .tag-remove:hover {
  color: #1d4ed8;
}

.clear-all-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-all-btn:hover {
  color: #2563eb;
}

/* Main Layout */
.main-content {
  flex: 1;
  padding: 0 40px;
  overflow: hidden;
  display: flex;
}

/* Content Card */
.content-card {
  flex: 1;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: flex;
  overflow: hidden;
}

/* Divider */
.divider-vertical {
  width: 1px;
  background: linear-gradient(to bottom, transparent, #e2e8f0 10%, #e2e8f0 90%, transparent);
  margin: 20px 0;
}
</style>
