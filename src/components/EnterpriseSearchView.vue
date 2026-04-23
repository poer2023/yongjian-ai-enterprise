<script setup lang="ts">
import { computed, ref } from 'vue';
import { PencilLine, Plus, Search, X } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

type FilterOption = {
  value: string;
  label: string;
};

const router = useRouter();

const searchQuery = ref('');
const isRegionCollapsed = ref(false);
const isSubscriptionEditMode = ref(false);
const isSubscriptionModalOpen = ref(false);
const subscriptionDraft = ref('');

const activeInfoType = ref('all');
const activeRegion = ref('all');
const activeTimeRange = ref('all');
const activeSearchMode = ref('exact');

const subscriptionWords = ref([
  '等保测评',
  '信息安全服务',
  '网络安全运维',
  '渗透测试',
  '数据安全评估'
]);
const selectedSubscriptionWords = ref<string[]>(['等保测评', '信息安全服务']);

const infoTypes: FilterOption[] = [
  { value: 'all', label: '全部' },
  { value: 'tender', label: '招标公告' },
  { value: 'pretender', label: '招标预告' },
  { value: 'change', label: '变更公告' },
  { value: 'result', label: '中标公告' },
  { value: 'purchase', label: '采购公告' },
  { value: 'cancel', label: '废标公告' }
];

const regions: FilterOption[] = [
  { value: 'all', label: '全国' },
  { value: 'beijing', label: '北京' },
  { value: 'tianjin', label: '天津' },
  { value: 'shanghai', label: '上海' },
  { value: 'chongqing', label: '重庆' },
  { value: 'hebei', label: '河北' },
  { value: 'shanxi', label: '山西' },
  { value: 'liaoning', label: '辽宁' },
  { value: 'jilin', label: '吉林' },
  { value: 'heilongjiang', label: '黑龙江' },
  { value: 'jiangsu', label: '江苏' },
  { value: 'zhejiang', label: '浙江' },
  { value: 'anhui', label: '安徽' },
  { value: 'fujian', label: '福建' },
  { value: 'jiangxi', label: '江西' },
  { value: 'shandong', label: '山东' },
  { value: 'henan', label: '河南' },
  { value: 'hubei', label: '湖北' },
  { value: 'hunan', label: '湖南' },
  { value: 'guangdong', label: '广东' },
  { value: 'hainan', label: '海南' },
  { value: 'sichuan', label: '四川' },
  { value: 'guizhou', label: '贵州' },
  { value: 'yunnan', label: '云南' },
  { value: 'shaanxi', label: '陕西' },
  { value: 'gansu', label: '甘肃' },
  { value: 'qinghai', label: '青海' },
  { value: 'guangxi', label: '广西' },
  { value: 'xizang', label: '西藏' },
  { value: 'ningxia', label: '宁夏' },
  { value: 'xinjiang', label: '新疆' },
  { value: 'inner-mongolia', label: '内蒙古' }
];

const timeRanges: FilterOption[] = [
  { value: 'all', label: '不限' },
  { value: '3d', label: '近3天' },
  { value: '1w', label: '近一周' },
  { value: '1m', label: '近一月' },
  { value: '3m', label: '近三月' },
  { value: '6m', label: '近半年' }
];

const searchModes = [
  { value: 'exact', label: '精确检索', desc: '完全匹配关键词' },
  { value: 'fuzzy', label: '模糊检索', desc: '智能分词匹配' },
];

const visibleRegions = computed(() => {
  if (!isRegionCollapsed.value) {
    return regions;
  }
  return regions.slice(0, 10);
});

const toggleRegionCollapse = () => {
  isRegionCollapsed.value = !isRegionCollapsed.value;
};

const isSelected = (currentValue: string, optionValue: string) => currentValue === optionValue;

