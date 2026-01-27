<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileText,
  Bell,
  FileSearch,
  Search,
  Upload,
  CheckCircle,
  Building2,
  Award,
  Users,
  Briefcase,
  MapPin
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const bidTitle = route.query.title as string || '';

// 招标文件上传
const mainFile = ref<File | null>(null);
const supplementFiles = ref<File[]>([]);

// 生成模式
const generateMode = ref('complete');

// 素材库关联
const materialLinks = ref({
  company: { linked: true, count: 1 },
  certificates: { linked: true, count: 5 },
  team: { linked: true, count: 8 },
  cases: { linked: true, count: 12 },
});

// 标书类型
const docType = ref('electronic');

// 地区规范
const region = ref('');

const generateModeOptions = [
  { value: 'complete', label: '完整标书', desc: '技术标+商务标+资格证明' },
  { value: 'technical', label: '仅技术标', desc: '技术方案和实施方案' },
  { value: 'commercial', label: '仅商务标', desc: '报价和商务条款' },
];

const docTypeOptions = [
  { value: 'electronic', label: '电子标', desc: '无需签章位置预留' },
  { value: 'paper', label: '纸质标', desc: '预留签章位置' },
];

const regionOptions = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'jiangsu', label: '江苏' },
  { value: 'zhejiang', label: '浙江' },
  { value: 'guangdong', label: '广东' },
  { value: 'other', label: '其他地区' },
];

const templateTypes = [
  { icon: FileText, label: '标书生成', active: true, routeName: 'bid-doc-form' },
  { icon: Bell, label: '标讯订阅', routeName: 'bid-info-form' },
  { icon: FileSearch, label: '标讯解读', routeName: 'bid-analysis-form' },
];

const features = [
  '智能提取招标要求',
  '自动匹配素材库资源',
  '废标项自动检查',
  '评分点响应提醒',
  '签章位置智能标注',
];

const goBack = () => {
  router.push({ name: 'bid-center' });
};

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const handleMainFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    mainFile.value = target.files[0];
  }
};

const handleSupplementUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    supplementFiles.value = [...supplementFiles.value, ...Array.from(target.files)];
  }
};

const removeSupplementFile = (index: number) => {
  supplementFiles.value.splice(index, 1);
};

