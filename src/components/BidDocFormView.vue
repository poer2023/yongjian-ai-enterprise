<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  ChevronDown,
  FileText,
  Bell,
  FileSearch,
  Search,
  Upload,
  HelpCircle,
  Flame,
  X,
  Briefcase,
  Lightbulb,
  Settings,
  FolderOpen,
  MessageSquare,
  Check
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const bidFile = ref<File | null>(null);
const bidTitle = ref('');
const selectedCompany = ref('company1');
const bidDocType = ref('service');
const outlineMode = ref('ai');
const pageCount = ref(100);
const writingStyle = ref('formal');
const layoutTemplate = ref('template1');
const tableConfig = ref('moderate');
const chartConfig = ref('flowchart');
const imageConfig = ref('moderate');
const focusMode = ref('auto');
const additionalInfo = ref('');
const maxLength = 2000;

const recentTools = [
  { icon: FileText, label: 'AI标书生成', active: true },
  { icon: FileSearch, label: '标讯解读', active: false },
  { icon: Bell, label: '标讯订阅', active: false },
];

const companyOptions = [
  { key: 'company1', label: 'XX科技有限公司' },
  { key: 'company2', label: 'XX安全技术有限公司' },
];

const bidDocTypes = [
  { key: 'service', icon: '服', label: '服务类' },
  { key: 'goods', icon: '货', label: '货物类' },
  { key: 'engineering', icon: '工', label: '工程类' },
];

const outlineModes = [
  { key: 'ai', label: 'AI智能生成', desc: '根据招标文件自动生成大纲' },
  { key: 'custom', label: '指定大纲', desc: '按您提供的目录结构生成' },
];

const writingStyles = [
  { key: 'formal', label: '正式', desc: '严谨规范的政府采购风格' },
  { key: 'professional', label: '专业', desc: '突出技术深度与专业性' },
  { key: 'rigorous', label: '严谨', desc: '逻辑清晰，论证充分' },
  { key: 'concise', label: '简洁', desc: '精炼表达，直击要点' },
  { key: 'detailed', label: '详尽', desc: '内容全面，细节丰富' },
];

const layoutTemplates = [
  { key: 'template1', label: '标准版式', preview: '📄' },
  { key: 'template2', label: '简约版式', preview: '📋' },
  { key: 'template3', label: '商务版式', preview: '📑' },
];

const tableConfigs = [
  { key: 'none', label: '无' },
  { key: 'few', label: '少量' },
  { key: 'moderate', label: '适量' },
  { key: 'many', label: '大量' },
];

const chartConfigs = [
  { key: 'none', label: '无' },
  { key: 'flowchart', label: '流程图' },
  { key: 'smartart', label: 'SmartArt' },
];

const imageConfigs = [
  { key: 'none', label: '无' },
  { key: 'few', label: '少量' },
  { key: 'moderate', label: '适量' },
];

const focusModes = [
  { key: 'auto', label: 'AI智能匹配' },
  { key: 'manual', label: '手动指定素材' },
];

// Section collapse state
const businessExpanded = ref(true);
const technicalExpanded = ref(true);

// Business info fields
const bidPrice = ref<number | null>(null);
const hasItemizedPrice = ref(false);
const projectDuration = ref<number | null>(null);
const durationUnit = ref('days');
const warrantyPeriod = ref('1year');
const customWarranty = ref<number | null>(null);
const afterSalesServices = ref<string[]>(['7x24support', 'onsite']);

const durationUnits = [
  { key: 'days', label: '天' },
  { key: 'months', label: '月' },
];

const warrantyOptions = [
  { key: '1year', label: '1年' },
  { key: '2year', label: '2年' },
  { key: '3year', label: '3年' },
  { key: 'custom', label: '自定义' },
];

const afterSalesOptions = [
  { key: '7x24support', label: '7×24小时技术支持' },
  { key: 'onsite', label: '现场服务响应' },
  { key: 'training', label: '免费培训' },
  { key: 'upgrade', label: '免费升级' },
  { key: 'inspection', label: '定期巡检' },
  { key: 'hotline', label: '专属客服热线' },
];

// Technical plan fields
const projectUnderstanding = ref('');
const technicalHighlights = ref('');
const implementationPlan = ref('');
const technicalMaxLength = 1000;