const getChipStyle = (isActive: boolean) => ({
  padding: isActive ? '4px 12px' : '4px 10px',
  backgroundColor: isActive ? '#dcebff' : 'transparent',
  color: isActive ? '#3f70f6' : '#6c84a8',
  fontWeight: isActive ? '600' : '500'
});

const syncSearchQueryFromSubscriptions = () => {
  searchQuery.value = selectedSubscriptionWords.value.join(' ');
};

const toggleSubscriptionWord = (word: string) => {
  if (selectedSubscriptionWords.value.includes(word)) {
    selectedSubscriptionWords.value = selectedSubscriptionWords.value.filter(item => item !== word);
  } else {
    selectedSubscriptionWords.value = [...selectedSubscriptionWords.value, word];
  }
  syncSearchQueryFromSubscriptions();
};

const normalizeWords = (value: string) =>
  value
    .split(/[，,]+/)
    .map(item => item.trim())
    .filter(Boolean);

const appendSubscriptionWords = () => {
  const nextWords = normalizeWords(subscriptionDraft.value);
  if (!nextWords.length) {
    return;
  }

  nextWords.forEach(word => {
    if (!subscriptionWords.value.includes(word)) {
      subscriptionWords.value.push(word);
    }
    if (!selectedSubscriptionWords.value.includes(word)) {
      selectedSubscriptionWords.value.push(word);
    }
  });

  subscriptionDraft.value = '';
  syncSearchQueryFromSubscriptions();
};

const removeSubscriptionWord = (word: string) => {
  subscriptionWords.value = subscriptionWords.value.filter(item => item !== word);
  selectedSubscriptionWords.value = selectedSubscriptionWords.value.filter(item => item !== word);
  syncSearchQueryFromSubscriptions();
};

const openAddSubscription = () => {
  isSubscriptionModalOpen.value = true;
};

const toggleSubscriptionEditor = () => {
  isSubscriptionEditMode.value = !isSubscriptionEditMode.value;
};

const closeSubscriptionModal = () => {
  isSubscriptionModalOpen.value = false;
  subscriptionDraft.value = '';
};

const confirmAddSubscriptionWords = () => {
  appendSubscriptionWords();
  if (!subscriptionDraft.value.trim()) {
    return;
  }
};

const submitSubscriptionModal = () => {
  const hasDraft = normalizeWords(subscriptionDraft.value).length > 0;
  appendSubscriptionWords();
  if (hasDraft) {
    closeSubscriptionModal();
  }
};

syncSearchQueryFromSubscriptions();

const handleSearch = () => {
  router.push({ name: 'bid-info-daily' });
};
</script>

