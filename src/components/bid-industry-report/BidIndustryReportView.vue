<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ChevronLeft,
  ChevronDown,
  BarChart3,
  Download,
  Users,
  Building2,
  DollarSign,
  MapPin,
  PieChart,
  Factory,
  Plus,
  X,
  Search,
  Upload,
  Trash2
} from 'lucide-vue-next';
import {
  marketAnalysis,
  competitorData,
  selfBusinessData,
  priceAnalysis,
  regionAnalysis,
  customerAnalysis,
  dimensionInsights,
  industryOptions,
  configuredCompetitors as defaultCompetitors,
  competitorSearchResults
} from '../../mocks/bidIndustryReport';
import type { CompetitorCompany } from '../../mocks/bidIndustryReport';

const router = useRouter();

// Time range selector
const timeRanges = ['本周', '本月', '本季度', '本年度'];
const selectedTimeRange = ref('本季度');

// Navigation dimensions - 6 core dimensions (all from bid data)
const dimensions = [
  { id: 'market', name: '市场概况', icon: BarChart3 },
  { id: 'competitor', name: '竞争格局', icon: Users },
  { id: 'self', name: '我的表现', icon: Building2 },
  { id: 'price', name: '价格分布', icon: DollarSign },
  { id: 'region', name: '区域分布', icon: MapPin },
  { id: 'customer', name: '客户构成', icon: PieChart },
];

const activeDimension = ref('market');

// Industry & Competitor configuration
const selectedIndustry = ref('cyber-security');
const showIndustryDropdown = ref(false);
const competitors = ref<CompetitorCompany[]>([...defaultCompetitors]);
const showAddCompetitorModal = ref(false);
const competitorSearchQuery = ref('');
const selectedSearchResults = ref<string[]>([]);

const currentIndustry = computed(() => {
  return industryOptions.find(i => i.id === selectedIndustry.value);
});

const selectIndustry = (id: string) => {
  selectedIndustry.value = id;
  showIndustryDropdown.value = false;
};

const removeCompetitor = (id: string) => {
  competitors.value = competitors.value.filter(c => c.id !== id);
};

const filteredSearchResults = computed(() => {
  const existingIds = new Set(competitors.value.map(c => c.id));
  let results = competitorSearchResults.filter(r => !existingIds.has(r.id));
  if (competitorSearchQuery.value) {
    const query = competitorSearchQuery.value.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.industry.toLowerCase().includes(query) ||
      r.region.toLowerCase().includes(query)
    );
  }
  return results;
});

const toggleSearchResult = (id: string) => {
  const idx = selectedSearchResults.value.indexOf(id);
  if (idx >= 0) {
    selectedSearchResults.value.splice(idx, 1);
  } else {
    selectedSearchResults.value.push(id);
  }
};

const confirmAddCompetitors = () => {
  const newCompetitors = competitorSearchResults
    .filter(r => selectedSearchResults.value.includes(r.id))
    .map(r => ({
      id: r.id,
      name: r.name,
      industry: r.industry,
      region: r.region,
      addedAt: new Date().toISOString().slice(0, 10),
    }));
  competitors.value.push(...newCompetitors);
  selectedSearchResults.value = [];
  competitorSearchQuery.value = '';
  showAddCompetitorModal.value = false;
};

const openAddModal = () => {
  selectedSearchResults.value = [];
  competitorSearchQuery.value = '';
  showAddCompetitorModal.value = true;
};

const goBack = () => {
  router.push({ name: 'bid-subscription' });
};

const handleExport = () => {
  alert('行业分析报告已导出为PDF');
};

const getIntensityClass = (intensity: string) => {
  return `intensity-${intensity}`;
};

const getIntensityLabel = (intensity: string) => {
  const labels: Record<string, string> = { high: '激烈', medium: '中等', low: '较低' };
  return labels[intensity] || intensity;
};

// Calculate max values for chart scaling
const maxMarketValue = Math.max(...marketAnalysis.monthlyTrend.map(m => m.value));
const maxCompetitorBid = Math.max(...competitorData.map(c => c.bidCount));
const maxPriceCount = Math.max(...priceAnalysis.priceDistribution.map(p => p.count));
const maxRegionSize = Math.max(...regionAnalysis.map(r => r.marketSize));
</script>

