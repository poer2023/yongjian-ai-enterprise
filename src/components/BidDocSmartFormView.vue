<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileText,
  Bell,
  FileSearch,
  Search,
  Upload,
  Flame,
  X,
  Zap,
  Loader2,
  Check,
  Sparkles,
  AlertTriangle,
  Clock,
  Award,
  Target,
  Building2,
  ChevronDown,
  Users,
  Briefcase,
  ExternalLink
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data - before parsing
const uploadedFile = ref<File | null>(null);
const showEnterpriseDropdown = ref(false);

// Enterprise selection
interface Enterprise {
  id: number;
  name: string;
  certCount: number;
  caseCount: number;
  teamCount: number;
  recentCerts: string[];
}

const enterprises = ref<Enterprise[]>([
  {
    id: 1,
    name: '深圳市智联云科技术有限公司',
    certCount: 6,
    caseCount: 8,
    teamCount: 6,
    recentCerts: ['高新技术企业', 'ISO9001', 'CMMI3']
  },
  {
    id: 2,
    name: '北京华信安全科技有限公司',
    certCount: 8,
    caseCount: 12,
    teamCount: 10,
    recentCerts: ['等保三级', 'ISO27001', 'CMMI5']
  },
  {
    id: 3,
    name: '上海数智信息技术有限公司',
    certCount: 5,
    caseCount: 6,
    teamCount: 8,
    recentCerts: ['软件企业认证', 'ISO9001', '双软认证']
  },
  {
    id: 4,
    name: '广州云端网络科技有限公司',
    certCount: 4,
    caseCount: 5,
    teamCount: 5,
    recentCerts: ['高新技术企业', 'ISO9001']
  }
]);

const selectedEnterprise = ref<Enterprise | null>(enterprises.value[0]);

// Parse state
const isParsing = ref(false);
const isParsed = ref(false);

// Parsed form fields (auto-filled after parsing)
const bidTitle = ref('');
const bidDocType = ref('service');
const bidPrice = ref<number | null>(null);
const projectDuration = ref<number | null>(null);
const durationUnit = ref('days');
const warrantyPeriod = ref('1year');
const projectUnderstanding = ref('');
const technicalHighlights = ref('');

// Mock parsed analysis data
const parsedAnalysis = ref({
  scoringItems: [
    { name: '技术方案', score: 40, key: '架构设计、安全方案、创新性' },
    { name: '项目业绩', score: 20, key: '同类项目经验、合同金额' },
    { name: '团队资质', score: 15, key: 'PMP认证、高级职称' },
    { name: '企业资质', score: 15, key: 'CMMI3、ISO认证' },
    { name: '商务报价', score: 10, key: '价格竞争力' },
  ],
  qualifications: [
    { name: '信息系统集成三级及以上资质', status: 'matched', matched: 'ISO 9001质量管理体系认证' },
    { name: 'CMMI 3级及以上认证', status: 'matched', matched: 'CMMI 3级认证' },
    { name: '近三年同类项目业绩不少于2个', status: 'matched', matched: '已匹配3个同类项目' },
    { name: '项目经理具备PMP认证', status: 'matched', matched: '张工 - PMP认证' },
  ],
  timeline: [
    { event: '投标截止', date: '2024-03-15 14:30', urgent: true },
    { event: '开标时间', date: '2024-03-15 15:00', urgent: true },
    { event: '项目启动', date: '中标后10日内', urgent: false },
    { event: '项目验收', date: '合同签订后180日', urgent: false },
  ],
  risks: [
    { level: 'high', desc: '投标保证金需在截止前3日到账' },
    { level: 'medium', desc: '技术方案需包含应急预案章节' },
    { level: 'low', desc: '报价需精确到小数点后两位' },
  ],
});

