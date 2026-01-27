<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  DollarSign,
  FileUser,
  UserCheck,
  Search,
  Upload,
  MapPin,
  Briefcase,
  Database
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// 目标岗位配置
const jobName = ref('');
const jobType = ref('');
const experienceMin = ref('');
const experienceMax = ref('');

// 采集范围配置
const selectedRegions = ref<string[]>([]);
const selectedSources = ref<string[]>([]);

// 对标配置
const benchmarkMode = ref<'upload' | 'manual'>('upload');
const uploadedFile = ref<File | null>(null);
const manualData = ref([
  { position: '', salary: '', count: '' },
]);

const jobTypeOptions = [
  { value: 'tech', label: '技术类' },
  { value: 'sales', label: '销售类' },
  { value: 'admin', label: '职能类' },
  { value: 'management', label: '管理类' },
];

const regionOptions = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'guangzhou', label: '广州' },
  { value: 'hangzhou', label: '杭州' },
  { value: 'nanjing', label: '南京' },
  { value: 'chengdu', label: '成都' },
  { value: 'wuhan', label: '武汉' },
];

const sourceOptions = [
  { value: 'boss', label: 'BOSS直聘', icon: '🔵' },
  { value: 'liepin', label: '猎聘', icon: '🟢' },
  { value: 'lagou', label: '拉勾', icon: '🟡' },
  { value: 'zhilian', label: '智联招聘', icon: '🔴' },
  { value: 'maimai', label: '脉脉', icon: '🟣' },
];

const templateTypes = [
  { icon: DollarSign, label: '薪酬调查', active: true, routeName: 'salary-survey-form' },
  { icon: FileUser, label: '简历分析', routeName: 'resume-analysis-form' },
  { icon: UserCheck, label: 'Boss招聘', routeName: 'boss-recruit-form' },
];

const features = [
  '全网薪酬数据智能采集',
  '多维度薪酬分布分析',
  '精准分位值对标',
  '可视化图表呈现',
  '一键导出分析报告',
];

const goBack = () => {
  router.push({ name: 'home' });
};

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const toggleRegion = (value: string) => {
  const index = selectedRegions.value.indexOf(value);
  if (index > -1) {
    selectedRegions.value.splice(index, 1);
  } else {
    selectedRegions.value.push(value);
  }
};

const toggleSource = (value: string) => {
  const index = selectedSources.value.indexOf(value);
  if (index > -1) {
    selectedSources.value.splice(index, 1);
  } else {
    selectedSources.value.push(value);
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
  }
};

const addManualRow = () => {
  manualData.value.push({ position: '', salary: '', count: '' });
};

const removeManualRow = (index: number) => {
  if (manualData.value.length > 1) {
    manualData.value.splice(index, 1);
  }
};

