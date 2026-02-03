<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  Download,
  BookPlus,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Multiple jobs support
const jobs = ref([
  { id: 1, name: 'Java开发工程师', active: true },
  { id: 2, name: '前端开发工程师', active: false },
  { id: 3, name: '产品经理', active: false },
  { id: 4, name: '项目经理', active: false },
]);

const activeJobId = ref(1);

const selectJob = (id: number) => {
  activeJobId.value = id;
  jobs.value.forEach(j => j.active = j.id === id);
};

const activeJobName = ref(jobs.value.find(j => j.active)?.name || 'Java开发工程师');

// Mock salary data
const salaryOverview = {
  p25: '18K',
  p50: '25K',
  p75: '35K',
  p90: '50K',
  sampleCount: 3650,
  dataSource: 'BOSS直聘、猎聘',
  updateTime: '2026-02-03',
};

const salaryDistribution = ref([
  { range: '10K以下', count: 45, percentage: 5 },
  { range: '10-15K', count: 120, percentage: 12 },
  { range: '15-20K', count: 280, percentage: 28 },
  { range: '20-25K', count: 320, percentage: 32 },
  { range: '25-30K', count: 150, percentage: 15 },
  { range: '30K以上', count: 85, percentage: 8 },
]);

const regionalData = ref([
  { region: '北京', samples: 1200, p25: '18K', p50: '25K', p75: '35K', p90: '50K' },
  { region: '上海', samples: 980, p25: '17K', p50: '23K', p75: '32K', p90: '45K' },
  { region: '深圳', samples: 850, p25: '16K', p50: '22K', p75: '30K', p90: '42K' },
  { region: '杭州', samples: 620, p25: '15K', p50: '21K', p75: '28K', p90: '38K' },
]);

const benchmarkData = ref([
  { employee: '员工A', position: 'Java开发（初级）', current: '12K', marketP50: '15K', diff: -20, tag: 'low' },
  { employee: '员工B', position: 'Java开发（中级）', current: '22K', marketP50: '25K', diff: -12, tag: 'low' },
  { employee: '员工C', position: 'Java开发（高级）', current: '38K', marketP50: '35K', diff: 8.6, tag: 'high' },
  { employee: '员工D', position: '技术经理', current: '45K', marketP50: '48K', diff: -6.3, tag: 'normal' },
]);

const riskItems = [
  { level: 'high', title: '初级岗位薪资偏低', desc: '初级Java开发薪资低于市场P25水平，人才流失风险较高' },
  { level: 'medium', title: '中级岗位竞争力不足', desc: '中级岗位薪资低于市场中位数12%，可能影响招聘效果' },
  { level: 'low', title: '高级岗位具有竞争力', desc: '高级岗位薪资高于市场中位数，人才稳定性良好' },
];

const suggestions = [
  { priority: 1, title: '优先调整初级岗位薪资', desc: '建议将初级岗位薪资上调至市场P25水平（15K），预计增加人力成本约3万/年/人' },
  { priority: 2, title: '适度提升中级岗位薪资', desc: '建议将中级岗位薪资上调至市场P50水平（25K），以增强招聘竞争力' },
  { priority: 3, title: '保持高级岗位现有水平', desc: '高级岗位薪资已具竞争力，建议维持现状，关注绩效激励' },
];

const goBack = () => {
  router.push({ name: 'salary-survey-form' });
};

const getDiffIcon = (diff: number) => {
  if (diff > 0) return TrendingUp;
  if (diff < 0) return TrendingDown;
  return Minus;
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
    default: return '持平';
  }
};

const handleExport = () => {
  alert('导出报告');
};

const handleAddToKnowledge = () => {
  alert('已添加到知识库');
};
</script>

