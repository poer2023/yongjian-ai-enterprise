<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, ChevronDown } from 'lucide-vue-next';

interface Props {
  activeTab: 'cases' | 'regulations';
  searchQuery: string;
  searchInResults: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:activeTab', value: 'cases' | 'regulations'): void;
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:searchInResults', value: boolean): void;
  (e: 'search'): void;
}>();

// Search scope options - vary by tab
const searchScope = ref('全文');
const caseScopeOptions = ['全文', '标题', '案号'];
const regulationScopeOptions = ['标题', '全文', '发文字号'];
const searchScopeOptions = computed(() => {
  return props.activeTab === 'cases' ? caseScopeOptions : regulationScopeOptions;
});
const showScopeDropdown = ref(false);

const selectSearchScope = (scope: string) => {
  searchScope.value = scope;
  showScopeDropdown.value = false;
};

const handleTabChange = (tab: 'cases' | 'regulations') => {
  emit('update:activeTab', tab);
  // Reset search scope when tab changes
  searchScope.value = tab === 'cases' ? '全文' : '标题';
};
</script>

<template>
  <header class="page-header">
    <div class="header-content">
      <!-- Tab Navigation -->
      <nav class="tab-navigation">
        <button
          class="tab-item"
          :class="{ active: activeTab === 'cases' }"
          @click="handleTabChange('cases')"
        >
          司法案例
        </button>
        <button
          class="tab-item"
          :class="{ active: activeTab === 'regulations' }"
          @click="handleTabChange('regulations')"
        >
          法律法规
        </button>
      </nav>

      <!-- Search Container -->
      <div class="search-container">
        <!-- Search Scope Dropdown -->
        <div class="search-scope-wrapper" @click="showScopeDropdown = !showScopeDropdown">
          <span class="scope-label">{{ searchScope }}</span>
          <ChevronDown :size="16" class="dropdown-icon" />
          <div v-if="showScopeDropdown" class="scope-dropdown">
            <div
              v-for="option in searchScopeOptions"
              :key="option"
              class="scope-option"
              :class="{ active: searchScope === option }"
              @click.stop="selectSearchScope(option)"
            >
              {{ option }}
            </div>
          </div>
        </div>

        <div class="search-input-wrapper">
          <input
            :value="searchQuery"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            type="text"
            class="search-input"
            :placeholder="`请输入${activeTab === 'cases' ? '司法案例' : '法律法规'}关键词`"
            @keyup.enter="emit('search')"
          />
        </div>

        <button class="search-btn" @click="emit('search')">
          <Search :size="16" />
          <span>搜索</span>
        </button>

        <label class="search-in-results">
          <input
            type="checkbox"
            :checked="searchInResults"
            @change="emit('update:searchInResults', ($event.target as HTMLInputElement).checked)"
          />
          <span>在结果中检索</span>
        </label>
      </div>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  background: #f0f4fa;
  padding: 16px 40px;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 32px;
  border-bottom: none;
}

.tab-item {
  position: relative;
  padding: 8px 4px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #2563eb;
}

.tab-item.active {
  color: #2563eb;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563eb;
  border-radius: 1px;
}

/* Search Container */
.search-container {
  display: flex;
  align-items: center;
  gap: 0;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  max-width: 800px;
}

.search-scope-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-right: 1px solid #e2e8f0;
  cursor: pointer;
  user-select: none;
}

.scope-label {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}

.dropdown-icon {
  color: #94a3b8;
}

.scope-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  min-width: 100px;
}

.scope-option {
  padding: 10px 16px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: background-color 0.2s;
}

.scope-option:first-child {
  border-radius: 8px 8px 0 0;
}

.scope-option:last-child {
  border-radius: 0 0 8px 8px;
}

.scope-option:hover {
  background: #f1f5f9;
}

.scope-option.active {
  color: #2563eb;
  background: #eff6ff;
}

.search-input-wrapper {
  flex: 1;
  padding: 0 12px;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #334155;
  background: transparent;
  padding: 8px 0;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background: #1d4ed8;
}

.search-in-results {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
}

.search-in-results input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
</style>
