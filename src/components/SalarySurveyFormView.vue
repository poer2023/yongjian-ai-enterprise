<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  DollarSign,
  FileUser,
  UserCheck,
  Search,
  Upload,
  Flame
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const jobName = ref('');
const jobNameMaxLength = 50;
const jobType = ref('');
const experienceRange = ref('');
const selectedRegions = ref<string[]>([]);
const selectedSources = ref<string[]>([]);
const benchmarkMode = ref('upload');
const uploadedFile = ref<File | null>(null);

const recentTools = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

const jobTypeOptions = [
  { key: 'tech', icon: '技', label: '技术类' },
  { key: 'sales', icon: '销', label: '销售类' },
  { key: 'admin', icon: '职', label: '职能类' },
  { key: 'management', icon: '管', label: '管理类' },
];

const experienceOptions = [
  { key: '0-3', icon: '初', label: '0-3年' },
  { key: '3-5', icon: '3-5', label: '3-5年' },
  { key: '5-10', icon: '5+', label: '5-10年' },
  { key: '10+', icon: '10+', label: '10年以上' },
];

const regionOptions = [
  { key: 'beijing', icon: '京', label: '北京' },
  { key: 'shanghai', icon: '沪', label: '上海' },
  { key: 'shenzhen', icon: '深', label: '深圳' },
  { key: 'guangzhou', icon: '广', label: '广州' },
  { key: 'hangzhou', icon: '杭', label: '杭州' },
  { key: 'chengdu', icon: '蓉', label: '成都' },
];

const sourceOptions = [
  { key: 'boss', icon: 'B', label: 'BOSS直聘' },
  { key: 'liepin', icon: '猎', label: '猎聘' },
];

const benchmarkOptions = [
  { key: 'upload', icon: '传', label: '上传Excel文件' },
  { key: 'skip', icon: '跳', label: '暂不对标' },
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

const toggleRegion = (key: string) => {
  const index = selectedRegions.value.indexOf(key);
  if (index > -1) {
    selectedRegions.value.splice(index, 1);
  } else {
    selectedRegions.value.push(key);
  }
};

const toggleSource = (key: string) => {
  const index = selectedSources.value.indexOf(key);
  if (index > -1) {
    selectedSources.value.splice(index, 1);
  } else {
    selectedSources.value.push(key);
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
  }
};

const handleSubmit = () => {
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
          <p class="form-subtitle">智能爬取全网薪酬数据，生成多维度薪酬对标报告</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 岗位名称 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 岗位名称
          </label>
          <div class="input-wrapper">
            <input
              v-model="jobName"
              type="text"
              class="form-input"
              :maxlength="jobNameMaxLength"
              placeholder="如：Java开发工程师"
            />
          </div>
        </div>

        <!-- 岗位类型 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 岗位类型
          </label>
          <div class="language-cards">
            <div
              v-for="opt in jobTypeOptions"
              :key="opt.key"
              class="language-card"
              :class="{ active: jobType === opt.key }"
              @click="jobType = opt.key"
            >
              <span class="lang-icon">{{ opt.icon }}</span>
              <span class="lang-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>

        <!-- 工作年限 -->
        <div class="form-group">
          <label class="form-label">工作年限范围</label>
          <div class="language-cards">
            <div
              v-for="exp in experienceOptions"
              :key="exp.key"
              class="language-card"
              :class="{ active: experienceRange === exp.key }"
              @click="experienceRange = exp.key"
            >
              <span class="lang-icon">{{ exp.icon }}</span>
              <span class="lang-label">{{ exp.label }}</span>
            </div>
          </div>
        </div>

        <!-- 地区选择 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 地区选择（可多选）
          </label>
          <div class="length-cards">
            <div
              v-for="region in regionOptions"
              :key="region.key"
              class="length-card"
              :class="{ active: selectedRegions.includes(region.key) }"
              @click="toggleRegion(region.key)"
            >
              <span class="len-icon">{{ region.icon }}</span>
              <span class="len-label">{{ region.label }}</span>
            </div>
          </div>
        </div>

        <!-- 数据来源 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 数据来源（可多选）
          </label>
          <div class="language-cards">
            <div
              v-for="source in sourceOptions"
              :key="source.key"
              class="language-card"
              :class="{ active: selectedSources.includes(source.key) }"
              @click="toggleSource(source.key)"
            >
              <span class="lang-icon">{{ source.icon }}</span>
              <span class="lang-label">{{ source.label }}</span>
            </div>
          </div>
        </div>

        <!-- 对标配置 -->
        <div class="form-group">
          <label class="form-label">对标配置（可选）</label>
          <div class="language-cards">
            <div
              v-for="opt in benchmarkOptions"
              :key="opt.key"
              class="language-card"
              :class="{ active: benchmarkMode === opt.key }"
              @click="benchmarkMode = opt.key"
            >
              <span class="lang-icon">{{ opt.icon }}</span>
              <span class="lang-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>

        <!-- 上传文件 -->
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

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit">
            提交
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

.section-title {
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
  padding-right: 40px;
}

.form-group {
  margin-bottom: 28px;
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

/* Input wrapper */
.input-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
}

.form-input::placeholder {
  color: #94a3b8;
}

.input-wrapper:focus-within {
  border-color: #2563eb;
}

/* Upload Area */
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

/* Language Cards (for 2-col selections) */
.language-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.language-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.language-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.language-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.lang-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.language-card.active .lang-icon {
  background: #dbeafe;
  color: #2563eb;
}

.lang-label {
  font-size: 14px;
  color: #475569;
}

.language-card.active .lang-label {
  color: #2563eb;
  font-weight: 500;
}

/* Length Cards (for 3-col selections) */
.length-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.length-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.length-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.length-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.len-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.length-card.active .len-icon {
  background: #dbeafe;
  color: #2563eb;
}

.len-label {
  font-size: 14px;
  color: #475569;
}

.length-card.active .len-label {
  color: #2563eb;
  font-weight: 500;
}

/* Submit */
.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
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

.submit-btn:hover {
  background: #1d4ed8;
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
</style>