<template>
  <div class="bid-search-page">
    <div class="page-container">
      <section class="hero-section">
        <h1 class="hero-title">标讯搜索</h1>

        <div class="search-wrapper">
          <div class="search-box">
            <Search :size="22" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="输入项目名称、招标单位、关键词..."
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">搜索</button>
          </div>

          <div class="advanced-filters">
            <div class="filter-row subscription-row">
              <span class="filter-label">订阅词</span>
              <div class="subscription-content">
                <div class="subscription-main">
                  <div class="filter-options subscription-options">
                    <button
                      v-for="word in subscriptionWords"
                      :key="word"
                      type="button"
                      :class="[
                        'filter-chip',
                        'subscription-chip',
                        { 'subscription-chip-editing': isSubscriptionEditMode }
                      ]"
                      :style="getChipStyle(selectedSubscriptionWords.includes(word))"
                      @click="!isSubscriptionEditMode && toggleSubscriptionWord(word)"
                    >
                      {{ word }}
                      <span
                        v-if="isSubscriptionEditMode"
                        class="subscription-chip-delete"
                        @click.stop="removeSubscriptionWord(word)"
                      >
                        <X :size="12" />
                      </span>
                    </button>
                  </div>
                  <div class="subscription-actions">
                    <button type="button" class="action-btn" @click="openAddSubscription">
                      <Plus :size="14" />
                      <span>新增</span>
                    </button>
                    <button type="button" class="action-btn" @click="toggleSubscriptionEditor">
                      <PencilLine :size="14" />
                      <span>{{ isSubscriptionEditMode ? '完成' : '编辑' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="filter-row">
              <span class="filter-label">类型</span>
              <div class="filter-options">
                <button
                  v-for="item in infoTypes"
                  :key="item.value"
                  type="button"
                  :class="['filter-chip', { active: isSelected(activeInfoType, item.value) }]"
                  :style="getChipStyle(isSelected(activeInfoType, item.value))"
                  @click="activeInfoType = item.value"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <div class="filter-row region-row">
              <span class="filter-label">地区</span>
              <div class="filter-region-content">
                <div class="filter-options filter-options-region">
                  <button
                    v-for="item in visibleRegions"
                    :key="item.value"
                    type="button"
                    :class="['filter-chip', { active: isSelected(activeRegion, item.value) }]"
                    :style="getChipStyle(isSelected(activeRegion, item.value))"
                    @click="activeRegion = item.value"
                  >
                    {{ item.label }}
                  </button>
                </div>
                <button type="button" class="region-toggle" @click="toggleRegionCollapse">
                  {{ isRegionCollapsed ? '展开 ▼' : '收起 ▲' }}
                </button>
              </div>
            </div>

            <div class="filter-row">
              <span class="filter-label">时间</span>
              <div class="filter-options">
                <button
                  v-for="item in timeRanges"
                  :key="item.value"
                  type="button"
                  :class="['filter-chip', { active: isSelected(activeTimeRange, item.value) }]"
                  :style="getChipStyle(isSelected(activeTimeRange, item.value))"
                  @click="activeTimeRange = item.value"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <div class="filter-row">
              <span class="filter-label">搜索模式</span>
              <div class="filter-options">
                <button
                  v-for="item in searchModes"
                  :key="item.value"
                  type="button"
                  :class="['filter-chip', 'mode-chip', { active: isSelected(activeSearchMode, item.value) }]"
                  :style="getChipStyle(isSelected(activeSearchMode, item.value))"
                  @click="activeSearchMode = item.value"
                >
                  <span>{{ item.label }}</span>
                  <span class="mode-desc">{{ item.desc }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div v-if="isSubscriptionModalOpen" class="subscription-modal-mask" @click.self="closeSubscriptionModal">
        <div class="subscription-modal">
          <div class="subscription-modal-header">
            <h3>新增订阅词</h3>
            <button type="button" class="subscription-modal-close" @click="closeSubscriptionModal">
              <X :size="16" />
            </button>
          </div>
          <p class="subscription-modal-tip">支持输入多个词，使用中文或英文逗号自动分词。</p>
          <input
            v-model="subscriptionDraft"
            type="text"
            class="subscription-modal-input"
            placeholder="例如：等保测评，渗透测试，数据安全评估"
            @keyup.enter="submitSubscriptionModal"
          />
          <div class="subscription-modal-actions">
            <button type="button" class="subscription-modal-cancel" @click="closeSubscriptionModal">取消</button>
            <button type="button" class="subscription-modal-confirm" @click="submitSubscriptionModal">确定新增</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bid-search-page {
  min-height: 100%;
  background: #f3f6fb;
  padding: 0 24px 48px;
  overflow-y: auto;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
}

.hero-section {
  padding: 72px 0 40px;
}

.hero-title {
  margin: 0 0 26px;
  text-align: center;
  font-size: 36px;
  line-height: 1.2;
  font-weight: 700;
  color: #243b5d;
  letter-spacing: 1px;
}

.search-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 10px 18px;
  background: #ffffff;
  border: 1px solid #cfdcf1;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
}

.search-box:focus-within {
  border-color: #4a7cff;
  box-shadow: 0 0 0 4px rgba(74, 124, 255, 0.08);
}

.search-icon {
  color: #6b7280;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 14px 0;
  font-size: 16px;
  color: #324968;
}

.search-input::placeholder {
  color: #a0b4d2;
}

.search-btn {
  flex-shrink: 0;
  min-width: 94px;
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #4b7dff 0%, #3267f6 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.advanced-filters {
  margin-top: 18px;
  background: #ffffff;
  border: 1px solid #cfdcf1;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 18px 22px;
  border-bottom: 1px solid #e7eef9;
}

.filter-row:last-child {
  border-bottom: none;
}

.filter-label {
  width: 64px;
  flex-shrink: 0;
  padding-top: 4px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  color: #4f6789;
}

.filter-options {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.subscription-row {
  align-items: flex-start;
}

.subscription-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
}

.subscription-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.subscription-options {
  gap: 10px 14px;
}

.subscription-chip {
  gap: 6px;
}

.subscription-chip-editing {
  cursor: default;
}

.subscription-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: #f6f9ff;
  border: 1px solid #d6e3fb;
  border-radius: 10px;
  color: #4b78ff;
  font-size: 14px;
  font-weight: 600;
}

.subscription-chip-delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: inherit;
}

