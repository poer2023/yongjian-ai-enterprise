<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  Download,
  BookPlus,
  FileSpreadsheet,
  Users,
  Briefcase,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Read query params from form submission
const jobName = computed(() => (route.query.jobName as string) || 'Java开发工程师');
const category = computed(() => (route.query.category as string) || 'tech');
const location = computed(() => (route.query.location as string) || '上海');
const regions = computed(() => {
  const r = route.query.regions as string;
  return r ? r.split(',') : [];
});
const mode = computed(() => (route.query.mode as string) || 'external_only');
const employeeCount = computed(() => parseInt((route.query.count as string) || '0'));

const categoryLabels: Record<string, string> = {
  tech: '技术研发',
  product: '产品设计',
  market: '市场营销',
  finance: '财务金融',
  hr: '人力资源',
  ops: '运营管理',
};

const categoryLabel = computed(() => categoryLabels[category.value] || category.value);
const isBenchmarkMode = computed(() => mode.value === 'benchmark');
const scopeLabel = computed(() => {
  if (regions.value.length === 0) return '全国';
  return regions.value.join('、');
});

// Tab management
const activeTab = ref<'survey' | 'benchmark'>('survey');

// Salary survey data - region × experience matrix
const salaryData = ref([
  { region: '北京', y1_3: '15K-22K', y3_5: '22K-32K', y5_10: '32K-45K', y10plus: '45K-65K', samples: 1200, source: 'Boss直聘/猎聘' },
  { region: '上海', y1_3: '14K-20K', y3_5: '20K-30K', y5_10: '30K-42K', y10plus: '42K-60K', samples: 980, source: 'Boss直聘/猎聘' },
  { region: '广东-深圳', y1_3: '13K-19K', y3_5: '19K-28K', y5_10: '28K-40K', y10plus: '40K-55K', samples: 850, source: 'Boss直聘/猎聘' },
  { region: '广东-广州', y1_3: '11K-16K', y3_5: '16K-24K', y5_10: '24K-34K', y10plus: '34K-48K', samples: 720, source: 'Boss直聘/猎聘' },
  { region: '浙江-杭州', y1_3: '12K-18K', y3_5: '18K-26K', y5_10: '26K-36K', y10plus: '36K-50K', samples: 620, source: 'Boss直聘/猎聘' },
  { region: '江苏-南京', y1_3: '10K-15K', y3_5: '15K-22K', y5_10: '22K-32K', y10plus: '32K-45K', samples: 450, source: 'Boss直聘/猎聘' },
  { region: '江苏-苏州', y1_3: '9K-14K', y3_5: '14K-21K', y5_10: '21K-30K', y10plus: '30K-42K', samples: 380, source: 'Boss直聘/猎聘' },
  { region: '四川-成都', y1_3: '9K-14K', y3_5: '14K-20K', y5_10: '20K-28K', y10plus: '28K-40K', samples: 520, source: 'Boss直聘/猎聘' },
  { region: '湖北-武汉', y1_3: '8K-13K', y3_5: '13K-19K', y5_10: '19K-27K', y10plus: '27K-38K', samples: 410, source: 'Boss直聘/猎聘' },
  { region: '陕西-西安', y1_3: '7K-12K', y3_5: '12K-17K', y5_10: '17K-24K', y10plus: '24K-35K', samples: 350, source: 'Boss直聘/猎聘' },
  { region: '重庆', y1_3: '8K-13K', y3_5: '13K-18K', y5_10: '18K-26K', y10plus: '26K-36K', samples: 320, source: 'Boss直聘/猎聘' },
  { region: '天津', y1_3: '9K-14K', y3_5: '14K-20K', y5_10: '20K-29K', y10plus: '29K-40K', samples: 280, source: 'Boss直聘/猎聘' },
  { region: '湖南-长沙', y1_3: '7K-12K', y3_5: '12K-17K', y5_10: '17K-24K', y10plus: '24K-33K', samples: 290, source: 'Boss直聘/猎聘' },
  { region: '福建-厦门', y1_3: '9K-14K', y3_5: '14K-20K', y5_10: '20K-28K', y10plus: '28K-38K', samples: 260, source: 'Boss直聘/猎聘' },
  { region: '山东-济南', y1_3: '7K-11K', y3_5: '11K-16K', y5_10: '16K-23K', y10plus: '23K-32K', samples: 240, source: 'Boss直聘/猎聘' },
  { region: '山东-青岛', y1_3: '7K-12K', y3_5: '12K-17K', y5_10: '17K-24K', y10plus: '24K-33K', samples: 230, source: 'Boss直聘/猎聘' },
  { region: '辽宁-大连', y1_3: '6K-10K', y3_5: '10K-15K', y5_10: '15K-22K', y10plus: '22K-30K', samples: 180, source: 'Boss直聘/猎聘' },
  { region: '辽宁-沈阳', y1_3: '5K-9K', y3_5: '9K-14K', y5_10: '14K-20K', y10plus: '20K-28K', samples: 160, source: 'Boss直聘/猎聘' },
  { region: '河南-郑州', y1_3: '6K-10K', y3_5: '10K-15K', y5_10: '15K-21K', y10plus: '21K-30K', samples: 220, source: 'Boss直聘/猎聘' },
  { region: '安徽-合肥', y1_3: '6K-10K', y3_5: '10K-15K', y5_10: '15K-22K', y10plus: '22K-30K', samples: 190, source: 'Boss直聘/猎聘' },
  { region: '浙江-宁波', y1_3: '8K-13K', y3_5: '13K-18K', y5_10: '18K-26K', y10plus: '26K-36K', samples: 170, source: 'Boss直聘/猎聘' },
  { region: '江西-南昌', y1_3: '5K-9K', y3_5: '9K-13K', y5_10: '13K-19K', y10plus: '19K-26K', samples: 130, source: 'Boss直聘/猎聘' },
  { region: '广西-南宁', y1_3: '5K-8K', y3_5: '8K-12K', y5_10: '12K-18K', y10plus: '18K-25K', samples: 110, source: 'Boss直聘/猎聘' },
  { region: '云南-昆明', y1_3: '5K-9K', y3_5: '9K-13K', y5_10: '13K-19K', y10plus: '19K-26K', samples: 120, source: 'Boss直聘/猎聘' },
  { region: '贵州-贵阳', y1_3: '5K-8K', y3_5: '8K-12K', y5_10: '12K-17K', y10plus: '17K-24K', samples: 90, source: 'Boss直聘/猎聘' },
  { region: '海南-海口', y1_3: '5K-9K', y3_5: '9K-13K', y5_10: '13K-18K', y10plus: '18K-25K', samples: 80, source: 'Boss直聘/猎聘' },
  { region: '吉林-长春', y1_3: '5K-8K', y3_5: '8K-12K', y5_10: '12K-17K', y10plus: '17K-24K', samples: 100, source: 'Boss直聘/猎聘' },
  { region: '黑龙江-哈尔滨', y1_3: '4K-8K', y3_5: '8K-11K', y5_10: '11K-16K', y10plus: '16K-22K', samples: 95, source: 'Boss直聘/猎聘' },
  { region: '内蒙古-呼和浩特', y1_3: '4K-8K', y3_5: '8K-11K', y5_10: '11K-15K', y10plus: '15K-21K', samples: 60, source: 'Boss直聘/猎聘' },
  { region: '新疆-乌鲁木齐', y1_3: '5K-8K', y3_5: '8K-12K', y5_10: '12K-17K', y10plus: '17K-24K', samples: 55, source: 'Boss直聘/猎聘' },
  { region: '甘肃-兰州', y1_3: '4K-7K', y3_5: '7K-10K', y5_10: '10K-14K', y10plus: '14K-20K', samples: 45, source: 'Boss直聘/猎聘' },
  { region: '宁夏-银川', y1_3: '4K-7K', y3_5: '7K-10K', y5_10: '10K-14K', y10plus: '14K-20K', samples: 35, source: 'Boss直聘/猎聘' },
]);

