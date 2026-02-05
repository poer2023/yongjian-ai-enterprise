<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  DollarSign,
  FileUser,
  UserCheck,
  Search,
  Upload,
  Flame,
  Plus,
  Trash2,
  FileText,
  X,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data for manual entry
const newJobName = ref('');
const newSalary = ref('');

// Uploaded file
const uploadedFile = ref<File | null>(null);

// Mock data for monitored positions
const monitoredPositions = ref([
  { id: 1, jobName: 'Java开发工程师', salary: 25000, marketAvg: 28000, region: '上海', addedDate: '2026-01-15' },
  { id: 2, jobName: '产品经理', salary: 30000, marketAvg: 32000, region: '上海', addedDate: '2026-01-18' },
  { id: 3, jobName: '前端开发工程师', salary: 22000, marketAvg: 24000, region: '上海', addedDate: '2026-01-20' },
  { id: 4, jobName: 'UI设计师', salary: 18000, marketAvg: 17000, region: '上海', addedDate: '2026-01-22' },
  { id: 5, jobName: '数据分析师', salary: 26000, marketAvg: 27500, region: '上海', addedDate: '2026-01-25' },
  { id: 6, jobName: '运维工程师', salary: 20000, marketAvg: 21000, region: '上海', addedDate: '2026-01-28' },
  { id: 7, jobName: '测试工程师', salary: 18000, marketAvg: 19000, region: '上海', addedDate: '2026-02-01' },
  { id: 8, jobName: '人力资源经理', salary: 25000, marketAvg: 26000, region: '上海', addedDate: '2026-02-03' },
]);

const recentTools = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

const features = [
  '全网薪酬数据智能采集',
  '多维度薪酬分布分析',
  '精准分位值对标',
  '可视化图表呈现',
  '一键导出分析报告',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const addPosition = () => {
  if (!newJobName.value.trim() || !newSalary.value.trim()) return;

  const salary = parseInt(newSalary.value);
  if (isNaN(salary)) return;

  // Mock market average (random variation around input salary)
  const marketAvg = Math.round(salary * (0.9 + Math.random() * 0.2));

  monitoredPositions.value.unshift({
    id: Date.now(),
    jobName: newJobName.value.trim(),
    salary: salary,
    marketAvg: marketAvg,
    region: '上海',
    addedDate: new Date().toISOString().split('T')[0] ?? '',
  });

  newJobName.value = '';
  newSalary.value = '';
};

const removePosition = (id: number) => {
  monitoredPositions.value = monitoredPositions.value.filter(p => p.id !== id);
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
    // Mock: add some positions from the "uploaded file"
    const mockImportData = [
      { jobName: '架构师', salary: 45000 },
      { jobName: '技术总监', salary: 55000 },
      { jobName: '项目经理', salary: 35000 },
    ];
    mockImportData.forEach((item, index) => {
      setTimeout(() => {
        const marketAvg = Math.round(item.salary * (0.9 + Math.random() * 0.2));
        monitoredPositions.value.unshift({
          id: Date.now() + index,
          jobName: item.jobName,
          salary: item.salary,
          marketAvg: marketAvg,
          region: '上海',
          addedDate: new Date().toISOString().split('T')[0] ?? '',
        });
      }, 500 * (index + 1));
    });
  }
};

const removeFile = () => {
  uploadedFile.value = null;
};

const getSalaryDiff = (salary: number, marketAvg: number) => {
  return ((salary - marketAvg) / marketAvg * 100).toFixed(1);
};

const getSalaryStatus = (salary: number, marketAvg: number) => {
  const diff = (salary - marketAvg) / marketAvg;
  if (diff > 0.05) return 'high';
  if (diff < -0.05) return 'low';
  return 'normal';
};

const handleSubmit = () => {
  router.push({
    name: 'salary-survey-result',
    query: {
      count: monitoredPositions.value.length.toString(),
    },
  });
};
</script>

