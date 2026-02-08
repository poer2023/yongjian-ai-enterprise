<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Search,
  Bell,
  FileSearch,
  FileText,
  ChevronRight,
  Zap,
  Sparkles,
  ScrollText,
  Calendar
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

// 策略组数据接口
interface PolicyGroup {
  id: string;
  name: string;
  stats: {
    newCount: number;
  };
}

// AI分析洞察接口
interface AIInsight {
  id: number;
  text: string;
  type: 'trend' | 'match' | 'suggestion' | 'alert';
}

// 当前选中的策略组
const activePolicy = ref('all');

// 用户所属的策略组列表
const policyGroups = ref<PolicyGroup[]>([
  {
    id: '1',
    name: '安全业务组',
    stats: { newCount: 12 }
  },
  {
    id: '2',
    name: '等保测评组',
    stats: { newCount: 8 }
  }
]);

// AI分析洞察数据 - 按策略组分类
const insightsByPolicy: Record<string, AIInsight[]> = {
  all: [
    { id: 1, text: '网络安全领域标讯活跃度较昨日上升30%', type: 'trend' },
    { id: 2, text: '发现2个高匹配项目，预算合计128万', type: 'match' },
    { id: 3, text: '本周等保测评类项目呈上升趋势', type: 'trend' },
    { id: 4, text: '建议重点关注XX市政府安全项目', type: 'suggestion' }
  ],
  '1': [
    { id: 1, text: '安全业务组今日新增12条标讯', type: 'trend' },
    { id: 2, text: '发现1个高匹配安全集成项目，预算68万', type: 'match' },
    { id: 3, text: '网络安全服务类招标较上周增长15%', type: 'trend' },
    { id: 4, text: '建议关注某银行网络安全改造项目', type: 'suggestion' }
  ],
  '2': [
    { id: 1, text: '等保测评组今日新增8条标讯', type: 'trend' },
    { id: 2, text: '发现1个等保三级测评项目，预算60万', type: 'match' },
    { id: 3, text: '等保2.0相关项目本月持续增长', type: 'trend' },
    { id: 4, text: '建议重点跟进某医院等保测评项目', type: 'suggestion' }
  ]
};

// 计算当前显示的洞察数据
const currentInsights = computed(() => {
  return insightsByPolicy[activePolicy.value] || insightsByPolicy.all;
});

// 计算属性：当前展示的统计数据
const currentStats = computed(() => {
  if (activePolicy.value === 'all') {
    return policyGroups.value.reduce(
      (acc, group) => ({
        newCount: acc.newCount + group.stats.newCount
      }),
      { newCount: 0 }
    );
  }
  const group = policyGroups.value.find(g => g.id === activePolicy.value);
  return group?.stats || { newCount: 0 };
});

// 智能体卡片 - 使用AgentsView样式
const agentCards = [
  {
    icon: FileSearch,
    name: 'AI解读',
    description: 'AI智能分析招标文件关键信息',
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-analysis-form'
  },
  {
    icon: FileText,
    name: 'AI标书生成',
    description: '一键生成专业标书',
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-doc-smart-form'
  },
  {
    icon: Bell,
    name: '订阅配置',
    description: '配置关键词和地区监控',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    routeName: 'team',
    query: { menu: 'bid-subscription' }
  }
];

// 热门搜索标签
const hotTags = ['网络安全', '等保测评', '渗透测试', '密评服务', '安全运维'];

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const handleSearch = () => {
  // Demo: always navigate to bid-info-daily page
  router.push({ name: 'bid-info-daily' });
};

const handleTagClick = (tag: string) => {
  searchQuery.value = tag;
  handleSearch();
};
</script>

<template>
  <div class="bid-search-page">
    <div class="page-container">
      <!-- Hero 搜索区 -->
      <section class="hero-section">
      <h1 class="hero-title">标讯搜索</h1>
      <div class="search-wrapper">
        <div class="search-box">
          <Search :size="20" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索招标项目、关键词、地区..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
        <div class="quick-tags">
          <span class="tags-label">热门：</span>
          <span
            v-for="tag in hotTags"
            :key="tag"
            class="hot-tag"
            @click="handleTagClick(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<style scoped>
.bid-search-page {
  min-height: 100%;
  height: 100%;
  background: #f8fafc;
  padding: 0 24px 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 内容容器 - 限制最大宽度并居中 */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: calc(38.2vh - 100px);
}

/* Hero 搜索区 */
.hero-section {
  text-align: center;
  padding: 48px 0 40px;
  background: #f8fafc;
  margin-bottom: 32px;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.hero-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 32px 0;
}

.search-wrapper {
  max-width: 720px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 12px 8px 20px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 14px 16px;
  font-size: 16px;
  color: #334155;
  background: transparent;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.quick-tags {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 13px;
  color: #64748b;
}

.hot-tag {
  font-size: 13px;
  color: #3b82f6;
  padding: 4px 12px;
  background: #dbeafe;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.hot-tag:hover {
  background: #bfdbfe;
}

/* 双栏卡片区 */
.content-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
  margin-bottom: 32px;
}

.subscription-card,
.agents-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.subscription-card {
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* 策略组 Tab 切换 */
.policy-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.policy-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.policy-tab:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.policy-tab.active {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #3b82f6;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #3b82f6;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
}

.policy-tab.active .tab-badge {
  background: #3b82f6;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  color: #3b82f6;
}

.agents-icon {
  background: #fef3c7;
  color: #d97706;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.config-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.config-btn:hover {
  background: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

/* 统计数据行 */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.stat-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

/* 订阅关键词标签 */
.subscription-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tags-title {
  font-size: 13px;
  color: #64748b;
}

.keyword-tag {
  font-size: 13px;
  color: #3b82f6;
  padding: 4px 12px;
  background: #dbeafe;
  border-radius: 6px;
  font-weight: 500;
}

/* 智能体网格 - AgentsView样式 */
.agents-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agent-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.agent-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #dbeafe;
}

.agent-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.agent-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.agent-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* AI分析汇总区块 */
.ai-summary-section {
  /* No top margin or border */
}

.ai-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.ai-summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.sparkles-icon {
  color: #3b82f6;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.daily-report-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.daily-report-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #3b82f6;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 10px;
  border: 1px solid #93c5fd;
}

.insight-bullet {
  color: #3b82f6;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.4;
}

.insight-text {
  font-size: 14px;
  color: #1e293b;
  line-height: 1.5;
}

/* 响应式 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .bid-search-page {
    padding: 0 20px 20px;
  }

  .hero-section {
    margin: 0 -20px 24px;
    padding: 32px 20px;
  }

  .hero-title {
    font-size: 24px;
  }

  .stats-row {
    flex-wrap: wrap;
    gap: 16px;
  }

  .stat-divider {
    display: none;
  }

  .stat-item {
    flex: 0 0 calc(50% - 8px);
  }

  .bid-card {
    min-width: 240px;
    max-width: 240px;
  }
}
</style>