.filter-region-content {
  display: flex;
  flex: 1;
  gap: 16px;
  align-items: flex-start;
}

.filter-options-region {
  gap: 12px 18px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border: none;
  background: transparent;
  border-radius: 10px;
  color: #6c84a8;
  font-size: 15px;
  line-height: 1.6;
  cursor: pointer;
  white-space: nowrap;
}

.filter-chip:hover {
  color: #3f70f6;
}

.filter-chip.active {
  padding: 4px 12px;
  background: #dcebff;
  color: #3f70f6;
  font-weight: 600;
}

.mode-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mode-desc {
  font-size: 13px;
  color: #9bb0d0;
}

.mode-chip.active .mode-desc {
  color: #7d9df7;
}

.subscription-modal-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.26);
  z-index: 30;
}

.subscription-modal {
  width: 100%;
  max-width: 520px;
  padding: 22px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.subscription-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.subscription-modal-header h3 {
  font-size: 20px;
  color: #243b5d;
}

.subscription-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #f3f6fb;
  color: #6c84a8;
}

.subscription-modal-tip {
  margin-top: 10px;
  font-size: 14px;
  color: #7a8daa;
  line-height: 1.6;
}

.subscription-modal-input {
  width: 100%;
  margin-top: 16px;
  padding: 13px 16px;
  border: 1px solid #d6e3fb;
  border-radius: 14px;
  background: #fbfdff;
  font-size: 14px;
  color: #324968;
}

.subscription-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.subscription-modal-cancel,
.subscription-modal-confirm {
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
}

.subscription-modal-cancel {
  background: #f3f6fb;
  color: #5f7395;
}

.subscription-modal-confirm {
  background: #4b78ff;
  color: #ffffff;
}

.region-toggle {
  flex-shrink: 0;
  padding: 2px 0 0;
  border: none;
  background: transparent;
  color: #4b78ff;
  font-size: 14px;
  line-height: 1.6;
  cursor: pointer;
}

@media (max-width: 768px) {
  .bid-search-page {
    padding: 0 16px 32px;
  }

  .hero-section {
    padding: 40px 0 24px;
  }

  .hero-title {
    margin-bottom: 20px;
    font-size: 30px;
  }

  .search-box {
    flex-wrap: wrap;
    padding: 14px 14px 16px;
  }

  .search-input {
    width: calc(100% - 34px);
    padding: 8px 0;
  }

  .search-btn {
    width: 100%;
  }

  .filter-row {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .filter-label {
    width: auto;
    padding-top: 0;
  }

  .filter-region-content {
    flex-direction: column;
    gap: 10px;
  }

  .subscription-main {
    flex-direction: column;
  }

  .subscription-actions {
    flex-wrap: wrap;
  }
}
</style>
