<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  Download,
  BookPlus,
  FileSpreadsheet,
  Users,
  Briefcase
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Tab management
const activeTab = ref<'survey' | 'benchmark'>('survey');

// Job selection with more details
const jobs = ref([
  { id: 1, name: 'Java开发工程师', level: '中级', avgP50: 25, employeeCount: 12 },
  { id: 2, name: '前端开发工程师', level: '中级', avgP50: 23, employeeCount: 8 },
  { id: 3, name: '产品经理', level: '高级', avgP50: 28, employeeCount: 5 },
  { id: 4, name: '项目经理', level: '高级', avgP50: 30, employeeCount: 4 },
  { id: 5, name: '测试工程师', level: '中级', avgP50: 18, employeeCount: 6 },
  { id: 6, name: 'UI设计师', level: '中级', avgP50: 20, employeeCount: 3 },
  { id: 7, name: '运维工程师', level: '中级', avgP50: 22, employeeCount: 4 },
  { id: 8, name: '数据分析师', level: '高级', avgP50: 26, employeeCount: 3 },
]);

const activeJobId = ref(1);

const activeJob = computed(() => jobs.value.find(j => j.id === activeJobId.value));

const selectJob = (id: number) => {
  activeJobId.value = id;
};

// Salary survey data - 32 regions with salary ranges by experience years
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

// Employee benchmark data with salary range
const benchmarkData = ref([
  { employee: '张三', level: '初级', region: '上海', current: 12, marketRange: '14K-20K', tag: 'low' },
  { employee: '李四', level: '中级', region: '上海', current: 22, marketRange: '20K-30K', tag: 'normal' },
  { employee: '王五', level: '高级', region: '上海', current: 35, marketRange: '30K-42K', tag: 'high' },
  { employee: '赵六', level: '初级', region: '北京', current: 15, marketRange: '15K-22K', tag: 'low' },
  { employee: '钱七', level: '中级', region: '北京', current: 26, marketRange: '22K-32K', tag: 'normal' },
  { employee: '孙八', level: '高级', region: '深圳', current: 38, marketRange: '28K-40K', tag: 'high' },
  { employee: '周九', level: '中级', region: '杭州', current: 18, marketRange: '18K-26K', tag: 'low' },
  { employee: '吴十', level: '初级', region: '成都', current: 11, marketRange: '9K-14K', tag: 'normal' },
]);

// Filter state for benchmark cards
const benchmarkFilter = ref<'all' | 'high' | 'normal' | 'low'>('all');

// Statistics
const totalSamples = computed(() => salaryData.value.reduce((sum, r) => sum + r.samples, 0));

const benchmarkStats = computed(() => {
  const high = benchmarkData.value.filter(b => b.tag === 'high').length;
  const normal = benchmarkData.value.filter(b => b.tag === 'normal').length;
  const low = benchmarkData.value.filter(b => b.tag === 'low').length;
  return { high, normal, low, total: benchmarkData.value.length };
});

// Filtered benchmark data based on selected card
const filteredBenchmarkData = computed(() => {
  if (benchmarkFilter.value === 'all') {
    return benchmarkData.value;
  }
  return benchmarkData.value.filter(b => b.tag === benchmarkFilter.value);
});