// Material fine control - mock data
const mockCases = [
  { id: 'case1', name: '某市政务云平台建设项目', amount: '2800万', year: '2023' },
  { id: 'case2', name: '某银行核心系统升级项目', amount: '1500万', year: '2022' },
  { id: 'case3', name: '某医院信息化改造项目', amount: '980万', year: '2023' },
];

const mockMembers = [
  { id: 'member1', name: '张工', role: '项目经理', cert: 'PMP认证' },
  { id: 'member2', name: '李工', role: '技术总监', cert: '高级系统架构师' },
  { id: 'member3', name: '王工', role: '安全专家', cert: 'CISSP认证' },
];

const mockCertificates = [
  { id: 'cert1', name: 'ISO 9001质量管理体系认证', validUntil: '2025-12' },
  { id: 'cert2', name: '信息系统集成三级资质', validUntil: '2024-08' },
  { id: 'cert3', name: 'CMMI 3级认证', validUntil: '2025-06' },
];

const selectedCases = ref<string[]>([]);
const selectedMembers = ref<string[]>([]);
const selectedCertificates = ref<string[]>([]);

// Toggle functions
const toggleBusinessSection = () => {
  businessExpanded.value = !businessExpanded.value;
};

const toggleTechnicalSection = () => {
  technicalExpanded.value = !technicalExpanded.value;
};

const toggleAfterSalesService = (key: string) => {
  const index = afterSalesServices.value.indexOf(key);
  if (index > -1) {
    afterSalesServices.value.splice(index, 1);
  } else {
    afterSalesServices.value.push(key);
  }
};

const toggleMaterial = (type: 'cases' | 'members' | 'certificates', id: string) => {
  const target = type === 'cases' ? selectedCases : type === 'members' ? selectedMembers : selectedCertificates;
  const index = target.value.indexOf(id);
  if (index > -1) {
    target.value.splice(index, 1);
  } else {
    target.value.push(id);
  }
};

const features = [
  '智能解析招标文件要求',
  '自动匹配企业资质与业绩',
  '响应评分点生成技术方案',
  '废标项自动检查提醒',
  '一键生成完整投标文件',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const handleBidFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    bidFile.value = target.files[0];
  }
};

const removeFile = () => {
  bidFile.value = null;
};

const clearAdditionalInfo = () => {
  additionalInfo.value = '';
};

const handleSubmit = () => {
  router.push({
    name: 'bid-doc-generating',
    query: {
      company: selectedCompany.value,
      type: bidDocType.value,
    },
  });
};
</script>