<template>
  <div class="review-form-page">
    <!-- Left Sidebar -->
    <aside class="template-sidebar">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回智能体应用市场</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索其他智能体" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">最近使用</div>
        <div
          v-for="(item, index) in recentTools"
          :key="index"
          class="template-item"
          :class="{ active: index === 2 }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
          <Flame v-if="index === 2" :size="14" class="hot-icon" />
        </div>
      </div>
    </aside>

    <!-- Main Form Area -->
    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <DollarSign :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">岗位薪酬调查</h1>
          <p class="form-subtitle">录入公司岗位薪资，智能对标市场薪酬水平</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 添加岗位区域 -->
        <div class="add-section">
          <h3 class="section-title">添加监控岗位</h3>

          <!-- 手动录入 -->
          <div class="manual-entry">
            <div class="entry-row">
              <div class="entry-field">
                <label class="field-label">目标岗位</label>
                <input
                  v-model="newJobName"
                  type="text"
                  class="field-input"
                  placeholder="如：Java开发工程师"
                />
              </div>
              <div class="entry-field salary-field">
                <label class="field-label">实际薪资（月薪）</label>
                <div class="salary-input-wrapper">
                  <input
                    v-model="newSalary"
                    type="number"
                    class="field-input"
                    placeholder="如：25000"
                  />
                  <span class="salary-unit">元/月</span>
                </div>
              </div>
              <button class="add-btn" @click="addPosition" :disabled="!newJobName.trim() || !newSalary.trim()">
                <Plus :size="18" />
                添加
              </button>
            </div>
          </div>

          <!-- 分隔线 -->
          <div class="divider">
            <span class="divider-text">或</span>
          </div>

          <!-- 批量导入 -->
          <div class="batch-import">
            <label v-if="!uploadedFile" class="upload-area">
              <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" hidden />
              <Upload :size="24" />
              <div class="upload-text">
                <span class="upload-main">上传Excel批量导入</span>
                <span class="upload-hint">支持 .xlsx, .xls 格式，需包含岗位名称和薪资列</span>
              </div>
            </label>
            <div v-else class="uploaded-file-card">
              <div class="file-info">
                <FileText :size="24" class="file-icon" />
                <div class="file-details">
                  <span class="file-name">{{ uploadedFile.name }}</span>
                  <span class="file-size">{{ (uploadedFile.size / 1024).toFixed(1) }} KB</span>
                </div>
              </div>
              <button class="remove-file-btn" @click="removeFile">
                <X :size="18" />
              </button>
            </div>
          </div>
        </div>

        <!-- 已录入岗位列表 -->
        <div class="positions-section">
          <div class="section-header">
            <h3 class="section-title">监控岗位列表</h3>
            <span class="position-count">共 {{ monitoredPositions.length }} 个岗位</span>
          </div>

          <div class="positions-table">
            <div class="table-header">
              <span class="col-job">岗位名称</span>
              <span class="col-salary">实际薪资</span>
              <span class="col-market">市场均值</span>
              <span class="col-diff">差异</span>
              <span class="col-date">添加日期</span>
              <span class="col-action">操作</span>
            </div>
            <div class="table-body">
              <div v-for="position in monitoredPositions" :key="position.id" class="table-row">
                <span class="col-job">
                  <DollarSign :size="16" class="job-icon" />
                  {{ position.jobName }}
                </span>
                <span class="col-salary">¥{{ position.salary.toLocaleString() }}</span>
                <span class="col-market">¥{{ position.marketAvg.toLocaleString() }}</span>
                <span class="col-diff" :class="'status-' + getSalaryStatus(position.salary, position.marketAvg)">
                  <TrendingUp v-if="getSalaryStatus(position.salary, position.marketAvg) === 'high'" :size="14" />
                  <TrendingDown v-else-if="getSalaryStatus(position.salary, position.marketAvg) === 'low'" :size="14" />
                  <Minus v-else :size="14" />
                  {{ getSalaryDiff(position.salary, position.marketAvg) }}%
                </span>
                <span class="col-date">{{ position.addedDate }}</span>
                <span class="col-action">
                  <button class="delete-btn" @click="removePosition(position.id)">
                    <Trash2 :size="14" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit" :disabled="monitoredPositions.length === 0">
            生成薪酬对标报告
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-icon-wrapper">
        <DollarSign :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">薪酬调查</h3>
      <p class="info-desc">全网薪酬数据采集分析，为薪酬决策提供数据支撑</p>
      <ul class="feature-list">
        <li v-for="(feature, index) in features" :key="index">
          <span class="bullet">●</span>
          {{ feature }}
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.review-form-page {
  display: flex;
  height: 100%;
  background: #f8fafc;
}

