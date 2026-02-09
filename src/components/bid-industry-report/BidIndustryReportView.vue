<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ChevronLeft,
  ChevronDown,
  BarChart3,
  Download,
  Factory,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Lightbulb,
  AlertTriangle,
  Cpu,
  Award,
  Building2,
  DollarSign,
  ExternalLink,
} from 'lucide-vue-next';
import {
  industryOptions,
  industryOverview,
  marketAnalysis,
  competitorData,
  policyData,
  riskData,
  opportunityData,
  techTrendData,
  winningCompanyRanking,
  businessOpportunities,
  dimensionInsights,
} from '../../mocks/bidIndustryReport';

const router = useRouter();

// Industry selection
const selectedIndustry = ref('cyber-security');
const showIndustryDropdown = ref(false);

const currentIndustry = computed(() => {
  return industryOptions.find(i => i.id === selectedIndustry.value);
});

const selectIndustry = (id: string) => {
  selectedIndustry.value = id;
  showIndustryDropdown.value = false;
};

// Navigation dimensions
const dimensions = [
  { id: 'overview', name: '行业概览', icon: BarChart3 },
  { id: 'market', name: '市场分析', icon: TrendingUp },
  { id: 'ranking', name: '中标排行', icon: Award },
  { id: 'policy', name: '政策法规', icon: Shield },
  { id: 'risk', name: '风险与挑战', icon: AlertTriangle },
  { id: 'opportunity', name: '发展机遇', icon: Lightbulb },
  { id: 'tech', name: '技术趋势', icon: Cpu },
  { id: 'recommend', name: '商机推荐', icon: ExternalLink },
];

const activeDimension = ref('overview');

// Helpers
const goBack = () => {
  router.push({ name: 'agents' });
};

const handleExport = () => {
  alert('行业分析报告已导出为PDF');
};

const getTrendIcon = (trend: string) => {
  if (trend === 'up') return TrendingUp;
  if (trend === 'down') return TrendingDown;
  return Minus;
};

const getTrendClass = (trend: string) => {
  if (trend === 'up') return 'trend-up';
  if (trend === 'down') return 'trend-down';
  return 'trend-stable';
};

// Chart scaling
const maxMonthlyValue = computed(() => {
  return Math.max(...marketAnalysis.monthlyTrend.map(m => m.value));
});

const maxCompetitorBids = computed(() => {
  return Math.max(...competitorData.map(c => c.bidCount));
});

const getWinProbClass = (prob: string) => {
  return { 'high': 'high', 'medium': 'medium', 'low': 'low' }[prob] || '';
};

