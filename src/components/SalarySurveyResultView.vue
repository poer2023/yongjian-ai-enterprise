<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  DollarSign,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  FileSpreadsheet
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const jobName = route.query.job as string || 'Java开发工程师';
const regions = (route.query.regions as string || '北京,上海').split(',');

// 模拟薪酬分布数据
const salaryDistribution = ref([
  { range: '10K以下', count: 45, percentage: 5 },
  { range: '10-15K', count: 120, percentage: 12 },
  { range: '15-20K', count: 280, percentage: 28 },
  { range: '20-25K', count: 320, percentage: 32 },
  { range: '25-30K', count: 150, percentage: 15 },
  { range: '30K以上', count: 85, percentage: 8 },
]);

// 分位值数据
const percentileData = ref([
  { position: 'Java开发工程师', region: '北京', samples: 1200, p25: '18K', p50: '25K', p75: '35K', p90: '50K' },
  { position: 'Java开发工程师', region: '上海', samples: 980, p25: '17K', p50: '23K', p75: '32K', p90: '45K' },
  { position: 'Java开发工程师', region: '深圳', samples: 850, p25: '16K', p50: '22K', p75: '30K', p90: '42K' },
  { position: 'Java开发工程师', region: '杭州', samples: 620, p25: '15K', p50: '21K', p75: '28K', p90: '38K' },
]);

// 对标分析数据
const benchmarkData = ref([
  { position: 'Java开发（初级）', companySalary: '12K', marketP50: '15K', diff: -20, suggestion: '薪资偏低，建议调整' },
  { position: 'Java开发（中级）', companySalary: '22K', marketP50: '25K', diff: -12, suggestion: '略低于市场，关注人才流失' },
  { position: 'Java开发（高级）', companySalary: '38K', marketP50: '35K', diff: 8.6, suggestion: '薪资具有竞争力' },
  { position: '技术经理', companySalary: '45K', marketP50: '48K', diff: -6.3, suggestion: '基本持平，可适当调整' },
]);

const goBack = () => {
  router.push({ name: 'salary-survey-form' });
};

const getDiffClass = (diff: number) => {
  if (diff > 0) return 'diff-positive';
  if (diff < -10) return 'diff-negative';
  return 'diff-neutral';
};

const getDiffIcon = (diff: number) => {
  if (diff > 0) return TrendingUp;
  if (diff < 0) return TrendingDown;
  return Minus;
};

const exportExcel = () => {
  console.log('导出Excel');
  alert('Excel报告已生成');
};

const exportPdf = () => {
  console.log('导出PDF');
  alert('PDF报告已生成');
};
</script>