// Employee benchmark data with percentile positioning
interface BenchmarkEmployee {
  name: string;
  tenure: string;
  tenureLabel: string;
  region: string;
  currentSalary: number;
  marketP25: number;
  marketP50: number;
  marketP75: number;
  percentile: number;
  tag: 'high' | 'normal' | 'low';
  adjustSuggestion: number;
}

const benchmarkData = ref<BenchmarkEmployee[]>([
  { name: '张三', tenure: '1-3', tenureLabel: '1~3年', region: '上海', currentSalary: 12, marketP25: 14, marketP50: 17, marketP75: 20, percentile: 15, tag: 'low', adjustSuggestion: 5 },
  { name: '李四', tenure: '3-5', tenureLabel: '3~5年', region: '上海', currentSalary: 25, marketP25: 20, marketP50: 25, marketP75: 30, percentile: 50, tag: 'normal', adjustSuggestion: 0 },
  { name: '王五', tenure: '5-10', tenureLabel: '5~10年', region: '上海', currentSalary: 38, marketP25: 30, marketP50: 36, marketP75: 42, percentile: 62, tag: 'normal', adjustSuggestion: 0 },
  { name: '赵六', tenure: '1-3', tenureLabel: '1~3年', region: '北京', currentSalary: 13, marketP25: 15, marketP50: 18.5, marketP75: 22, percentile: 12, tag: 'low', adjustSuggestion: 5.5 },
  { name: '钱七', tenure: '3-5', tenureLabel: '3~5年', region: '北京', currentSalary: 28, marketP25: 22, marketP50: 27, marketP75: 32, percentile: 55, tag: 'normal', adjustSuggestion: 0 },
  { name: '孙八', tenure: '5-10', tenureLabel: '5~10年', region: '深圳', currentSalary: 42, marketP25: 28, marketP50: 34, marketP75: 40, percentile: 82, tag: 'high', adjustSuggestion: 0 },
  { name: '周九', tenure: '3-5', tenureLabel: '3~5年', region: '杭州', currentSalary: 16, marketP25: 18, marketP50: 22, marketP75: 26, percentile: 18, tag: 'low', adjustSuggestion: 6 },
  { name: '吴十', tenure: '1-3', tenureLabel: '1~3年', region: '成都', currentSalary: 11, marketP25: 9, marketP50: 11.5, marketP75: 14, percentile: 45, tag: 'normal', adjustSuggestion: 0 },
]);