<template>
  <div class="result-page">
    <!-- Top Header Bar -->
    <header class="top-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
        </button>
        <span class="file-name">岗位薪酬调查报告</span>
      </div>
      <div class="header-actions">
        <button class="action-btn primary" @click="handleExport">
          <Download :size="16" />
          <span>导出报告</span>
        </button>
        <button class="action-btn secondary" @click="handleAddToKnowledge">
          <BookPlus :size="16" />
          <span>加入知识库</span>
        </button>
      </div>
    </header>

    <div class="content-wrapper">
      <!-- Left Sidebar: Job List -->
      <aside class="left-sidebar">
        <div class="file-list">
          <div
            v-for="job in jobs"
            :key="job.id"
            class="file-item"
            :class="{ active: job.id === activeJobId }"
            @click="selectJob(job.id)"
          >
            <FileText :size="16" />
            <span class="file-item-name">{{ job.name }}</span>
          </div>
        </div>
      </aside>

      <!-- Main Content: Word-style Report -->
      <main class="main-content">
        <div class="report-container">
          <div class="report-meta">
            调查岗位：{{ activeJobName }} | 生成时间：{{ salaryOverview.updateTime }} | 数据来源：{{ salaryOverview.dataSource }}
          </div>

          <!-- Section 1: Overview -->
          <section class="report-section">
            <h2 class="section-title">一、薪酬概览</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>分位值</th>
                  <th>P25（25分位）</th>
                  <th>P50（中位数）</th>
                  <th>P75（75分位）</th>
                  <th>P90（90分位）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="label-cell">薪资水平</td>
                  <td>{{ salaryOverview.p25 }}</td>
                  <td class="highlight-cell">{{ salaryOverview.p50 }}</td>
                  <td>{{ salaryOverview.p75 }}</td>
                  <td>{{ salaryOverview.p90 }}</td>
                </tr>
                <tr>
                  <td class="label-cell">说明</td>
                  <td>低于75%的市场水平</td>
                  <td class="highlight-cell">市场中间水平</td>
                  <td>高于75%的市场水平</td>
                  <td>顶尖薪资水平</td>
                </tr>
              </tbody>
            </table>
            <p class="table-note">样本数量：{{ salaryOverview.sampleCount }} 条 | 数据更新：{{ salaryOverview.updateTime }}</p>
          </section>

          <!-- Section 2: Distribution -->
          <section class="report-section">
            <h2 class="section-title">二、薪酬分布</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>薪资区间</th>
                  <th>样本数量</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in salaryDistribution" :key="item.range">
                  <td>{{ item.range }}</td>
                  <td>{{ item.count }} 条</td>
                  <td>{{ item.percentage }}%</td>
                </tr>
              </tbody>
            </table>
            <p class="table-note">说明：薪酬主要集中在15-25K区间，占比达60%，符合{{ activeJobName }}市场主流薪资水平。</p>
          </section>

          <!-- Section 3: Regional -->
          <section class="report-section">
            <h2 class="section-title">三、地区薪酬对比</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>地区</th>
                  <th>样本数</th>
                  <th>P25</th>
                  <th>P50（中位数）</th>
                  <th>P75</th>
                  <th>P90</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in regionalData" :key="row.region">
                  <td>{{ row.region }}</td>
                  <td>{{ row.samples }}</td>
                  <td>{{ row.p25 }}</td>
                  <td class="highlight-cell">{{ row.p50 }}</td>
                  <td>{{ row.p75 }}</td>
                  <td>{{ row.p90 }}</td>
                </tr>
              </tbody>
            </table>
            <p class="table-note">说明：北京地区薪资水平最高，其次为上海和深圳，杭州相对较低但差距不大。</p>
          </section>

          <!-- Section 4: Benchmark -->
          <section class="report-section">
            <h2 class="section-title">四、公司薪酬对标分析</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>员工</th>
                  <th>岗位</th>
                  <th>当前薪资</th>
                  <th>市场P50</th>
                  <th>差异</th>
                  <th>评估</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in benchmarkData" :key="row.employee">
                  <td>{{ row.employee }}</td>
                  <td>{{ row.position }}</td>
                  <td>{{ row.current }}</td>
                  <td>{{ row.marketP50 }}</td>
                  <td :class="row.diff > 0 ? 'positive-text' : row.diff < -10 ? 'negative-text' : 'neutral-text'">
                    <component :is="getDiffIcon(row.diff)" :size="14" style="vertical-align: middle;" />
                    {{ row.diff > 0 ? '+' : '' }}{{ row.diff }}%
                  </td>
                  <td>
                    <span class="status-tag" :class="getTagClass(row.tag)">
                      {{ getTagText(row.tag) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="summary-table">
              <tr>
                <td class="label-cell">高于市场</td>
                <td class="positive-text">1人（25%）</td>
                <td class="label-cell">持平市场</td>
                <td class="neutral-text">1人（25%）</td>
                <td class="label-cell">低于市场</td>
                <td class="negative-text">2人（50%）</td>
              </tr>
            </table>
          </section>

          <!-- Section 5: Risk -->
          <section class="report-section">
            <h2 class="section-title">五、风险提示</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>风险等级</th>
                  <th>风险项</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in riskItems" :key="item.title">
                  <td>
                    <span class="risk-badge" :class="'risk-' + item.level">
                      {{ item.level === 'high' ? '高' : item.level === 'medium' ? '中' : '低' }}
                    </span>
                  </td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.desc }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 6: Suggestion -->
          <section class="report-section">
            <h2 class="section-title">六、调整建议</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>优先级</th>
                  <th>建议项</th>
                  <th>具体说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in suggestions" :key="item.priority">
                  <td>
                    <span class="priority-badge">{{ item.priority }}</span>
                  </td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.desc }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 7: Conclusion -->
          <section class="report-section last">
            <h2 class="section-title">七、总结</h2>
            <p class="conclusion-text">
              综合以上分析，贵公司{{ activeJobName }}岗位整体薪资水平略低于市场中位数。建议优先调整初级岗位薪资以降低人才流失风险，同时适度提升中级岗位薪资以增强招聘竞争力。高级岗位薪资已具竞争力，可维持现状。预计总体调薪成本增加约 <strong>8-12%</strong>。
            </p>
          </section>
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