<template>
  <div class="form-page">
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
          :class="{ active: item.active }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
          <Flame v-if="item.active" :size="14" class="hot-icon" />
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
          <p class="form-subtitle">智能解析招标文件，一键生成规范标书</p>
        </div>
      </div>

      <div class="form-content">
        <!-- Section 1: 基础信息 (必填) -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <FileText :size="18" class="header-icon" />
              <span class="header-title">基础信息</span>
              <span class="required-tag">必填</span>
            </div>
          </div>
          <div class="card-body">
            <!-- 招标文件上传 -->
            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 招标文件
                <HelpCircle :size="14" class="help-icon" />
              </label>
              <div class="upload-wrapper">
                <label v-if="!bidFile" class="upload-area">
                  <input type="file" @change="handleBidFileUpload" accept=".pdf,.doc,.docx" hidden />
                  <Upload :size="20" class="upload-icon" />
                  <span class="upload-text">点击上传招标文件（PDF/Word）</span>
                </label>
                <div v-else class="uploaded-file-card">
                  <div class="file-info">
                    <FileText :size="24" class="file-icon" />
                    <div class="file-details">
                      <span class="file-name">{{ bidFile.name }}</span>
                      <span class="file-size">{{ (bidFile.size / 1024 / 1024).toFixed(2) }} MB</span>
                    </div>
                  </div>
                  <button class="remove-file-btn" @click="removeFile">
                    <X :size="18" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 标书标题 -->
            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 标书标题
              </label>
              <input
                v-model="bidTitle"
                type="text"
                class="form-input"
                placeholder="请输入投标文件标题，如：XX项目技术投标文件"
                maxlength="100"
              />
              <span class="input-hint">{{ bidTitle.length }}/100</span>
            </div>

            <!-- 投标主体 -->
            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 投标主体
              </label>
              <div class="select-wrapper">
                <select v-model="selectedCompany" class="form-select">
                  <option v-for="company in companyOptions" :key="company.key" :value="company.key">
                    {{ company.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 标书类型 -->
            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 标书类型
                <HelpCircle :size="14" class="help-icon" />
              </label>
              <div class="icon-cards three-col">
                <div
                  v-for="type in bidDocTypes"
                  :key="type.key"
                  class="icon-card"
                  :class="{ active: bidDocType === type.key }"
                  @click="bidDocType = type.key"
                >
                  <span class="card-icon">{{ type.icon }}</span>
                  <span class="card-label">{{ type.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: 技术方案要点 (简化版) -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <Lightbulb :size="18" class="header-icon" />
              <span class="header-title">技术方案要点</span>
              <span class="optional-tag">选填</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom: 0;">
              <div class="textarea-wrapper">
                <textarea
                  v-model="technicalHighlights"
                  class="form-textarea"
                  :maxlength="technicalMaxLength"
                  placeholder="描述您的技术优势、项目理解、实施思路等，AI将据此生成技术方案大纲..."
                ></textarea>
                <span class="char-count">{{ technicalHighlights.length }} / {{ technicalMaxLength }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: 生成配置 -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <Settings :size="18" class="header-icon" />
              <span class="header-title">生成配置</span>
            </div>
          </div>
          <div class="card-body">
            <!-- 生成大纲 -->
            <div class="form-group">
              <label class="form-label">
                大纲模式
                <HelpCircle :size="14" class="help-icon" />
              </label>
              <div class="outline-cards">
                <div
                  v-for="mode in outlineModes"
                  :key="mode.key"
                  class="outline-card"
                  :class="{ active: outlineMode === mode.key }"
                  @click="outlineMode = mode.key"
                >
                  <span class="outline-label">{{ mode.label }}</span>
                  <span class="outline-desc">{{ mode.desc }}</span>
                </div>
              </div>
            </div>

            <!-- 预设页数 -->
            <div class="form-group">
              <label class="form-label">
                预设标书页数
                <span class="page-value">{{ pageCount }} 页</span>
              </label>
              <div class="slider-wrapper">
                <input
                  v-model="pageCount"
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  class="page-slider"
                />
                <div class="slider-labels">
                  <span>50页</span>
                  <span>500页</span>
                </div>
              </div>
            </div>

            <!-- 写作风格 -->
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">写作风格</label>
              <div class="style-cards">
                <div
                  v-for="style in writingStyles"
                  :key="style.key"
                  class="style-card"
                  :class="{ active: writingStyle === style.key }"
                  @click="writingStyle = style.key"
                >
                  <span class="style-label">{{ style.label }}</span>
                  <span class="style-desc">{{ style.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: 内容与素材 -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <FolderOpen :size="18" class="header-icon" />
              <span class="header-title">内容与素材</span>
            </div>
          </div>
          <div class="card-body">
            <!-- 内容配置 -->
            <!-- 表格配置 -->
            <div class="form-group">
              <label class="form-label">表格数量</label>
              <div class="config-options-inline">
                <span
                  v-for="opt in tableConfigs"
                  :key="opt.key"
                  class="config-option"
                  :class="{ active: tableConfig === opt.key }"
                  @click="tableConfig = opt.key"
                >{{ opt.label }}</span>
              </div>
            </div>
            <!-- 流程图配置 -->
            <div class="form-group">
              <label class="form-label">流程图类型</label>
              <div class="config-options-inline">
                <span
                  v-for="opt in chartConfigs"
                  :key="opt.key"
                  class="config-option"
                  :class="{ active: chartConfig === opt.key }"
                  @click="chartConfig = opt.key"
                >{{ opt.label }}</span>
              </div>
            </div>
            <!-- 插图配置 -->
            <div class="form-group">
              <label class="form-label">自动插图</label>
              <div class="config-options-inline">
                <span
                  v-for="opt in imageConfigs"
                  :key="opt.key"
                  class="config-option"
                  :class="{ active: imageConfig === opt.key }"
                  @click="imageConfig = opt.key"
                >{{ opt.label }}</span>
              </div>
            </div>

            <!-- 素材匹配 -->
            <div class="form-group">
              <label class="form-label">
                素材匹配模式
                <HelpCircle :size="14" class="help-icon" />
              </label>
              <div class="toggle-cards two-col">
                <div
                  v-for="mode in focusModes"
                  :key="mode.key"
                  class="toggle-card"
                  :class="{ active: focusMode === mode.key }"
                  @click="focusMode = mode.key"
                >
                  {{ mode.label }}
                </div>
              </div>
            </div>

            <!-- 素材精细控制 (条件显示) -->
            <div v-if="focusMode === 'manual'" class="material-control-panel">
              <!-- 业绩案例 -->
              <div class="material-section">
                <div class="material-section-header">重点业绩案例</div>
                <div class="material-list">
                  <div
                    v-for="item in mockCases"
                    :key="item.id"
                    class="material-item"
                    :class="{ selected: selectedCases.includes(item.id) }"
                    @click="toggleMaterial('cases', item.id)"
                  >
                    <div class="material-checkbox">
                      <Check v-if="selectedCases.includes(item.id)" :size="12" />
                    </div>
                    <div class="material-info">
                      <span class="material-name">{{ item.name }}</span>
                      <span class="material-meta">{{ item.amount }} · {{ item.year }}年</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 项目团队 -->
              <div class="material-section">
                <div class="material-section-header">项目团队成员</div>
                <div class="material-list">
                  <div
                    v-for="item in mockMembers"
                    :key="item.id"
                    class="material-item"
                    :class="{ selected: selectedMembers.includes(item.id) }"
                    @click="toggleMaterial('members', item.id)"
                  >
                    <div class="material-checkbox">
                      <Check v-if="selectedMembers.includes(item.id)" :size="12" />
                    </div>
                    <div class="material-info">
                      <span class="material-name">{{ item.name }} · {{ item.role }}</span>
                      <span class="material-meta">{{ item.cert }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 资质证书 -->
              <div class="material-section">
                <div class="material-section-header">资质证书</div>
                <div class="material-list">
                  <div
                    v-for="item in mockCertificates"
                    :key="item.id"
                    class="material-item"
                    :class="{ selected: selectedCertificates.includes(item.id) }"
                    @click="toggleMaterial('certificates', item.id)"
                  >
                    <div class="material-checkbox">
                      <Check v-if="selectedCertificates.includes(item.id)" :size="12" />
                    </div>
                    <div class="material-info">
                      <span class="material-name">{{ item.name }}</span>
                      <span class="material-meta">有效期至 {{ item.validUntil }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 6: 补充说明 -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <MessageSquare :size="18" class="header-icon" />
              <span class="header-title">补充说明</span>
              <span class="optional-tag">选填</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <div class="textarea-wrapper">
                <textarea
                  v-model="additionalInfo"
                  class="form-textarea"
                  :maxlength="maxLength"
                  placeholder="请输入需要在标书中强调的内容，如：重点突出的技术优势、需要规避的竞争对手等..."
                ></textarea>
                <button v-if="additionalInfo" class="clear-btn" @click="clearAdditionalInfo">清空</button>
                <span class="char-count">{{ additionalInfo.length }} / {{ maxLength }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit">
            生成大纲
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-icon-wrapper">
        <FileText :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">AI标书生成</h3>
      <p class="info-desc">智能解析招标文件，一键生成规范标书</p>
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
.form-page {
  display: flex;
  height: 100%;
  background: #f8fafc;
}

/* Left Sidebar */
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

/* Main Form Area */
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Section Card */
.section-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.card-header.clickable {
  cursor: pointer;
  transition: background 0.2s;
}

.card-header.clickable:hover {
  background: #f1f5f9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  color: #2563eb;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.required-tag {
  padding: 2px 8px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 11px;
  border-radius: 4px;
}

.optional-tag {
  padding: 2px 8px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  border-radius: 4px;
}

.collapse-icon {
  color: #64748b;
  transition: transform 0.2s;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.card-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 10px;
}

.required {
  color: #ef4444;
}

.help-icon {
  color: #94a3b8;
  cursor: help;
}

/* Upload Area */
.upload-wrapper {
  width: 100%;
}

.upload-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #2563eb;
}

.upload-icon {
  color: #94a3b8;
}

.upload-text {
  font-size: 14px;
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
  border-radius: 12px;
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

/* Text Input */
.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  background: white;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
}

.form-input::placeholder {
  color: #94a3b8;
}

.input-hint {
  position: absolute;
  right: 12px;
  bottom: -20px;
  font-size: 12px;
  color: #94a3b8;
}

/* Select */
.select-wrapper {
  width: 100%;
}

.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.form-select:focus {
  border-color: #2563eb;
}

/* Toggle Cards */
.toggle-cards {
  display: grid;
  gap: 12px;
}

.toggle-cards.two-col {
  grid-template-columns: repeat(2, 1fr);
}

.toggle-card {
  padding: 14px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #475569;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.toggle-card.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  font-weight: 500;
}

/* Icon Cards */
.icon-cards {
  display: grid;
  gap: 12px;
}

.icon-cards.three-col {
  grid-template-columns: repeat(3, 1fr);
}

.icon-card {
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

.icon-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.icon-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.card-icon {
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

.icon-card.active .card-icon {
  background: #dbeafe;
  color: #2563eb;
}

.card-label {
  font-size: 14px;
  color: #475569;
}

.icon-card.active .card-label {
  color: #2563eb;
  font-weight: 500;
}

/* Outline Cards */
.outline-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.outline-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.outline-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.outline-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.outline-label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.outline-card.active .outline-label {
  color: #2563eb;
}

.outline-desc {
  font-size: 12px;
  color: #94a3b8;
}

/* Page Slider */
.page-value {
  margin-left: auto;
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
}

.slider-wrapper {
  padding: 0 4px;
}

.page-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
}

.page-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #94a3b8;
}

/* Writing Style Cards */
.style-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.style-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.style-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.style-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.style-label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.style-card.active .style-label {
  color: #2563eb;
}

.style-desc {
  font-size: 11px;
  color: #94a3b8;
}

/* Layout Templates */
.layout-cards {
  display: flex;
  gap: 12px;
}

.layout-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.layout-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.layout-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.layout-preview {
  font-size: 32px;
}

.layout-label {
  font-size: 13px;
  color: #475569;
}

.layout-card.active .layout-label {
  color: #2563eb;
  font-weight: 500;
}

/* Content Config */
.config-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.config-label {
  width: 70px;
  font-size: 13px;
  color: #64748b;
}

.config-options {
  display: flex;
  gap: 8px;
}

.config-option {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.config-option:hover:not(.active) {
  background: #f1f5f9;
}

.config-option.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

/* Inline config options (no gray card wrapper) */
.config-options-inline {
  display: flex;
  gap: 8px;
}

/* Cover Templates */
.cover-cards {
  display: flex;
  gap: 12px;
}

.cover-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.cover-card:hover:not(.active) {
  border-color: #cbd5e1;
}

.cover-card.active {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.cover-preview {
  width: 48px;
  height: 64px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-label {
  font-size: 12px;
  color: #64748b;
}

.cover-card.active .cover-label {
  color: #2563eb;
  font-weight: 500;
}

/* Textarea */
.textarea-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.textarea-wrapper:focus-within {
  border-color: #2563eb;
}

.form-textarea {
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  padding-bottom: 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

.form-textarea::placeholder {
  color: #94a3b8;
}

.clear-btn {
  position: absolute;
  right: 60px;
  bottom: 10px;
  padding: 2px 8px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #2563eb;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 13px;
  color: #94a3b8;
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

/* Business Info Styles */
.price-input-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.number-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.number-input {
  width: 180px;
}

.number-input.small {
  width: 100px;
}

.input-suffix {
  font-size: 14px;
  color: #64748b;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle-switch input {
  display: none;
}

.toggle-slider {
  width: 40px;
  height: 22px;
  background: #e2e8f0;
  border-radius: 11px;
  position: relative;
  transition: background 0.2s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-switch input:checked + .toggle-slider {
  background: #2563eb;
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(18px);
}

.toggle-label {
  font-size: 14px;
  color: #475569;
}

.duration-input-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.unit-options {
  display: flex;
  gap: 8px;
}

.unit-option {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.unit-option:hover:not(.active) {
  background: #f8fafc;
}

.unit-option.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.warranty-options {
  display: flex;
  gap: 10px;
}

.warranty-card {
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.warranty-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.warranty-card.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  font-weight: 500;
}

.custom-warranty-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.service-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.service-tag:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.service-tag.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.service-tag .check-icon {
  color: #2563eb;
}

/* Material Control Panel */
.material-control-panel {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.material-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.material-section-header {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.material-item:hover {
  border-color: #cbd5e1;
}

.material-item.selected {
  background: #eff6ff;
  border-color: #2563eb;
}

.material-checkbox {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
}

.material-item.selected .material-checkbox {
  background: #2563eb;
  border-color: #2563eb;
}

.material-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.material-name {
  font-size: 14px;
  color: #334155;
}

.material-item.selected .material-name {
  color: #1e40af;
  font-weight: 500;
}

.material-meta {
  font-size: 12px;
  color: #94a3b8;
}
</style>