// Filter state
const benchmarkFilter = ref<'all' | 'high' | 'normal' | 'low'>('all');

// Statistics
const totalSamples = computed(() => salaryData.value.reduce((sum, r) => sum + r.samples, 0));

const benchmarkStats = computed(() => {
  const high = benchmarkData.value.filter(b => b.tag === 'high').length;
  const normal = benchmarkData.value.filter(b => b.tag === 'normal').length;
  const low = benchmarkData.value.filter(b => b.tag === 'low').length;
  const total = benchmarkData.value.length;
  const avgPercentile = Math.round(benchmarkData.value.reduce((sum, b) => sum + b.percentile, 0) / total);
  const needAdjust = benchmarkData.value.filter(b => b.adjustSuggestion > 0).length;
  const totalAdjustCost = benchmarkData.value.reduce((sum, b) => sum + b.adjustSuggestion, 0);
  return { high, normal, low, total, avgPercentile, needAdjust, totalAdjustCost };
});

const filteredBenchmarkData = computed(() => {
  if (benchmarkFilter.value === 'all') return benchmarkData.value;
  return benchmarkData.value.filter(b => b.tag === benchmarkFilter.value);
});

const belowP25Employees = computed(() => benchmarkData.value.filter(b => b.percentile < 25));

const toggleBenchmarkFilter = (filter: 'high' | 'normal' | 'low') => {
  benchmarkFilter.value = benchmarkFilter.value === filter ? 'all' : filter;
};

const goBack = () => {
  router.push({ name: 'salary-survey-form' });
};

const getTagClass = (tag: string) => {
  switch (tag) {
    case 'high': return 'tag-high';
    case 'low': return 'tag-low';
    default: return 'tag-normal';
  }
};

const getTagText = (tag: string) => {
  switch (tag) {
    case 'high': return '高于市场';
    case 'low': return '低于市场';
    default: return '市场水平';
  }
};

// Percentile bar positioning helpers
const getMarkerLeft = (emp: BenchmarkEmployee) => {
  return `${Math.max(2, Math.min(98, emp.percentile))}%`;
};

const getRangeLeft = (emp: BenchmarkEmployee) => {
  const total = emp.marketP75 + (emp.marketP75 - emp.marketP25) * 0.5;
  const base = emp.marketP25 - (emp.marketP75 - emp.marketP25) * 0.5;
  const range = total - base;
  return `${((emp.marketP25 - base) / range) * 100}%`;
};

const getRangeWidth = (emp: BenchmarkEmployee) => {
  const total = emp.marketP75 + (emp.marketP75 - emp.marketP25) * 0.5;
  const base = emp.marketP25 - (emp.marketP75 - emp.marketP25) * 0.5;
  const range = total - base;
  return `${((emp.marketP75 - emp.marketP25) / range) * 100}%`;
};

const handleExport = () => {
  alert('导出Excel报告');
};

const handleAddToKnowledge = () => {
  alert('已添加到知识库');
};
</script>