/* Top Header */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
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
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.file-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.header-actions {
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

/* Content Wrapper */
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Sidebar */
.left-sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 16px;
  flex-shrink: 0;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover {
  background: #f8fafc;
}

.file-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.file-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.report-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 32px 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.report-meta {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

/* Right Spacer */
.right-spacer {
  width: 80px;
  flex-shrink: 0;
}

/* Report Sections */
.report-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.report-section.last {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #2563eb;
}

/* Data Tables - Word Document Style */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 12px;
}

.data-table th,
.data-table td {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  text-align: left;
}

.data-table th {
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
}

.data-table td {
  color: #374151;
}

.label-cell {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 500;
}

.highlight-cell {
  font-weight: 600;
  color: #2563eb;
}

.table-note {
  font-size: 13px;
  color: #6b7280;
  margin: 8px 0 0 0;
  font-style: italic;
}

/* Summary Table */
.summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 12px;
}

.summary-table td {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
}

/* Text Colors */
.positive-text {
  color: #16a34a;
  font-weight: 500;
}

.negative-text {
  color: #dc2626;
  font-weight: 500;
}

.neutral-text {
  color: #d97706;
  font-weight: 500;
}

/* Status Tags */
.status-tag {
  display: inline-block;
  padding: 3px 10px;
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

/* Risk Badge */
.risk-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.risk-badge.risk-high {
  background: #fee2e2;
  color: #dc2626;
}

.risk-badge.risk-medium {
  background: #fef3c7;
  color: #d97706;
}

.risk-badge.risk-low {
  background: #dcfce7;
  color: #16a34a;
}

/* Priority Badge */
.priority-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}

/* Conclusion */
.conclusion-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.8;
  margin: 0;
}

.conclusion-text strong {
  color: #2563eb;
}
</style>