// Toggle filter when clicking on cards
const toggleBenchmarkFilter = (filter: 'high' | 'normal' | 'low') => {
  if (benchmarkFilter.value === filter) {
    benchmarkFilter.value = 'all';
  } else {
    benchmarkFilter.value = filter;
  }
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
    default: return '正常';
  }
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
        <span class="job-count">{{ jobs.length }} 个岗位</span>
      </div>
      <div class="header-center">
        <!-- Tab Switcher -->
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

    <!-- Body -->
    <div class="page-body">
      <!-- Left Sidebar - Job List -->
      <aside class="job-sidebar">
        <div class="sidebar-header">
          <Briefcase :size="16" />
          <span>岗位列表</span>
        </div>
        <div class="job-list">
          <div
            v-for="job in jobs"
            :key="job.id"
            class="job-item"
            :class="{ active: activeJobId === job.id }"
            @click="selectJob(job.id)"
          >
            <div class="job-icon">
              <FileSpreadsheet :size="16" />
            </div>
            <div class="job-info">
              <span class="job-name">{{ job.name }}</span>
              <span class="job-meta">
                <span class="job-level">{{ job.level }}</span>
                <span class="job-salary">P50: {{ job.avgP50 }}K</span>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Survey Table Tab -->
        <div v-if="activeTab === 'survey'" class="survey-tab">
          <!-- Excel-style Table -->
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

          <!-- Table Note -->
          <div class="table-note">
            <p>说明：薪资数据为税前月薪区间，按工作年限分段统计。数据来源于主流招聘平台，每月更新，仅供参考。</p>
          </div>
        </div>

        <!-- Benchmark Tab -->
        <div v-if="activeTab === 'benchmark'" class="benchmark-tab">
          <!-- Summary Cards with filter -->
          <div class="summary-cards">
            <div
              class="summary-card high"
              :class="{ selected: benchmarkFilter === 'high' }"
              @click="toggleBenchmarkFilter('high')"
            >
              <div class="card-value">{{ benchmarkStats.high }}</div>
              <div class="card-label">高于市场</div>
              <div class="card-percent">{{ ((benchmarkStats.high / benchmarkStats.total) * 100).toFixed(0) }}%</div>
            </div>
            <div
              class="summary-card normal"
              :class="{ selected: benchmarkFilter === 'normal' }"
              @click="toggleBenchmarkFilter('normal')"
            >
              <div class="card-value">{{ benchmarkStats.normal }}</div>
              <div class="card-label">正常</div>
              <div class="card-percent">{{ ((benchmarkStats.normal / benchmarkStats.total) * 100).toFixed(0) }}%</div>
            </div>
            <div
              class="summary-card low"
              :class="{ selected: benchmarkFilter === 'low' }"
              @click="toggleBenchmarkFilter('low')"
            >
              <div class="card-value">{{ benchmarkStats.low }}</div>
              <div class="card-label">低于市场</div>
              <div class="card-percent">{{ ((benchmarkStats.low / benchmarkStats.total) * 100).toFixed(0) }}%</div>
            </div>
          </div>

          <!-- Benchmark Table -->
          <div class="table-container">
            <table class="benchmark-table">
              <thead>
                <tr>
                  <th>员工</th>
                  <th>级别</th>
                  <th>所在地区</th>
                  <th>当前薪资</th>
                  <th>市场区间</th>
                  <th>评估</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredBenchmarkData" :key="row.employee">
                  <td class="employee-name">{{ row.employee }}</td>
                  <td>{{ row.level }}</td>
                  <td>{{ row.region }}</td>
                  <td>{{ row.current }}K</td>
                  <td>{{ row.marketRange }}</td>
                  <td>
                    <span class="status-tag" :class="getTagClass(row.tag)">
                      {{ getTagText(row.tag) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
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

.job-count {
  padding: 4px 10px;
  background: #dbeafe;
  border-radius: 12px;
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
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

/* Page Body */
.page-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Job Sidebar */
.job-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}

.job-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.job-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.job-item:hover {
  background: #f8fafc;
}

.job-item.active {
  background: #eff6ff;
}

.job-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f1f5f9;
  color: #64748b;
}

.job-item.active .job-icon {
  background: #3b82f6;
  color: white;
}

.job-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.job-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.job-level {
  padding: 2px 6px;
  background: #f1f5f9;
  border-radius: 4px;
  color: #64748b;
}

.job-item.active .job-level {
  background: #dbeafe;
  color: #2563eb;
}

.job-salary {
  color: #16a34a;
  font-weight: 500;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: 24px;
  padding: 16px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.stat-value.highlight {
  color: #2563eb;
  font-size: 16px;
}

/* Table Container */
.table-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

/* Salary Table - Excel Style */
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

.data-col.highlight-col {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.salary-table th.highlight-col {
  background: #dbeafe;
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

/* Summary Cards */
.summary-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  flex: 1;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
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

.summary-card .card-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.summary-card .card-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.summary-card .card-percent {
  font-size: 13px;
  font-weight: 500;
}

.summary-card.high {
  border-left: 4px solid #22c55e;
}

.summary-card.high .card-value {
  color: #22c55e;
}

.summary-card.high .card-percent {
  color: #16a34a;
}

.summary-card.normal {
  border-left: 4px solid #f59e0b;
}

.summary-card.normal .card-value {
  color: #f59e0b;
}

.summary-card.normal .card-percent {
  color: #d97706;
}

.summary-card.low {
  border-left: 4px solid #ef4444;
}

.summary-card.low .card-value {
  color: #ef4444;
}

.summary-card.low .card-percent {
  color: #dc2626;
}

/* Benchmark Table */
.benchmark-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.benchmark-table th,
.benchmark-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.benchmark-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
}

.benchmark-table tbody tr:hover {
  background: #f8fafc;
}

.benchmark-table tbody tr:last-child td {
  border-bottom: none;
}

.employee-name {
  font-weight: 500;
  color: #1e293b;
}

.positive {
  color: #16a34a;
  font-weight: 500;
}

.negative {
  color: #dc2626;
  font-weight: 500;
}

.neutral {
  color: #d97706;
  font-weight: 500;
}

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

/* Analysis Section */
.analysis-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.analysis-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.analysis-card .card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.analysis-card .card-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.risk-card .card-header {
  color: #dc2626;
}

.suggestion-card .card-header {
  color: #f59e0b;
}

.analysis-card .card-content {
  padding: 16px 20px;
}

/* Risk Items */
.risk-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.risk-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.risk-badge {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.risk-item.risk-high .risk-badge {
  background: #fee2e2;
  color: #dc2626;
}

.risk-item.risk-low .risk-badge {
  background: #dcfce7;
  color: #16a34a;
}

.risk-text strong {
  display: block;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 4px;
}

.risk-text p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

/* Suggestion Items */
.suggestion-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.suggestion-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.suggestion-item .priority {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.suggestion-text strong {
  display: block;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 4px;
}

.suggestion-text p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

/* Scrollbar */
.job-list::-webkit-scrollbar {
  width: 6px;
}

.job-list::-webkit-scrollbar-track {
  background: transparent;
}

.job-list::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.job-list::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-bar {
    flex-wrap: wrap;
  }

  .analysis-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .job-sidebar {
    width: 240px;
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

  .page-body {
    flex-direction: column;
  }

  .job-sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .job-list {
    display: flex;
    overflow-x: auto;
    padding: 8px 12px;
  }

  .job-item {
    flex-shrink: 0;
    margin-bottom: 0;
    margin-right: 8px;
  }

  .summary-cards {
    flex-direction: column;
  }
}
</style>