<template>
  <div class="result-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
          <span>返回</span>
        </button>
        <h1 class="page-title">岗位薪酬调查报告</h1>
      </div>
      <div class="header-center">
        <div class="tab-switcher">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'survey' }"
            @click="activeTab = 'survey'"
          >
            <FileSpreadsheet :size="14" />
            薪酬调查表
          </button>
          <button
            v-if="isBenchmarkMode"
            class="tab-btn"
            :class="{ active: activeTab === 'benchmark' }"
            @click="activeTab = 'benchmark'"
          >
            <Users :size="14" />
            员工对标
          </button>
        </div>
      </div>
      <div class="header-right">
        <button class="action-btn primary" @click="handleExport">
          <Download :size="16" />
          导出Excel
        </button>
        <button class="action-btn secondary" @click="handleAddToKnowledge">
          <BookPlus :size="16" />
          加入知识库
        </button>
      </div>
    </header>

    <!-- Job Context Bar -->
    <div class="job-context-bar">
      <div class="context-item">
        <Briefcase :size="14" class="context-icon" />
        <span class="context-label">调查岗位</span>
        <span class="context-value">{{ jobName }}</span>
      </div>
      <div class="context-divider"></div>
      <div class="context-item">
        <span class="context-label">岗位类别</span>
        <span class="context-value">{{ categoryLabel }}</span>
      </div>
      <div class="context-divider"></div>
      <div class="context-item">
        <MapPin :size="14" class="context-icon" />
        <span class="context-label">工作地点</span>
        <span class="context-value">{{ location }}</span>
      </div>
      <div class="context-divider"></div>
      <div class="context-item">
        <span class="context-label">采集范围</span>
        <span class="context-value">{{ scopeLabel }}</span>
      </div>
      <div class="context-divider"></div>
      <div class="context-item">
        <span class="context-label">调查模式</span>
        <span class="mode-tag" :class="isBenchmarkMode ? 'mode-benchmark' : 'mode-external'">
          {{ isBenchmarkMode ? '内外对标' : '仅外部调查' }}
        </span>
      </div>
      <div class="context-divider"></div>
      <div class="context-item">
        <BarChart3 :size="14" class="context-icon" />
        <span class="context-label">样本总量</span>
        <span class="context-value highlight">{{ totalSamples.toLocaleString() }}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="page-body">
      <main class="main-content">
        <!-- Survey Table Tab -->
        <div v-if="activeTab === 'survey'" class="survey-tab">
          <div class="table-container">
            <table class="salary-table">
              <thead>
                <tr>
                  <th class="region-col">地区</th>
                  <th class="data-col">1~3年</th>
                  <th class="data-col">3~5年</th>
                  <th class="data-col">5~10年</th>
                  <th class="data-col">10年以上</th>
                  <th class="data-col">样本数</th>
                  <th class="source-col">数据来源</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in salaryData" :key="row.region">
                  <td class="region-col">{{ row.region }}</td>
                  <td class="data-col">{{ row.y1_3 }}</td>
                  <td class="data-col">{{ row.y3_5 }}</td>
                  <td class="data-col">{{ row.y5_10 }}</td>
                  <td class="data-col">{{ row.y10plus }}</td>
                  <td class="data-col samples">{{ row.samples }}</td>
                  <td class="source-col">{{ row.source }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-note">
            <p>说明：薪资数据为税前月薪区间，按工作年限分段统计。数据来源于主流招聘平台，每月更新，仅供参考。</p>
          </div>
        </div>

        <!-- Benchmark Tab -->
        <div v-if="activeTab === 'benchmark'" class="benchmark-tab">
          <!-- A. Summary Cards (4 columns) -->
          <div class="summary-cards">
            <div
              class="summary-card high"
              :class="{ selected: benchmarkFilter === 'high' }"
              @click="toggleBenchmarkFilter('high')"
            >
              <div class="card-icon-wrap high-bg">
                <TrendingUp :size="20" />
              </div>
              <div class="card-body">
                <div class="card-value">{{ benchmarkStats.high }}</div>
                <div class="card-label">高于市场</div>
                <div class="card-percent">{{ ((benchmarkStats.high / benchmarkStats.total) * 100).toFixed(0) }}%</div>
              </div>
            </div>
            <div
              class="summary-card normal"
              :class="{ selected: benchmarkFilter === 'normal' }"
              @click="toggleBenchmarkFilter('normal')"
            >
              <div class="card-icon-wrap normal-bg">
                <BarChart3 :size="20" />
              </div>
              <div class="card-body">
                <div class="card-value">{{ benchmarkStats.normal }}</div>
                <div class="card-label">市场水平</div>
                <div class="card-percent">{{ ((benchmarkStats.normal / benchmarkStats.total) * 100).toFixed(0) }}%</div>
              </div>
            </div>
            <div
              class="summary-card low"
              :class="{ selected: benchmarkFilter === 'low' }"
              @click="toggleBenchmarkFilter('low')"
            >
              <div class="card-icon-wrap low-bg">
                <TrendingDown :size="20" />
              </div>
              <div class="card-body">
                <div class="card-value">{{ benchmarkStats.low }}</div>
                <div class="card-label">低于市场</div>
                <div class="card-percent">{{ ((benchmarkStats.low / benchmarkStats.total) * 100).toFixed(0) }}%</div>
              </div>
            </div>
            <div class="summary-card overview">
              <div class="card-icon-wrap overview-bg">
                <Users :size="20" />
              </div>
              <div class="card-body">
                <div class="card-value overview-value">P{{ benchmarkStats.avgPercentile }}</div>
                <div class="card-label">团队平均分位</div>
                <div class="card-detail">
                  <span>需调薪 <strong>{{ benchmarkStats.needAdjust }}</strong> 人</span>
                  <span class="detail-sep">|</span>
                  <span>月增 <strong>{{ benchmarkStats.totalAdjustCost.toFixed(1) }}K</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- B. Benchmark Detail Table -->
          <div class="table-container">
            <table class="benchmark-table">
              <thead>
                <tr>
                  <th class="col-employee">员工</th>
                  <th class="col-tenure">工龄段</th>
                  <th class="col-region">地区</th>
                  <th class="col-salary">当前薪资</th>
                  <th class="col-p25">P25</th>
                  <th class="col-p50">P50</th>
                  <th class="col-p75">P75</th>
                  <th class="col-position">市场定位</th>
                  <th class="col-tag">评估</th>
                  <th class="col-adjust">建议调整</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredBenchmarkData" :key="row.name">
                  <td class="col-employee">{{ row.name }}</td>
                  <td class="col-tenure">{{ row.tenureLabel }}</td>
                  <td class="col-region">{{ row.region }}</td>
                  <td class="col-salary">{{ row.currentSalary }}K</td>
                  <td class="col-p25">{{ row.marketP25 }}K</td>
                  <td class="col-p50">{{ row.marketP50 }}K</td>
                  <td class="col-p75">{{ row.marketP75 }}K</td>
                  <td class="col-position">
                    <div class="percentile-bar">
                      <div class="percentile-track">
                        <div
                          class="percentile-range"
                          :style="{ left: getRangeLeft(row), width: getRangeWidth(row) }"
                        ></div>
                        <div
                          class="percentile-marker"
                          :class="'marker-' + row.tag"
                          :style="{ left: getMarkerLeft(row) }"
                        >
                          <span class="marker-label">P{{ row.percentile }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="col-tag">
                    <span class="status-tag" :class="getTagClass(row.tag)">
                      {{ getTagText(row.tag) }}
                    </span>
                  </td>
                  <td class="col-adjust">
                    <span v-if="row.adjustSuggestion > 0" class="adjust-value">+{{ row.adjustSuggestion }}K</span>
                    <span v-else class="adjust-none">--</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- C. Risk Alert -->
          <div v-if="belowP25Employees.length > 0" class="risk-alert">
            <AlertTriangle :size="18" class="risk-icon" />
            <div class="risk-content">
              <strong>薪酬风险提示</strong>
              <p>
                {{ belowP25Employees.length }} 名员工薪资低于市场 P25 分位，
                占比 {{ ((belowP25Employees.length / benchmarkStats.total) * 100).toFixed(0) }}%，
                存在人才流失风险。建议调薪预计月增成本
                {{ belowP25Employees.reduce((s, e) => s + e.adjustSuggestion, 0).toFixed(1) }}K。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Tab Switcher */
.tab-switcher {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #334155;
}

.tab-btn.active {
  background: white;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #2563eb;
  border: none;
  color: white;
}

.action-btn.primary:hover {
  background: #1d4ed8;
}

.action-btn.secondary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.action-btn.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Job Context Bar */
.job-context-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.context-icon {
  color: #94a3b8;
}

.context-label {
  font-size: 13px;
  color: #94a3b8;
}

.context-value {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.context-value.highlight {
  color: #2563eb;
  font-weight: 600;
}

.context-divider {
  width: 1px;
  height: 16px;
  background: #e2e8f0;
}

.mode-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.mode-external {
  background: #f0fdf4;
  color: #16a34a;
}

.mode-benchmark {
  background: #eff6ff;
  color: #2563eb;
}

/* Page Body */
.page-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

/* Table Container */
.table-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

/* Salary Table */
.salary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
}

.salary-table th,
.salary-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.salary-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.salary-table tbody tr:hover {
  background: #f8fafc;
}

.salary-table tbody tr:last-child td {
  border-bottom: none;
}

.region-col {
  width: 12%;
  font-weight: 500;
  color: #1e293b;
}

.data-col {
  width: 14%;
  text-align: center;
  color: #334155;
}

.data-col.samples {
  color: #64748b;
  font-size: 13px;
}

.source-col {
  color: #64748b;
  font-size: 13px;
}

/* Table Note */
.table-note {
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  margin-top: -1px;
}

.table-note p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

/* Summary Cards - 4 columns */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.summary-card.selected {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.summary-card.overview {
  cursor: default;
}

.summary-card.overview:hover {
  transform: none;
  box-shadow: none;
}

.card-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.high-bg {
  background: #dcfce7;
  color: #16a34a;
}

.normal-bg {
  background: #fef3c7;
  color: #d97706;
}

.low-bg {
  background: #fee2e2;
  color: #dc2626;
}

.overview-bg {
  background: #eff6ff;
  color: #2563eb;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.summary-card .card-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.summary-card.high .card-value {
  color: #22c55e;
}

.summary-card.normal .card-value {
  color: #f59e0b;
}

.summary-card.low .card-value {
  color: #ef4444;
}

.summary-card .card-value.overview-value {
  color: #2563eb;
  font-size: 24px;
}

.summary-card .card-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 2px;
}

.summary-card .card-percent {
  font-size: 13px;
  font-weight: 500;
}

.summary-card.high .card-percent {
  color: #16a34a;
}

.summary-card.normal .card-percent {
  color: #d97706;
}

.summary-card.low .card-percent {
  color: #dc2626;
}

.card-detail {
  font-size: 12px;
  color: #64748b;
}

.card-detail strong {
  color: #1e293b;
  font-weight: 600;
}

.detail-sep {
  margin: 0 6px;
  color: #cbd5e1;
}

/* Benchmark Table - 10 columns */
.benchmark-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.benchmark-table th,
.benchmark-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.benchmark-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.benchmark-table tbody tr:hover {
  background: #f8fafc;
}

.benchmark-table tbody tr:last-child td {
  border-bottom: none;
}

.col-employee {
  width: 8%;
  font-weight: 500;
  color: #1e293b;
}

.col-tenure {
  width: 8%;
  color: #64748b;
}

.col-region {
  width: 7%;
}

.col-salary {
  width: 9%;
  font-weight: 600;
  color: #1e293b;
}

.col-p25,
.col-p50,
.col-p75 {
  width: 7%;
  color: #64748b;
  text-align: center;
}

.col-position {
  width: 22%;
}

.col-tag {
  width: 10%;
}

.col-adjust {
  width: 10%;
  text-align: center;
}

/* Percentile Bar */
.percentile-bar {
  padding: 4px 0;
}

.percentile-track {
  position: relative;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  margin-top: 12px;
}

.percentile-range {
  position: absolute;
  top: 0;
  height: 100%;
  background: #dbeafe;
  border-radius: 4px;
}

.percentile-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.marker-high {
  background: #22c55e;
}

.marker-normal {
  background: #f59e0b;
}

.marker-low {
  background: #ef4444;
}

.marker-label {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  margin-bottom: 2px;
}

/* Status Tags */
.status-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag-high {
  background: #dcfce7;
  color: #16a34a;
}

.tag-low {
  background: #fee2e2;
  color: #dc2626;
}

.tag-normal {
  background: #fef3c7;
  color: #d97706;
}

/* Adjust Suggestion */
.adjust-value {
  display: inline-block;
  padding: 3px 8px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.adjust-none {
  color: #cbd5e1;
  font-size: 14px;
}

/* Risk Alert */
.risk-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 20px;
  padding: 16px 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
}

.risk-icon {
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 1px;
}

.risk-content strong {
  display: block;
  font-size: 14px;
  color: #991b1b;
  margin-bottom: 4px;
}

.risk-content p {
  margin: 0;
  font-size: 13px;
  color: #b91c1c;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1200px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }

  .header-center {
    flex-direction: column;
    width: 100%;
  }

  .job-context-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .context-divider {
    display: none;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