.template-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #eff6ff;
  border: none;
  border-radius: 8px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dbeafe;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.search-icon {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #475569;
}

.search-input::placeholder {
  color: #94a3b8;
}

.template-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-section .section-title {
  font-size: 12px;
  color: #94a3b8;
  padding: 12px 0 8px 0;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f8fafc;
}

.template-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.template-item.active .item-icon {
  color: #2563eb;
}

.hot-icon {
  color: #f97316;
  margin-left: auto;
}

.form-main {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -24px -32px 32px -32px;
  padding: 20px 32px;
  background: #eff6ff;
}

.form-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin: 0;
}

.form-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.form-content {
  max-width: 100%;
}

/* Add Section */
.add-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.manual-entry {
  margin-bottom: 20px;
}

.entry-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.entry-field {
  flex: 1;
}

.entry-field.salary-field {
  flex: 0.8;
}

.field-label {
  display: block;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
}

.field-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: #2563eb;
}

.field-input::placeholder {
  color: #94a3b8;
}

.salary-input-wrapper {
  position: relative;
}

.salary-input-wrapper .field-input {
  padding-right: 60px;
}

.salary-unit {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: #94a3b8;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.add-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  font-size: 13px;
  color: #94a3b8;
}

/* Batch Import */
.upload-area {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.upload-main {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

/* Uploaded file card */
.uploaded-file-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.uploaded-file-card .file-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.uploaded-file-card .file-icon {
  color: #3b82f6;
}

.uploaded-file-card .file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uploaded-file-card .file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.uploaded-file-card .file-size {
  font-size: 12px;
  color: #64748b;
}

.uploaded-file-card .remove-file-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.uploaded-file-card .remove-file-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}

/* Positions Section */
.positions-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin: 0;
}

.position-count {
  font-size: 13px;
  color: #64748b;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 12px;
}

/* Positions Table */
.positions-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 0.8fr 1fr 0.5fr;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 0.8fr 1fr 0.5fr;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 14px;
  color: #334155;
  transition: background 0.15s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fafc;
}

.col-job {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.job-icon {
  color: #3b82f6;
}

.col-salary {
  font-weight: 600;
  color: #1e293b;
}

.col-market {
  color: #64748b;
}

.col-diff {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  font-size: 13px;
}

.col-diff.status-high {
  color: #16a34a;
}

.col-diff.status-low {
  color: #dc2626;
}

.col-diff.status-normal {
  color: #64748b;
}

.col-date {
  color: #94a3b8;
  font-size: 13px;
}

.col-action {
  display: flex;
  justify-content: center;
}

.delete-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}

/* Submit */
.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-bottom: 40px;
}

.submit-btn {
  width: 280px;
  padding: 14px 48px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* Right Info Sidebar */
.info-sidebar {
  width: 260px;
  padding: 40px 24px;
  background: transparent;
  border-left: 1px solid #e2e8f0;
}

.info-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.info-main-icon {
  color: white;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.info-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 6px 0;
  line-height: 1.4;
}

.bullet {
  color: #2563eb;
  font-size: 8px;
  margin-top: 5px;
}

/* Scrollbar styling */
.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-track {
  background: transparent;
}

.table-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