// Mock parsed data for form
const mockParsedData = {
  bidTitle: '某市政务云平台建设项目技术投标文件',
  bidDocType: 'service',
  bidPrice: 2800,
  projectDuration: 180,
  durationUnit: 'days',
  warrantyPeriod: '2year',
  projectUnderstanding: '本项目旨在建设覆盖全市的政务云平台，实现政务数据的统一管理、共享交换和安全防护。核心需求包括：云基础设施建设、政务应用迁移、数据治理平台搭建、安全防护体系构建。',
  technicalHighlights: '我司在政务云领域具有丰富经验，已成功交付多个省市级政务云项目。核心优势包括：自主可控的云平台技术、完善的数据安全体系、7×24小时运维保障能力。',
};

const recentTools = [
  { icon: Zap, label: 'AI标书生成（智能版）', active: true },
  { icon: FileText, label: 'AI标书生成', active: false },
  { icon: FileSearch, label: '标讯解读', active: false },
  { icon: Bell, label: '标讯订阅', active: false },
];

const selectEnterprise = (enterprise: Enterprise) => {
  selectedEnterprise.value = enterprise;
  showEnterpriseDropdown.value = false;
};

const goToMaterialLibrary = () => {
  router.push({ name: 'enterprise-material' });
};

const bidDocTypes = [
  { key: 'service', icon: '服', label: '服务类' },
  { key: 'goods', icon: '货', label: '货物类' },
  { key: 'engineering', icon: '工', label: '工程类' },
];

const durationUnits = [
  { key: 'days', label: '天' },
  { key: 'months', label: '月' },
];

const warrantyOptions = [
  { key: '1year', label: '1年' },
  { key: '2year', label: '2年' },
  { key: '3year', label: '3年' },
];

const features = [
  '上传招标文件即可自动解析',
  '智能识别评分标准与资质要求',
  '自动匹配企业素材库资料',
  '风险点与时间节点提醒',
  '一键生成专业投标文件',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0];
    target.value = '';
  }
};

const removeFile = () => {
  uploadedFile.value = null;
  isParsed.value = false;
  // Reset form
  bidTitle.value = '';
  bidPrice.value = null;
  projectDuration.value = null;
  projectUnderstanding.value = '';
  technicalHighlights.value = '';
};

const handleParse = () => {
  isParsing.value = true;

  // Simulate parsing delay
  setTimeout(() => {
    // Auto-fill with mock parsed data
    bidTitle.value = mockParsedData.bidTitle;
    bidDocType.value = mockParsedData.bidDocType;
    bidPrice.value = mockParsedData.bidPrice;
    projectDuration.value = mockParsedData.projectDuration;
    durationUnit.value = mockParsedData.durationUnit;
    warrantyPeriod.value = mockParsedData.warrantyPeriod;
    projectUnderstanding.value = mockParsedData.projectUnderstanding;
    technicalHighlights.value = mockParsedData.technicalHighlights;

    isParsing.value = false;
    isParsed.value = true;
  }, 2000);
};

const handleSubmit = () => {
  router.push({
    name: 'bid-doc-generating',
    query: {
      company: selectedEnterprise.value?.id.toString() || '',
      type: bidDocType.value,
      smart: 'true',
    },
  });
};

const getRiskLevelClass = (level: string) => {
  return {
    'high': 'risk-high',
    'medium': 'risk-medium',
    'low': 'risk-low',
  }[level] || '';
};