<template>
  <div class="result-page">
    <!-- Header -->
    <div class="result-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回</span>
      </button>
      <div class="header-title">
        <DollarSign :size="20" />
        <h1>薪酬调查报告</h1>
        <span class="job-tag">{{ jobName }}</span>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary" @click="exportExcel">
          <FileSpreadsheet :size="16" />
          导出Excel
        </button>
        <button class="action-btn primary" @click="exportPdf">
          <Download :size="16" />
          导出PDF
        </button>
      </div>
    </div>

    <div class="result-content">
      <!-- 薪酬分布图表 -->
      <div class="chart-section">
        <div class="section-header">
          <BarChart3 :size="18" />
          <h2>薪酬分布</h2>
          <span class="sample-count">样本量：{{ percentileData.reduce((sum, d) => sum + d.samples, 0) }}条</span>
        </div>
        <div class="chart-container">
          <div class="bar-chart">
            <div
              v-for="(item, index) in salaryDistribution"
              :key="index"
              class="bar-item"
            >
              <div class="bar-label">{{ item.range }}</div>
              <div class="bar-wrapper">
                <div
                  class="bar-fill"
                  :style="{ width: item.percentage * 3 + 'px' }"
                ></div>
                <span class="bar-value">{{ item.percentage }}%</span>
              </div>
              <div class="bar-count">{{ item.count }}条</div>
            </div>
          </div>
          <div class="percentile-summary">
            <div class="percentile-item">
              <span class="percentile-label">P25</span>
              <span class="percentile-value">18K</span>
            </div>
            <div class="percentile-item highlight">
              <span class="percentile-label">P50</span>
              <span class="percentile-value">25K</span>
            </div>
            <div class="percentile-item">
              <span class="percentile-label">P75</span>
              <span class="percentile-value">35K</span>
            </div>
            <div class="percentile-item">
              <span class="percentile-label">P90</span>
              <span class="percentile-value">50K</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 薪酬数据表格 -->
      <div class="data-section">
        <div class="section-header">
          <h2>各地区薪酬数据</h2>
        </div>
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>岗位</th>
                <th>地区</th>
                <th>样本数</th>
                <th>P25</th>
                <th>P50</th>
                <th>P75</th>
                <th>P90</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in percentileData" :key="index">
                <td>{{ row.position }}</td>
                <td>
                  <span class="region-tag">{{ row.region }}</span>
                </td>
                <td>{{ row.samples }}</td>
                <td>{{ row.p25 }}</td>
                <td class="highlight-cell">{{ row.p50 }}</td>
                <td>{{ row.p75 }}</td>
                <td>{{ row.p90 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 对标分析 -->
      <div class="benchmark-section">
        <div class="section-header">
          <TrendingUp :size="18" />
          <h2>对标分析</h2>
        </div>
        <div class="benchmark-table">
          <table>
            <thead>
              <tr>
                <th>岗位</th>
                <th>公司薪资</th>
                <th>市场P50</th>
                <th>差异</th>
                <th>建议</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in benchmarkData" :key="index">
                <td>{{ row.position }}</td>
                <td>{{ row.companySalary }}</td>
                <td>{{ row.marketP50 }}</td>
                <td>
                  <div class="diff-cell" :class="getDiffClass(row.diff)">
                    <component :is="getDiffIcon(row.diff)" :size="14" />
                    <span>{{ row.diff > 0 ? '+' : '' }}{{ row.diff }}%</span>
                  </div>
                </td>
                <td>
                  <span class="suggestion-text">{{ row.suggestion }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 总结建议 -->
      <div class="summary-section">
        <div class="section-header">
          <h2>总结与建议</h2>
        </div>
        <div class="summary-content">
          <div class="summary-item">
            <div class="summary-icon">📊</div>
            <div class="summary-text">
              <h4>市场薪酬水平</h4>
              <p>{{ jobName }}岗位在北京地区的市场中位数薪资为25K，处于行业较高水平。</p>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-icon">⚠️</div>
            <div class="summary-text">
              <h4>关注重点</h4>
              <p>初级和中级岗位薪资低于市场水平，建议重点关注，避免核心人才流失。</p>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-icon">💡</div>
            <div class="summary-text">
              <h4>调薪建议</h4>
              <p>建议将初级岗位薪资上调至市场P25水平（15K），中级岗位上调至P50水平（25K）。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #eff6ff;
  border: none;
  border-radius: 6px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dbeafe;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2563eb;
}

.header-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.job-tag {
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 13px;
  color: #64748b;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #2563eb;
  color: white;
}

.action-btn.primary:hover {
  background: #1e40af;
}

.action-btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #f8fafc;
}

.result-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-section,
.data-section,
.benchmark-section,
.summary-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.section-header svg {
  color: #2563eb;
}

.sample-count {
  margin-left: auto;
  font-size: 13px;
  color: #64748b;
}

.chart-container {
  display: flex;
  gap: 40px;
}

.bar-chart {
  flex: 1;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.bar-label {
  width: 80px;
  font-size: 13px;
  color: #475569;
  text-align: right;
}

.bar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-fill {
  height: 24px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 4px;
  min-width: 4px;
}

.bar-value {
  font-size: 13px;
  font-weight: 500;
  color: #2563eb;
}

.bar-count {
  font-size: 12px;
  color: #94a3b8;
}

.percentile-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 10px;
  min-width: 140px;
}

.percentile-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
}

.percentile-item.highlight {
  background: #eff6ff;
  border: 1px solid #2563eb;
}

.percentile-label {
  font-size: 13px;
  color: #64748b;
}

.percentile-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.percentile-item.highlight .percentile-value {
  color: #2563eb;
}

.data-table,
.benchmark-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

th {
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

td {
  font-size: 14px;
  color: #334155;
}

.region-tag {
  padding: 4px 10px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 12px;
  font-size: 12px;
}

.highlight-cell {
  font-weight: 600;
  color: #2563eb;
}

.diff-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.diff-positive {
  color: #16a34a;
}

.diff-negative {
  color: #dc2626;
}

.diff-neutral {
  color: #d97706;
}

.suggestion-text {
  font-size: 13px;
  color: #64748b;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.summary-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.summary-icon {
  font-size: 24px;
}

.summary-text h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.summary-text p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}
</style>