const getWinProbLabel = (prob: string) => {
  return { 'high': '高', 'medium': '中', 'low': '低' }[prob] || '';
};
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
            <span>分析行业</span>
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
        <!-- Dimension: Industry Overview -->
        <div v-if="activeDimension === 'overview'" class="dimension-content">
          <h2 class="dimension-title">
            <BarChart3 :size="20" />
            行业概览
          </h2>

          <div class="overview-section">
            <h3 class="section-subtitle">行业定义</h3>
            <p class="overview-text">{{ industryOverview.definition }}</p>
          </div>

          <!-- Key Metrics -->
          <div class="metrics-grid four-col">
            <div v-for="metric in industryOverview.keyMetrics" :key="metric.label" class="metric-card">
              <div class="metric-header">
                <span class="metric-value">{{ metric.value }}</span>
                <span :class="['metric-change', getTrendClass(metric.trend)]">{{ metric.change }}</span>
              </div>
              <span class="metric-label">{{ metric.label }}</span>
            </div>
          </div>

          <!-- Development Timeline -->
          <div class="timeline-section">
            <h3 class="section-subtitle">发展历程</h3>
            <div class="timeline">
              <div v-for="stage in industryOverview.developmentStages" :key="stage.year" class="timeline-item">
                <div class="timeline-year">{{ stage.year }}</div>
                <div class="timeline-event">{{ stage.event }}</div>
                <div class="timeline-impact">{{ stage.impact }}</div>
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

        <!-- Dimension: Market Analysis -->
        <div v-if="activeDimension === 'market'" class="dimension-content">
          <h2 class="dimension-title">
            <TrendingUp :size="20" />
            市场分析
          </h2>

          <div class="metrics-grid four-col">
            <div class="metric-card">
              <span class="metric-value">{{ marketAnalysis.totalMarketSize }}</span>
              <span class="metric-unit">亿</span>
              <span class="metric-label">市场规模</span>
            </div>
            <div class="metric-card highlight">
              <span class="metric-value">{{ marketAnalysis.growthRate }}%</span>
              <span class="metric-label">增长率</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ marketAnalysis.projectCount }}</span>
              <span class="metric-label">项目总数</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">{{ marketAnalysis.avgProjectValue }}</span>
              <span class="metric-unit">万</span>
              <span class="metric-label">均价</span>
            </div>
          </div>

          <!-- Monthly Trend -->
          <div class="chart-section">
            <h3 class="chart-title">月度趋势</h3>
            <div class="bar-chart">
              <div class="chart-bars">
                <div v-for="item in marketAnalysis.monthlyTrend" :key="item.month" class="chart-bar-wrapper">
                  <div class="chart-bar" :style="{ height: (item.value / maxMonthlyValue * 100) + '%' }">
                    <span class="bar-value">{{ item.value }}亿</span>
                  </div>
                  <span class="bar-label">{{ item.month.slice(5) }}月</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Competitor Overview -->
          <div class="chart-section">
            <h3 class="chart-title">竞争对手总览</h3>
            <div class="horizontal-chart">
              <div v-for="comp in competitorData" :key="comp.name" class="h-chart-row">
                <span class="h-chart-label" :class="{ 'self-label': comp.name === '本公司' }">{{ comp.name.slice(0, 6) }}</span>
                <div class="h-chart-bars">
                  <div class="h-bar bid" :style="{ width: (comp.bidCount / maxCompetitorBids * 100) + '%' }">
                    <span>{{ comp.bidCount }}</span>
                  </div>
                  <div class="h-bar win" :style="{ width: (comp.winCount / maxCompetitorBids * 100) + '%' }">
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

        <!-- Dimension: Winning Company Ranking -->
        <div v-if="activeDimension === 'ranking'" class="dimension-content">
          <h2 class="dimension-title">
            <Award :size="20" />
            中标企业排行榜
          </h2>

          <div class="data-table ranking-table">
            <div class="table-header">
              <span class="col-rank">排名</span>
              <span class="col-name">企业名称</span>
              <span class="col-num">中标数</span>
              <span class="col-num">金额(万)</span>
              <span class="col-num">中标率</span>
              <span class="col-trend">趋势</span>
            </div>
            <div v-for="company in winningCompanyRanking" :key="company.rank" class="table-row">
              <span class="col-rank">
                <span :class="['rank-badge', { top3: company.rank <= 3 }]">{{ company.rank }}</span>
              </span>
              <span class="col-name">{{ company.name }}</span>
              <span class="col-num">{{ company.winCount }}</span>
              <span class="col-num">{{ company.winAmount }}</span>
              <span class="col-num">{{ company.winRate }}%</span>
              <span :class="['col-trend', getTrendClass(company.trend)]">
                {{ company.trend === 'up' ? '↑' : company.trend === 'down' ? '↓' : '—' }}
                {{ company.trendChange !== 0 ? Math.abs(company.trendChange) : '' }}
              </span>
            </div>
          </div>

          <div class="insights-section" style="margin-top: 24px">
            <h3 class="insights-title">关键洞察</h3>
            <ul class="insights-list">
              <li v-for="(insight, idx) in dimensionInsights.competitor" :key="idx">{{ insight }}</li>
            </ul>
          </div>
        </div>

        <!-- Dimension: Policy & Regulations -->
        <div v-if="activeDimension === 'policy'" class="dimension-content">
          <h2 class="dimension-title">
            <Shield :size="20" />
            政策法规
          </h2>

          <div class="policy-list">
            <div v-for="policy in policyData" :key="policy.id" class="policy-card">
              <div class="policy-header">
                <span :class="['policy-type', policy.type]">
                  {{ { law: '法律', regulation: '法规', standard: '标准', guideline: '指南' }[policy.type] }}
                </span>
                <span :class="['policy-impact', policy.impact]">
                  影响度：{{ { high: '高', medium: '中', low: '低' }[policy.impact] }}
                </span>
              </div>
              <h4 class="policy-name">{{ policy.name }}</h4>
              <p class="policy-summary">{{ policy.summary }}</p>
              <div class="policy-meta">
                <span>发布日期：{{ policy.issueDate }}</span>
                <span>发布机构：{{ policy.issuer }}</span>
              </div>
              <div class="policy-implications">
                <span class="impl-title">对投标的影响：</span>
                <ul>
                  <li v-for="impl in policy.implications" :key="impl">{{ impl }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Dimension: Risk & Challenges -->
        <div v-if="activeDimension === 'risk'" class="dimension-content">
          <h2 class="dimension-title">
            <AlertTriangle :size="20" />
            风险与挑战
          </h2>

          <div class="risk-grid">
            <div v-for="risk in riskData" :key="risk.id" class="risk-card">
              <div class="risk-header">
                <span :class="['risk-category', risk.category]">
                  {{ { policy: '政策风险', market: '市场风险', technology: '技术风险', operation: '运营风险' }[risk.category] }}
                </span>
                <span :class="['risk-level', risk.level]">
                  {{ { high: '高风险', medium: '中风险', low: '低风险' }[risk.level] }}
                </span>
              </div>
              <h4 class="risk-title">{{ risk.title }}</h4>
              <p class="risk-desc">{{ risk.description }}</p>
              <div class="risk-mitigation">
                <span class="mitigation-label">应对建议：</span>
                {{ risk.mitigation }}
              </div>
            </div>
          </div>
        </div>

        <!-- Dimension: Opportunities -->
        <div v-if="activeDimension === 'opportunity'" class="dimension-content">
          <h2 class="dimension-title">
            <Lightbulb :size="20" />
            发展机遇
          </h2>

          <div class="opportunity-grid">
            <div v-for="opp in opportunityData" :key="opp.id" class="opportunity-card">
              <div class="opp-header">
                <span :class="['opp-category', opp.category]">
                  {{ { policy: '政策驱动', market: '市场机会', technology: '技术红利' }[opp.category] }}
                </span>
                <span :class="['opp-potential', opp.potential]">
                  潜力：{{ { high: '高', medium: '中', low: '低' }[opp.potential] }}
                </span>
              </div>
              <h4 class="opp-title">{{ opp.title }}</h4>
              <p class="opp-desc">{{ opp.description }}</p>
              <div class="opp-growth">
                <span class="growth-label">预期增长：</span>
                <span class="growth-value">{{ opp.expectedGrowth }}</span>
              </div>
              <div class="opp-action">
                <span class="action-label">行动建议：</span>
                {{ opp.actionSuggestion }}
              </div>
            </div>
          </div>
        </div>

        <!-- Dimension: Tech Trends -->
        <div v-if="activeDimension === 'tech'" class="dimension-content">
          <h2 class="dimension-title">
            <Cpu :size="20" />
            技术趋势
          </h2>

          <div class="tech-grid">
            <div v-for="tech in techTrendData" :key="tech.id" class="tech-card">
              <div class="tech-header">
                <span :class="['tech-maturity', tech.maturity]">
                  {{ { emerging: '新兴', growing: '成长期', mature: '成熟' }[tech.maturity] }}
                </span>
                <span :class="['tech-impact', { high: tech.impactLevel === 'high' }]">
                  影响度：{{ { high: '高', medium: '中', low: '低' }[tech.impactLevel] }}
                </span>
              </div>
              <h4 class="tech-name">{{ tech.name }}</h4>
              <p class="tech-desc">{{ tech.description }}</p>
              <div class="tech-timeline">
                <span class="timeline-label">预计时间：</span>
                {{ tech.timeline }}
              </div>
              <div class="tech-opportunities">
                <span class="opp-label">商业机会：</span>
                <ul>
                  <li v-for="o in tech.opportunities" :key="o">{{ o }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Dimension: Business Opportunities -->
        <div v-if="activeDimension === 'recommend'" class="dimension-content">
          <h2 class="dimension-title">
            <ExternalLink :size="20" />
            商机推荐
          </h2>

          <div class="recommendation-list">
            <div v-for="opp in businessOpportunities" :key="opp.id" class="recommend-card">
              <div class="recommend-header">
                <div class="recommend-score">
                  <span class="score-value">{{ opp.matchScore }}</span>
                  <span class="score-label">匹配度</span>
                </div>
                <div class="recommend-info">
                  <h4 class="recommend-title">{{ opp.title }}</h4>
                  <div class="recommend-meta">
                    <span><Building2 :size="12" /> {{ opp.region }}</span>
                    <span><DollarSign :size="12" /> {{ opp.budget }}万</span>
                    <span>截止 {{ opp.deadline }}</span>
                  </div>
                </div>
                <span :class="['win-probability', getWinProbClass(opp.winProbability)]">
                  胜率{{ getWinProbLabel(opp.winProbability) }}
                </span>
              </div>
              <div class="recommend-body">
                <div class="match-reasons">
                  <span class="reasons-label">匹配原因：</span>
                  <div class="reasons-tags">
                    <span v-for="reason in opp.matchReasons" :key="reason" class="reason-tag">{{ reason }}</span>
                  </div>
                </div>
                <div class="recommend-tags">
                  <span v-for="tag in opp.tags" :key="tag" class="bid-tag">{{ tag }}</span>
                </div>
                <div class="competitors-info">
                  <span class="comp-label">预计竞争对手：</span>
                  {{ opp.competitors.join('、') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles.css';
</style>