const handleSubmit = () => {
  const formData = {
    job: {
      name: jobName.value,
      type: jobType.value,
      experience: { min: experienceMin.value, max: experienceMax.value },
    },
    collection: {
      regions: selectedRegions.value,
      sources: selectedSources.value,
    },
    benchmark: {
      mode: benchmarkMode.value,
      file: uploadedFile.value?.name,
      data: manualData.value,
    },
  };
  console.log('Submitting:', formData);

  router.push({
    name: 'salary-survey-result',
    query: {
      job: jobName.value,
      regions: selectedRegions.value.join(','),
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
        <span>返回首页</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索HR工具" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">HR工具</div>
        <div
          v-for="(item, index) in templateTypes"
          :key="index"
          class="template-item"
          :class="{ active: item.active }"
          @click="navigateTo(item.routeName)"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
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
          <p class="form-subtitle">智能爬取全网薪酬数据，生成多维度薪酬对标报告</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 目标岗位配置 -->
        <div class="form-section">
          <div class="section-header">
            <Briefcase :size="16" />
            <span>目标岗位配置</span>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">
                <span class="required">*</span> 岗位名称
              </label>
              <input
                v-model="jobName"
                type="text"
                class="form-input"
                placeholder="如：Java开发工程师"
              />
            </div>
            <div class="form-group half">
              <label class="form-label">
                <span class="required">*</span> 岗位类型
              </label>
              <select v-model="jobType" class="form-select">
                <option value="">请选择岗位类型</option>
                <option v-for="opt in jobTypeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">工作年限范围</label>
            <div class="range-input">
              <input
                v-model="experienceMin"
                type="text"
                class="form-input range-field"
                placeholder="最低"
              />
              <span class="range-separator">-</span>
              <input
                v-model="experienceMax"
                type="text"
                class="form-input range-field"
                placeholder="最高"
              />
              <span class="range-unit">年</span>
            </div>
          </div>
        </div>

        <!-- 采集范围配置 -->
        <div class="form-section">
          <div class="section-header">
            <MapPin :size="16" />
            <span>采集范围配置</span>
          </div>

          <div class="form-group">
            <label class="form-label">地区选择（可多选）</label>
            <div class="option-selector four-col">
              <button
                v-for="region in regionOptions"
                :key="region.value"
                class="option-btn"
                :class="{ active: selectedRegions.includes(region.value) }"
                @click="toggleRegion(region.value)"
              >
                {{ region.label }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">数据来源（可多选）</label>
            <div class="option-selector five-col">
              <button
                v-for="source in sourceOptions"
                :key="source.value"
                class="option-btn source-btn"
                :class="{ active: selectedSources.includes(source.value) }"
                @click="toggleSource(source.value)"
              >
                <span class="source-icon">{{ source.icon }}</span>
                {{ source.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- 对标配置 -->
        <div class="form-section">
          <div class="section-header">
            <Database :size="16" />
            <span>对标配置（可选）</span>
          </div>

          <div class="form-group">
            <label class="form-label">数据输入方式</label>
            <div class="option-selector two-col">
              <button
                class="option-btn"
                :class="{ active: benchmarkMode === 'upload' }"
                @click="benchmarkMode = 'upload'"
              >
                上传Excel文件
              </button>
              <button
                class="option-btn"
                :class="{ active: benchmarkMode === 'manual' }"
                @click="benchmarkMode = 'manual'"
              >
                手动输入
              </button>
            </div>
          </div>

          <div v-if="benchmarkMode === 'upload'" class="form-group">
            <label class="upload-area">
              <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" hidden />
              <Upload :size="32" />
              <div class="upload-text">
                <span class="upload-main">点击上传公司薪酬数据</span>
                <span class="upload-hint">支持 .xlsx, .xls 格式</span>
              </div>
              <span v-if="uploadedFile" class="upload-file">{{ uploadedFile.name }}</span>
            </label>
          </div>

          <div v-else class="form-group">
            <div class="manual-table">
              <div class="table-header">
                <span>岗位名称</span>
                <span>当前薪资（K）</span>
                <span>人数</span>
                <span>操作</span>
              </div>
              <div v-for="(row, index) in manualData" :key="index" class="table-row">
                <input v-model="row.position" type="text" class="form-input" placeholder="岗位" />
                <input v-model="row.salary" type="text" class="form-input" placeholder="薪资" />
                <input v-model="row.count" type="text" class="form-input" placeholder="人数" />
                <button class="remove-btn" @click="removeManualRow(index)">×</button>
              </div>
              <button class="add-row-btn" @click="addManualRow">+ 添加一行</button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit">
            开始调查
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-card">
        <div class="info-icon">💰</div>
        <h3 class="info-title">薪酬调查</h3>
        <p class="info-desc">全网薪酬数据采集分析，为薪酬决策提供数据支撑</p>
        <ul class="feature-list">
          <li v-for="(feature, index) in features" :key="index">
            <span class="bullet">●</span>
            {{ feature }}
          </li>
        </ul>
      </div>
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.search-icon {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  color: #475569;
}

.template-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 12px;
  color: #94a3b8;
  padding: 8px 0 4px 0;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f1f5f9;
}

.template-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
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
  margin-bottom: 32px;
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
  color: #1e293b;
  margin: 0;
}

.form-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.form-content {
  max-width: 100%;
  padding-right: 40px;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.section-header svg {
  color: #2563eb;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.half {
  flex: 1;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #2563eb;
  margin-right: 2px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.range-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-field {
  width: 100px;
  text-align: center;
}

.range-separator {
  color: #94a3b8;
}

.range-unit {
  color: #64748b;
  font-size: 14px;
}

.option-selector {
  display: flex;
  gap: 12px;
}

.option-selector.two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.option-selector.four-col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.option-selector.five-col {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.option-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.source-icon {
  font-size: 12px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  color: #64748b;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-text {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}

.upload-main {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.upload-file {
  margin-top: 12px;
  padding: 6px 12px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 13px;
}

.manual-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 80px 60px;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 80px 60px;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #f1f5f9;
}

.table-row .form-input {
  padding: 8px 12px;
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fecaca;
}

.add-row-btn {
  width: 100%;
  padding: 10px;
  border: none;
  background: #f8fafc;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-row-btn:hover {
  background: #eff6ff;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-bottom: 40px;
}

.submit-btn {
  width: 200px;
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

.submit-btn:hover {
  background: #1e40af;
}

.info-sidebar {
  width: 280px;
  padding: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.info-icon {
  font-size: 48px;
  margin-bottom: 16px;
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
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 6px 0;
}

.bullet {
  color: #2563eb;
  font-size: 8px;
}
</style>