const handleGenerate = () => {
  router.push({
    name: 'bid-doc-result',
    query: {
      mode: generateMode.value,
      type: docType.value,
      region: region.value,
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
        <span>返回标讯中心</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索投标工具" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">投标工具</div>
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
          <FileText :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">AI标书生成</h1>
          <p class="form-subtitle">一键生成投标文件，智能匹配素材库</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 招标文件上传 -->
        <div class="form-section">
          <div class="section-header">
            <Upload :size="16" />
            <span>招标文件上传</span>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="required">*</span> 招标文件
            </label>
            <label class="upload-area main-upload">
              <input type="file" @change="handleMainFileUpload" accept=".pdf,.doc,.docx" hidden />
              <Upload :size="32" />
              <div class="upload-text">
                <span class="upload-main">点击上传招标文件</span>
                <span class="upload-hint">支持 PDF、Word 格式</span>
              </div>
              <span v-if="mainFile" class="upload-file">{{ mainFile.name }}</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">补充/答疑文件（可选）</label>
            <label class="upload-area supplement-upload">
              <input type="file" @change="handleSupplementUpload" accept=".pdf,.doc,.docx" multiple hidden />
              <Upload :size="24" />
              <span class="upload-main">上传补充文件</span>
            </label>
            <div v-if="supplementFiles.length > 0" class="file-list">
              <div v-for="(file, index) in supplementFiles" :key="index" class="file-item">
                <FileText :size="14" />
                <span>{{ file.name }}</span>
                <button class="remove-file" @click="removeSupplementFile(index)">×</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成模式选择 -->
        <div class="form-section">
          <div class="section-header">
            <FileText :size="16" />
            <span>生成模式</span>
          </div>

          <div class="form-group">
            <div class="mode-selector">
              <div
                v-for="mode in generateModeOptions"
                :key="mode.value"
                class="mode-card"
                :class="{ active: generateMode === mode.value }"
                @click="generateMode = mode.value"
              >
                <div class="mode-radio">
                  <div class="radio-inner" v-if="generateMode === mode.value"></div>
                </div>
                <div class="mode-content">
                  <span class="mode-label">{{ mode.label }}</span>
                  <span class="mode-desc">{{ mode.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 素材库关联 -->
        <div class="form-section">
          <div class="section-header">
            <Briefcase :size="16" />
            <span>素材库关联</span>
          </div>

          <div class="form-group">
            <div class="material-links">
              <div class="material-item" :class="{ linked: materialLinks.company.linked }">
                <Building2 :size="18" />
                <span class="material-name">企业信息</span>
                <span class="material-status">
                  <CheckCircle v-if="materialLinks.company.linked" :size="14" />
                  已关联
                </span>
              </div>
              <div class="material-item" :class="{ linked: materialLinks.certificates.linked }">
                <Award :size="18" />
                <span class="material-name">资质证书</span>
                <span class="material-status">
                  <CheckCircle v-if="materialLinks.certificates.linked" :size="14" />
                  已关联{{ materialLinks.certificates.count }}项
                </span>
              </div>
              <div class="material-item" :class="{ linked: materialLinks.team.linked }">
                <Users :size="18" />
                <span class="material-name">项目团队</span>
                <span class="material-status">
                  <CheckCircle v-if="materialLinks.team.linked" :size="14" />
                  已关联{{ materialLinks.team.count }}人
                </span>
              </div>
              <div class="material-item" :class="{ linked: materialLinks.cases.linked }">
                <Briefcase :size="18" />
                <span class="material-name">业绩案例</span>
                <span class="material-status">
                  <CheckCircle v-if="materialLinks.cases.linked" :size="14" />
                  已关联{{ materialLinks.cases.count }}个
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 标书配置 -->
        <div class="form-section">
          <div class="section-header">
            <MapPin :size="16" />
            <span>标书配置</span>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">标书类型</label>
              <div class="option-selector two-col">
                <button
                  v-for="type in docTypeOptions"
                  :key="type.value"
                  class="option-btn"
                  :class="{ active: docType === type.value }"
                  @click="docType = type.value"
                >
                  <span class="option-label">{{ type.label }}</span>
                  <span class="option-desc">{{ type.desc }}</span>
                </button>
              </div>
            </div>
            <div class="form-group half">
              <label class="form-label">投标地区</label>
              <select v-model="region" class="form-select">
                <option value="">请选择投标地区</option>
                <option v-for="r in regionOptions" :key="r.value" :value="r.value">
                  {{ r.label }}
                </option>
              </select>
              <span class="form-hint">不同地区签章要求可能不同</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleGenerate">
            开始生成标书
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-card">
        <div class="info-icon">📄</div>
        <h3 class="info-title">AI标书生成</h3>
        <p class="info-desc">智能解析招标文件，一键生成规范标书</p>
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
  background: #ecfdf5;
  border: none;
  border-radius: 6px;
  color: #10b981;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #d1fae5;
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
  background: #ecfdf5;
  color: #10b981;
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
  background: #ecfdf5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
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
  color: #10b981;
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
  color: #10b981;
  margin-right: 2px;
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
  border-color: #10b981;
  background: #ecfdf5;
}

.upload-area.supplement-upload {
  padding: 16px;
  flex-direction: row;
  gap: 12px;
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

.file-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
}

.file-item svg {
  color: #64748b;
}

.remove-file {
  margin-left: auto;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mode-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-card:hover {
  background: #f8fafc;
}

.mode-card.active {
  border-color: #10b981;
  background: #ecfdf5;
}

.mode-radio {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mode-card.active .mode-radio {
  border-color: #10b981;
}

.radio-inner {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
}

.mode-content {
  display: flex;
  flex-direction: column;
}

.mode-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.mode-desc {
  font-size: 12px;
  color: #64748b;
}

.material-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.material-item.linked {
  background: #ecfdf5;
  border-color: #10b981;
}

.material-item svg {
  color: #64748b;
}

.material-item.linked svg {
  color: #10b981;
}

.material-name {
  flex: 1;
  font-size: 14px;
  color: #334155;
}

.material-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.material-item.linked .material-status {
  color: #16a34a;
}

.option-selector.two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  background: #f8fafc;
}

.option-btn.active {
  border-color: #10b981;
  background: #ecfdf5;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.option-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.option-btn.active .option-label {
  color: #10b981;
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
}

.form-select:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
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
  background: #10b981;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background: #059669;
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
  color: #10b981;
  font-size: 8px;
}
</style>