<template>
  <div class="report-page">
    <!-- Header -->
    <div class="report-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回</span>
      </button>
      <div class="header-title">
        <BarChart3 :size="20" />
        <h1>行业分析报告</h1>
      </div>
      <div class="header-controls">
        <div class="time-selector">
          <button
            v-for="range in timeRanges"
            :key="range"
            :class="['time-btn', { active: selectedTimeRange === range }]"
            @click="selectedTimeRange = range"
          >
            {{ range }}
          </button>
        </div>
        <button class="action-btn" @click="handleExport">
          <Download :size="16" />
          导出报告
        </button>
      </div>
    </div>

    <div class="report-content">
      <!-- Left Navigation -->
      <div class="nav-panel">
        <!-- Industry Configuration -->
        <div class="config-section">
          <div class="config-label">
            <Factory :size="14" />
            <span>关注行业</span>
          </div>
          <div class="industry-dropdown-wrapper">
            <button class="industry-dropdown-trigger" @click="showIndustryDropdown = !showIndustryDropdown">
              <span class="industry-name">{{ currentIndustry?.name }}</span>
              <ChevronDown :size="14" :class="{ 'rotate': showIndustryDropdown }" />
            </button>
            <div v-if="showIndustryDropdown" class="industry-dropdown-menu">
              <div
                v-for="opt in industryOptions"
                :key="opt.id"
                :class="['industry-dropdown-item', { active: selectedIndustry === opt.id }]"
                @click="selectIndustry(opt.id)"
              >
                <span class="ind-name">{{ opt.name }}</span>
                <span class="ind-desc">{{ opt.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Competitor Configuration -->
        <div class="config-section">
          <div class="config-label">
            <Users :size="14" />
            <span>竞品企业</span>
            <span class="competitor-count">{{ competitors.length }}</span>
          </div>
          <div class="competitor-list">
            <div v-for="comp in competitors" :key="comp.id" class="competitor-item">
              <div class="comp-info">
                <span class="comp-name">{{ comp.name }}</span>
                <span class="comp-region">{{ comp.region }}</span>
              </div>
              <button class="comp-remove-btn" @click="removeCompetitor(comp.id)" title="移除">
                <X :size="12" />
              </button>
            </div>
          </div>
          <button class="add-competitor-btn" @click="openAddModal">
            <Plus :size="14" />
            添加竞品企业
          </button>
        </div>

        <div class="config-divider"></div>

        <div class="nav-title">分析维度</div>
        <div class="nav-list">
          <div
            v-for="dim in dimensions"
            :key="dim.id"
            :class="['nav-item', { active: activeDimension === dim.id }]"
            @click="activeDimension = dim.id"
          >
            <component :is="dim.icon" :size="16" />
            <span>{{ dim.name }}</span>
          </div>
        </div>
      </div>

      <!-- Right Content -->
      <div class="content-panel">
        <!-- Market Overview -->
        <div v-if="activeDimension === 'market'" class="dimension-content">
          <h2 class="dimension-title">
            <BarChart3 :size="20" />
            市场概况
          </h2>

          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-value">{{ marketAnalysis.totalMarketSize }}</span>
              <span class="metric-unit">亿元</span>
              <span class="metric-label">市场规模</span>
            </div>
            <div class="metric-card highlight">
              <span class="metric-value">{{ marketAnalysis.growthRate }}%</span>
              <span class="metric-label">年增长率</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ marketAnalysis.projectCount }}</span>
              <span class="metric-label">项目数量</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ marketAnalysis.avgProjectValue }}</span>
              <span class="metric-unit">万</span>
              <span class="metric-label">平均项目金额</span>
            </div>
          </div>

          <div class="chart-section">
            <h3 class="chart-title">市场规模趋势（月度）</h3>
            <div class="bar-chart">
              <div class="chart-bars">
                <div v-for="item in marketAnalysis.monthlyTrend" :key="item.month" class="chart-bar-wrapper">
                  <div class="chart-bar" :style="{ height: (item.value / maxMarketValue * 100) + '%' }">
                    <span class="bar-value">{{ item.value }}亿</span>
                  </div>
                  <span class="bar-label">{{ item.month.slice(5) }}月</span>
                </div>
              </div>
            </div>
          </div>

          <div class="insights-section">
            <h3 class="insights-title">关键洞察</h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in dimensionInsights.market" :key="idx">{{ insight }}</li>
            </ul>
          </div>
        </div>

        <!-- Competitor Analysis -->
        <div v-if="activeDimension === 'competitor'" class="dimension-content">
          <h2 class="dimension-title">
            <Users :size="20" />
            竞争格局
          </h2>

          <div class="data-table">
            <div class="table-header">
              <span class="col-name">公司名称</span>
              <span class="col-num">投标次数</span>
              <span class="col-num">中标次数</span>
              <span class="col-num">中标率</span>
              <span class="col-num">中标金额</span>
            </div>
            <div
              v-for="comp in competitorData"
              :key="comp.name"
              :class="['table-row', { 'self-row': comp.name === '本公司' }]"
            >
              <span class="col-name">{{ comp.name }}</span>
              <span class="col-num">{{ comp.bidCount }}</span>
              <span class="col-num">{{ comp.winCount }}</span>
              <span class="col-num">{{ comp.winRate }}%</span>
              <span class="col-num">{{ comp.totalAmount }}万</span>
            </div>
          </div>

          <div class="chart-section">
            <h3 class="chart-title">投标/中标数量对比</h3>
            <div class="horizontal-chart">
              <div v-for="comp in competitorData" :key="comp.name" class="h-chart-row">
                <span class="h-chart-label">{{ comp.name.slice(0, 6) }}</span>
                <div class="h-chart-bars">
                  <div class="h-bar bid" :style="{ width: (comp.bidCount / maxCompetitorBid * 100) + '%' }">
                    <span>{{ comp.bidCount }}</span>
                  </div>
                  <div class="h-bar win" :style="{ width: (comp.winCount / maxCompetitorBid * 100) + '%' }">
                    <span>{{ comp.winCount }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot bid"></span>投标次数</span>
              <span class="legend-item"><span class="legend-dot win"></span>中标次数</span>
            </div>
          </div>

          <div class="insights-section">
            <h3 class="insights-title">关键洞察</h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in dimensionInsights.competitor" :key="idx">{{ insight }}</li>
            </ul>
          </div>
        </div>

        <!-- Self Business Analysis -->
        <div v-if="activeDimension === 'self'" class="dimension-content">
          <h2 class="dimension-title">
            <Building2 :size="20" />
            我的表现
          </h2>

          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-value">{{ selfBusinessData.bidCount }}</span>
              <span class="metric-label">投标次数</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ selfBusinessData.winCount }}</span>
              <span class="metric-label">中标次数</span>
            </div>
            <div class="metric-card highlight">
              <span class="metric-value">{{ selfBusinessData.winRate }}%</span>
              <span class="metric-label">中标率</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ selfBusinessData.totalWinAmount }}</span>
              <span class="metric-unit">万</span>
              <span class="metric-label">中标金额</span>
            </div>
          </div>

          <div class="chart-section">
            <h3 class="chart-title">月度投标/中标趋势</h3>
            <div class="bar-chart dual">
              <div class="chart-bars">
                <div v-for="item in selfBusinessData.monthlyData" :key="item.month" class="chart-bar-wrapper dual">
                  <div class="bar-group">
                    <div class="chart-bar bid" :style="{ height: (item.bidCount / 20 * 100) + '%' }">
                      <span class="bar-value">{{ item.bidCount }}</span>
                    </div>
                    <div class="chart-bar win" :style="{ height: (item.winCount / 20 * 100) + '%' }">
                      <span class="bar-value">{{ item.winCount }}</span>
                    </div>
                  </div>
                  <span class="bar-label">{{ item.month.slice(5) }}月</span>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot bid"></span>投标次数</span>
              <span class="legend-item"><span class="legend-dot win"></span>中标次数</span>
            </div>
          </div>

          <div class="insights-section">
            <h3 class="insights-title">关键洞察</h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in dimensionInsights.self" :key="idx">{{ insight }}</li>
            </ul>
          </div>
        </div>

        <!-- Price Analysis -->
        <div v-if="activeDimension === 'price'" class="dimension-content">
          <h2 class="dimension-title">
            <DollarSign :size="20" />
            价格分布
          </h2>

          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-value">{{ priceAnalysis.avgPrice }}</span>
              <span class="metric-unit">万</span>
              <span class="metric-label">行业均价</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ priceAnalysis.minPrice }}</span>
              <span class="metric-unit">万</span>
              <span class="metric-label">最低价格</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ priceAnalysis.maxPrice }}</span>
              <span class="metric-unit">万</span>
              <span class="metric-label">最高价格</span>
            </div>
          </div>

          <div class="chart-section">
            <h3 class="chart-title">价格区间分布</h3>
            <div class="price-distribution">
              <div v-for="item in priceAnalysis.priceDistribution" :key="item.range" class="price-row">
                <span class="price-label">{{ item.range }}</span>
                <div class="price-bar-wrapper">
                  <div class="price-bar" :style="{ width: (item.count / maxPriceCount * 100) + '%' }"></div>
                </div>
                <span class="price-count">{{ item.count }}个</span>
                <span class="price-pct">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>

          <div class="insights-section">
            <h3 class="insights-title">关键洞察</h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in dimensionInsights.price" :key="idx">{{ insight }}</li>
            </ul>
          </div>
        </div>

        <!-- Region Analysis -->
        <div v-if="activeDimension === 'region'" class="dimension-content">
          <h2 class="dimension-title">
            <MapPin :size="20" />
            区域分布
          </h2>

          <div class="data-table">
            <div class="table-header">
              <span class="col-name">地区</span>
              <span class="col-num">市场规模</span>
              <span class="col-num">项目数量</span>
              <span class="col-num">竞争者数</span>
              <span class="col-num">竞争强度</span>
            </div>
            <div v-for="region in regionAnalysis" :key="region.region" class="table-row">
              <span class="col-name">{{ region.region }}</span>
              <span class="col-num">{{ region.marketSize }}亿</span>
              <span class="col-num">{{ region.projectCount }}</span>
              <span class="col-num">{{ region.competitorCount }}</span>
              <span :class="['col-num', 'intensity-badge', getIntensityClass(region.intensity)]">
                {{ getIntensityLabel(region.intensity) }}
              </span>
            </div>
          </div>

          <div class="chart-section">
            <h3 class="chart-title">区域市场规模对比</h3>
            <div class="horizontal-chart">
              <div v-for="region in regionAnalysis" :key="region.region" class="h-chart-row">
                <span class="h-chart-label">{{ region.region }}</span>
                <div class="h-chart-bars single">
                  <div class="h-bar region" :style="{ width: (region.marketSize / maxRegionSize * 100) + '%' }">
                    <span>{{ region.marketSize }}亿</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="insights-section">
            <h3 class="insights-title">关键洞察</h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in dimensionInsights.region" :key="idx">{{ insight }}</li>
            </ul>
          </div>
        </div>

        <!-- Customer Analysis -->
        <div v-if="activeDimension === 'customer'" class="dimension-content">
          <h2 class="dimension-title">
            <PieChart :size="20" />
            客户构成
          </h2>

          <div class="pie-chart-section">
            <div class="pie-chart">
              <div class="pie-center">
                <span class="pie-total">{{ customerAnalysis.reduce((a, b) => a + b.count, 0) }}</span>
                <span class="pie-label">总客户数</span>
              </div>
              <div class="pie-legend">
                <div v-for="(item, idx) in customerAnalysis" :key="item.type" class="pie-legend-item">
                  <span :class="['pie-dot', 'pie-color-' + idx]"></span>
                  <span class="pie-type">{{ item.type }}</span>
                  <span class="pie-pct">{{ item.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="data-table">
            <div class="table-header">
              <span class="col-name">客户类型</span>
              <span class="col-num">数量</span>
              <span class="col-num">占比</span>
              <span class="col-num">平均预算</span>
            </div>
            <div v-for="cust in customerAnalysis" :key="cust.type" class="table-row">
              <span class="col-name">{{ cust.type }}</span>
              <span class="col-num">{{ cust.count }}</span>
              <span class="col-num">{{ cust.percentage }}%</span>
              <span class="col-num">{{ cust.avgBudget }}万</span>
            </div>
          </div>

          <div class="insights-section">
            <h3 class="insights-title">关键洞察</h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in dimensionInsights.customer" :key="idx">{{ insight }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Competitor Modal -->
    <div v-if="showAddCompetitorModal" class="modal-overlay" @click.self="showAddCompetitorModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            <Plus :size="18" />
            添加竞品企业
          </h3>
          <button class="modal-close" @click="showAddCompetitorModal = false">
            <X :size="18" />
          </button>
        </div>

        <div class="modal-body">
          <div class="search-bar">
            <Search :size="16" />
            <input
              type="text"
              v-model="competitorSearchQuery"
              placeholder="搜索企业名称、行业、地区..."
              class="search-input"
            />
          </div>

          <div class="search-results">
            <div class="results-header">
              <span>搜索结果</span>
              <span class="results-count">{{ filteredSearchResults.length }} 家企业</span>
            </div>
            <div class="results-list">
              <div
                v-for="result in filteredSearchResults"
                :key="result.id"
                :class="['result-item', { selected: selectedSearchResults.includes(result.id) }]"
                @click="toggleSearchResult(result.id)"
              >
                <div class="result-checkbox">
                  <div :class="['checkbox', { checked: selectedSearchResults.includes(result.id) }]"></div>
                </div>
                <div class="result-info">
                  <span class="result-name">{{ result.name }}</span>
                  <div class="result-meta">
                    <span class="result-industry">{{ result.industry }}</span>
                    <span class="result-region">{{ result.region }}</span>
                    <span class="result-bids">投标 {{ result.bidCount }} 次</span>
                  </div>
                </div>
              </div>
              <div v-if="filteredSearchResults.length === 0" class="no-results">
                暂无匹配的企业
              </div>
            </div>
          </div>

          <div class="import-hint">
            <Upload :size="14" />
            <span>支持批量导入：上传包含企业名称的 Excel 文件</span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn cancel" @click="showAddCompetitorModal = false">取消</button>
          <button
            class="modal-btn confirm"
            :disabled="selectedSearchResults.length === 0"
            @click="confirmAddCompetitors"
          >
            添加已选 ({{ selectedSearchResults.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles.css';
</style>