const getRiskLevelText = (level: string) => {
  return {
    'high': '高',
    'medium': '中',
    'low': '低',
  }[level] || '';
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
          <Zap :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">AI标书生成（智能版）</h1>
          <p class="form-subtitle">极简操作，上传文件即可自动生成专业标书</p>
        </div>
      </div>

      <div class="form-content">
        <!-- Step 1: 投标主体选择 + 文件上传 -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <FileText :size="18" class="header-icon" />
              <span class="header-title">上传招标文件</span>
              <span class="required-tag">必填</span>
            </div>
          </div>
          <div class="card-body">
            <!-- 投标主体 -->
            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 投标主体
              </label>
              <p class="field-hint">选择参与投标的企业，AI 将基于该企业素材库进行资质匹配</p>
              <div class="enterprise-selector">
                <div
                  class="enterprise-selected"
                  @click="showEnterpriseDropdown = !showEnterpriseDropdown"
                >
                  <template v-if="selectedEnterprise">
                    <div class="enterprise-icon">
                      <Building2 :size="18" />
                    </div>
                    <div class="enterprise-info">
                      <span class="enterprise-name">{{ selectedEnterprise.name }}</span>
                      <div class="enterprise-stats">
                        <span class="stat-item">
                          <Award :size="12" />
                          {{ selectedEnterprise.certCount }} 项资质
                        </span>
                        <span class="stat-item">
                          <Briefcase :size="12" />
                          {{ selectedEnterprise.caseCount }} 个案例
                        </span>
                        <span class="stat-item">
                          <Users :size="12" />
                          {{ selectedEnterprise.teamCount }} 名成员
                        </span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <span class="placeholder-text">请选择投标主体企业</span>
                  </template>
                  <ChevronDown :size="18" class="dropdown-arrow" :class="{ rotated: showEnterpriseDropdown }" />
                </div>

                <!-- Dropdown -->
                <div v-if="showEnterpriseDropdown" class="enterprise-dropdown">
                  <div
                    v-for="enterprise in enterprises"
                    :key="enterprise.id"
                    class="dropdown-item"
                    :class="{ selected: selectedEnterprise?.id === enterprise.id }"
                    @click="selectEnterprise(enterprise)"
                  >
                    <div class="dropdown-item-content">
                      <span class="item-name">{{ enterprise.name }}</span>
                      <div class="item-certs">
                        <span v-for="cert in enterprise.recentCerts" :key="cert" class="cert-tag">{{ cert }}</span>
                      </div>
                    </div>
                    <Check v-if="selectedEnterprise?.id === enterprise.id" :size="16" class="check-icon" />
                  </div>
                  <div class="dropdown-footer">
                    <button class="go-material-btn" @click.stop="goToMaterialLibrary">
                      <ExternalLink :size="14" />
                      前往企业素材库完善资料
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 招标文件上传 -->
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">
                <span class="required">*</span> 招标文件
              </label>
              <p class="field-hint">上传后 AI 将智能解析评分标准、资质要求、时间节点等关键信息</p>
              <label v-if="!uploadedFile" class="upload-area">
                <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" hidden />
                <Upload :size="32" />
                <div class="upload-text">
                  <span class="upload-main">点击上传招标文件</span>
                  <span class="upload-hint">支持 PDF、Word 格式</span>
                </div>
              </label>
              <!-- Uploaded file display -->
              <div v-else class="uploaded-file-card">
                <div class="file-info">
                  <FileText :size="24" class="file-icon" />
                  <div class="file-details">
                    <span class="file-name">{{ uploadedFile.name }}</span>
                    <span class="file-size">{{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} MB</span>
                  </div>
                </div>
                <div class="file-actions">
                  <span v-if="isParsed" class="parsed-badge">
                    <Check :size="14" />
                    已解析
                  </span>
                  <button class="remove-file-btn" @click="removeFile">
                    <X :size="18" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Parse Button (shown when file uploaded but not parsed) -->
        <div v-if="uploadedFile && !isParsed" class="parse-container">
          <button class="parse-btn" :disabled="isParsing" @click="handleParse">
            <Loader2 v-if="isParsing" :size="18" class="spinner" />
            <Sparkles v-else :size="18" />
            <span>{{ isParsing ? '正在解析招标文件...' : '解析招标文件' }}</span>
          </button>
        </div>

        <!-- Parsed Content (shown after parsing) -->
        <template v-if="isParsed">
          <!-- 解析结果提示 -->
          <div class="parsed-header">
            <Sparkles :size="16" />
            <span>招标文件解析完成，已提取关键信息并智能匹配企业素材</span>
          </div>

          <!-- 解析摘要卡片组 -->
          <div class="analysis-grid">
            <!-- 评分标准 -->
            <div class="analysis-card">
              <div class="analysis-card-header">
                <Target :size="16" />
                <span>评分标准</span>
              </div>
              <div class="analysis-card-body">
                <div class="scoring-list">
                  <div v-for="item in parsedAnalysis.scoringItems" :key="item.name" class="scoring-item">
                    <div class="scoring-header">
                      <span class="scoring-name">{{ item.name }}</span>
                      <span class="scoring-score">{{ item.score }}分</span>
                    </div>
                    <div class="scoring-key">{{ item.key }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 资质匹配 -->
            <div class="analysis-card">
              <div class="analysis-card-header">
                <Award :size="16" />
                <span>资质匹配</span>
                <span class="match-badge">{{ parsedAnalysis.qualifications.filter(q => q.status === 'matched').length }}/{{ parsedAnalysis.qualifications.length }} 已匹配</span>
              </div>
              <div class="analysis-card-body">
                <div class="qualification-list">
                  <div v-for="item in parsedAnalysis.qualifications" :key="item.name" class="qualification-item">
                    <div class="qualification-status matched">
                      <Check :size="12" />
                    </div>
                    <div class="qualification-content">
                      <span class="qualification-require">{{ item.name }}</span>
                      <span class="qualification-matched">{{ item.matched }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 时间节点 -->
            <div class="analysis-card">
              <div class="analysis-card-header">
                <Clock :size="16" />
                <span>时间节点</span>
              </div>
              <div class="analysis-card-body">
                <div class="timeline-list">
                  <div v-for="item in parsedAnalysis.timeline" :key="item.event" class="timeline-item" :class="{ urgent: item.urgent }">
                    <span class="timeline-event">{{ item.event }}</span>
                    <span class="timeline-date">{{ item.date }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 风险提示 -->
            <div class="analysis-card">
              <div class="analysis-card-header">
                <AlertTriangle :size="16" />
                <span>风险提示</span>
              </div>
              <div class="analysis-card-body">
                <div class="risk-list">
                  <div v-for="(item, index) in parsedAnalysis.risks" :key="index" class="risk-item">
                    <span class="risk-level" :class="getRiskLevelClass(item.level)">{{ getRiskLevelText(item.level) }}</span>
                    <span class="risk-desc">{{ item.desc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 可编辑表单区 -->
          <div class="editable-section">
            <div class="editable-header">
              <span>以下信息可手动调整</span>
            </div>

            <!-- 基础信息卡片 -->
            <div class="section-card">
              <div class="card-header">
                <div class="header-left">
                  <FileText :size="18" class="header-icon" />
                  <span class="header-title">基础信息</span>
                </div>
              </div>
              <div class="card-body">
                <!-- 标书标题 -->
                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span> 标书标题
                  </label>
                  <input
                    v-model="bidTitle"
                    type="text"
                    class="form-input"
                    placeholder="请输入投标文件标题"
                    maxlength="100"
                  />
                </div>

                <!-- 标书类型 -->
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label">
                    <span class="required">*</span> 标书类型
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

            <!-- 技术方案卡片 -->
            <div class="section-card">
              <div class="card-header">
                <div class="header-left">
                  <FileText :size="18" class="header-icon" />
                  <span class="header-title">技术方案要点</span>
                  <span class="auto-fill-tag">
                    <Sparkles :size="12" />
                    已智能填充
                  </span>
                </div>
              </div>
              <div class="card-body">
                <!-- 项目理解 -->
                <div class="form-group">
                  <label class="form-label">项目理解与响应重点</label>
                  <div class="textarea-wrapper">
                    <textarea
                      v-model="projectUnderstanding"
                      class="form-textarea"
                      maxlength="1000"
                      placeholder="描述您对本项目的理解..."
                    ></textarea>
                    <span class="char-count">{{ projectUnderstanding.length }} / 1000</span>
                  </div>
                </div>

                <!-- 技术亮点 -->
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label">技术亮点与优势</label>
                  <div class="textarea-wrapper">
                    <textarea
                      v-model="technicalHighlights"
                      class="form-textarea"
                      maxlength="1000"
                      placeholder="描述技术优势与亮点..."
                    ></textarea>
                    <span class="char-count">{{ technicalHighlights.length }} / 1000</span>
                  </div>
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
        </template>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-icon-wrapper">
        <Zap :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">AI标书生成（智能版）</h3>
      <p class="info-desc">极简操作，上传文件即可自动生成专业标书</p>
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
  padding-right: 40px;
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
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.field-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.required-tag {
  padding: 2px 8px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 11px;
  border-radius: 4px;
}

/* Enterprise Selector */
.enterprise-selector {
  position: relative;
}

.enterprise-selected {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.enterprise-selected:hover {
  border-color: #3b82f6;
}

.enterprise-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
}

.enterprise-info {
  flex: 1;
  min-width: 0;
}

.enterprise-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.enterprise-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.placeholder-text {
  color: #94a3b8;
  font-size: 14px;
}

.dropdown-arrow {
  color: #94a3b8;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.enterprise-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.selected {
  background: #eff6ff;
}

.dropdown-item-content {
  flex: 1;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  display: block;
  margin-bottom: 6px;
}

.item-certs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.cert-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #f1f5f9;
  border-radius: 4px;
  color: #64748b;
}

.dropdown-item.selected .cert-tag {
  background: #dbeafe;
  color: #1d4ed8;
}

.check-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.dropdown-footer {
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.go-material-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.go-material-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
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

.file-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.parsed-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #dcfce7;
  border-radius: 4px;
  font-size: 12px;
  color: #16a34a;
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

/* Section Card */
.section-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
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

.card-body {
  padding: 20px;
}

/* Parse Button */
.parse-container {
  display: flex;
  justify-content: center;
  margin: 32px 0;
}

.parse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 280px;
  padding: 14px 24px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.parse-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.parse-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Parsed Header */
.parsed-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-size: 13px;
  color: #16a34a;
  margin-bottom: 20px;
}

/* Analysis Grid */
.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.analysis-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.analysis-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.match-badge {
  margin-left: auto;
  padding: 2px 8px;
  background: #dcfce7;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #16a34a;
}

.analysis-card-body {
  padding: 12px 16px;
}

/* Scoring List */
.scoring-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scoring-item {
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.scoring-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.scoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.scoring-name {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.scoring-score {
  font-size: 13px;
  font-weight: 600;
  color: #2563eb;
}

.scoring-key {
  font-size: 11px;
  color: #94a3b8;
}

/* Qualification List */
.qualification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qualification-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.qualification-status {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.qualification-status.matched {
  background: #dcfce7;
  color: #16a34a;
}

.qualification-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qualification-require {
  font-size: 12px;
  color: #334155;
}

.qualification-matched {
  font-size: 11px;
  color: #16a34a;
}

/* Timeline List */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.timeline-item.urgent {
  background: #fef2f2;
}

.timeline-event {
  font-size: 12px;
  color: #334155;
}

.timeline-item.urgent .timeline-event {
  color: #dc2626;
  font-weight: 500;
}

.timeline-date {
  font-size: 11px;
  color: #64748b;
}

.timeline-item.urgent .timeline-date {
  color: #dc2626;
}

/* Risk List */
.risk-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.risk-level {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.risk-level.risk-high {
  background: #fef2f2;
  color: #dc2626;
}

.risk-level.risk-medium {
  background: #fffbeb;
  color: #d97706;
}

.risk-level.risk-low {
  background: #f0fdf4;
  color: #16a34a;
}

.risk-desc {
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
}

/* Editable Section */
.editable-section {
  margin-top: 8px;
}

.editable-header {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
  padding-left: 4px;
}

/* Auto fill tag */
.auto-fill-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: #eff6ff;
  border-radius: 4px;
  font-size: 11px;
  color: #2563eb;
}

/* Form Input */
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

/* Number input */
.number-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.number-input {
  width: 200px;
}

.input-suffix {
  font-size: 14px;
  color: #64748b;
}

/* Duration input */
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

/* Warranty */
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
  min-height: 100px;
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
</style>
