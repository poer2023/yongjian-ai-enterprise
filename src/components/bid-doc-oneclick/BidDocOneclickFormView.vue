<script setup lang="ts">
import { ref } from 'vue';
import {
  FileText,
  Upload,
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
  Settings,
  MessageSquare,
  FolderOpen,
  ListOrdered,
  Play,
  Edit3,
  Package
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import {
  enterprises as defaultEnterprises,
  parsedAnalysis,
  mockParsedData,
  recentTools,
  bidDocTypes,
  outlineModes,
  matchedTemplates,
  features,
  outlineNodes as defaultOutlineNodes
} from './mockData';
import type { Enterprise, GenerateMode, OutlineNode } from './types';

const router = useRouter();

// Form data
const uploadedFile = ref<File | null>(null);
const showEnterpriseDropdown = ref(false);
const enterprises = ref<Enterprise[]>(defaultEnterprises);
const selectedEnterprise = ref<Enterprise | null>(enterprises.value[0] ?? null);

// Parse state
const isParsing = ref(false);
const isParsed = ref(false);

// Parsed form fields
const bidTitle = ref('');
const bidDocType = ref('service');
const projectUnderstanding = ref('');
const technicalHighlights = ref('');
const outlineMode = ref('template');
const selectedTemplateId = ref('tpl1');
const pageCount = ref(120);
const aiRecommendedPages = ref(120);
const additionalInfo = ref('');
const maxLength = 2000;

// Generate mode: oneclick or node-by-node
const generateMode = ref<GenerateMode>('oneclick');
const outlineNodes = ref<OutlineNode[]>([...defaultOutlineNodes]);

// Qualification expiry helpers - compare against bid deadline, not current date
const bidDeadline = new Date(parsedAnalysis.timeline[0]?.date || '');
const isExpired = (dateStr?: string) => {
  if (!dateStr || isNaN(bidDeadline.getTime())) return false;
  return new Date(dateStr) < bidDeadline;
};
const isExpiringSoon = (item: { expiringSoon?: boolean }) => {
  return item.expiringSoon === true;
};

const getNodeSourceClass = (type: string) => {
  return { 'ai': 'source-ai', 'material': 'source-material', 'manual': 'source-manual' }[type] || '';
};

const getNodeStatusClass = (status: string) => {
  return { 'pending': 'status-pending', 'ready': 'status-ready', 'generated': 'status-generated', 'edited': 'status-edited', 'to-fill': 'status-to-fill' }[status] || '';
};

const selectEnterprise = (enterprise: Enterprise) => {
  selectedEnterprise.value = enterprise;
  showEnterpriseDropdown.value = false;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0] ?? null;
    target.value = '';
  }
};

const removeFile = () => {
  uploadedFile.value = null;
  isParsed.value = false;
  bidTitle.value = '';
  bidDocType.value = 'service';
  projectUnderstanding.value = '';
  technicalHighlights.value = '';
  outlineMode.value = 'template';
  selectedTemplateId.value = 'tpl1';
  pageCount.value = 120;
  additionalInfo.value = '';
};

const handleParse = () => {
  isParsing.value = true;
  setTimeout(() => {
    bidTitle.value = mockParsedData.bidTitle;
    bidDocType.value = mockParsedData.bidDocType;
    projectUnderstanding.value = mockParsedData.projectUnderstanding;
    technicalHighlights.value = mockParsedData.technicalHighlights;
    // AI 推荐页数基于匹配到的模板
    const matched = matchedTemplates.find(t => t.id === selectedTemplateId.value);
    aiRecommendedPages.value = matched?.pages ?? 120;
    pageCount.value = aiRecommendedPages.value;
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
  return { 'high': 'risk-high', 'medium': 'risk-medium', 'low': 'risk-low' }[level] || '';
};

const getRiskLevelText = (level: string) => {
  return { 'high': '高', 'medium': '中', 'low': '低' }[level] || '';
};
</script>

<template>
  <FormPageLayout :icon="Zap" title="AI标书生成（一键版）" subtitle="极简操作，上传文件即可自动生成专业标书">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <!-- Section 1: Upload -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <FileText :size="18" class="header-icon" />
          <span class="header-title">上传招标文件</span>
          <span class="required-tag">必填</span>
        </div>
      </div>
      <div class="card-body">
        <!-- Enterprise Selection -->
        <div class="form-group">
          <label class="form-label"><span class="required">*</span> 投标主体</label>
          <p class="field-hint">选择参与投标的企业，AI 将基于该企业素材库进行资质匹配</p>
          <div class="enterprise-selector">
            <div class="enterprise-selected" @click="showEnterpriseDropdown = !showEnterpriseDropdown">
              <template v-if="selectedEnterprise">
                <div class="enterprise-icon"><Building2 :size="18" /></div>
                <div class="enterprise-info">
                  <span class="enterprise-name">{{ selectedEnterprise.name }}</span>
                  <div class="enterprise-stats">
                    <span class="stat-item"><Award :size="12" /> {{ selectedEnterprise.certCount }} 项资质</span>
                    <span class="stat-item"><Briefcase :size="12" /> {{ selectedEnterprise.caseCount }} 个案例</span>
                    <span class="stat-item"><Users :size="12" /> {{ selectedEnterprise.teamCount }} 名成员</span>
                  </div>
                </div>
              </template>
              <template v-else><span class="placeholder-text">请选择投标主体企业</span></template>
              <ChevronDown :size="18" class="dropdown-arrow" :class="{ rotated: showEnterpriseDropdown }" />
            </div>
            <div v-if="showEnterpriseDropdown" class="enterprise-dropdown">
              <div v-for="enterprise in enterprises" :key="enterprise.id" class="dropdown-item" :class="{ selected: selectedEnterprise?.id === enterprise.id }" @click="selectEnterprise(enterprise)">
                <div class="dropdown-item-content">
                  <span class="item-name">{{ enterprise.name }}</span>
                  <div class="item-certs">
                    <span v-for="cert in enterprise.recentCerts" :key="cert" class="cert-tag">{{ cert }}</span>
                  </div>
                </div>
                <Check v-if="selectedEnterprise?.id === enterprise.id" :size="16" class="check-icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- File Upload -->
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label"><span class="required">*</span> 招标文件</label>
          <p class="field-hint">上传后 AI 将智能解析评分标准、资质要求、时间节点等关键信息</p>
          <label v-if="!uploadedFile" class="upload-area">
            <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" hidden />
            <Upload :size="32" />
            <div class="upload-text">
              <span class="upload-main">点击上传招标文件</span>
              <span class="upload-hint">支持 PDF、Word 格式</span>
            </div>
          </label>
          <div v-else class="uploaded-file-card">
            <div class="file-info">
              <FileText :size="24" class="file-icon" />
              <div class="file-details">
                <span class="file-name">{{ uploadedFile.name }}</span>
                <span class="file-size">{{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} MB</span>
              </div>
            </div>
            <div class="file-actions">
              <span v-if="isParsed" class="parsed-badge"><Check :size="14" /> 已解析</span>
              <button class="remove-file-btn" @click="removeFile"><X :size="18" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Parse Button -->
    <div v-if="uploadedFile && !isParsed" class="parse-container">
      <button class="parse-btn" :disabled="isParsing" @click="handleParse">
        <Loader2 v-if="isParsing" :size="18" class="spinner" />
        <Sparkles v-else :size="18" />
        <span>{{ isParsing ? '正在解析招标文件...' : '解析招标文件' }}</span>
      </button>
    </div>

    <!-- Parsed Content -->
    <template v-if="isParsed">
      <div class="parsed-header">
        <Sparkles :size="16" />
        <span>招标文件解析完成，已提取关键信息并智能匹配企业素材</span>
      </div>

      <!-- Analysis Grid -->
      <div class="analysis-grid">
        <div class="analysis-card">
          <div class="analysis-card-header"><Target :size="16" /><span>评分标准</span></div>
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

        <div class="analysis-card">
          <div class="analysis-card-header">
            <Award :size="16" /><span>资质匹配</span>
            <span class="match-badge">{{ parsedAnalysis.qualifications.filter(q => q.status === 'matched').length }}/{{ parsedAnalysis.qualifications.length }} 已匹配</span>
          </div>
          <div class="analysis-card-body">
            <div class="qualification-list">
              <div v-for="item in parsedAnalysis.qualifications" :key="item.name" class="qualification-item">
                <div class="qualification-status matched"><Check :size="12" /></div>
                <div class="qualification-content">
                  <span class="qualification-require">{{ item.name }}</span>
                  <div class="qualification-matched-row">
                    <span class="qualification-matched">{{ item.matched }}</span>
                    <span v-if="item.expiryDate && isExpired(item.expiryDate)" class="expiry-tag expired">
                      <AlertTriangle :size="11" /> 已过期 {{ item.expiryDate }}
                    </span>
                    <span v-else-if="item.expiryDate && isExpiringSoon(item)" class="expiry-tag expiring">
                      <Clock :size="11" /> 即将过期 {{ item.expiryDate }}
                    </span>
                    <span v-else-if="item.expiryDate" class="expiry-tag valid">
                      有效期至 {{ item.expiryDate }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-header"><Clock :size="16" /><span>时间节点</span></div>
          <div class="analysis-card-body">
            <div class="timeline-list">
              <div v-for="item in parsedAnalysis.timeline" :key="item.event" class="timeline-item" :class="{ urgent: item.urgent }">
                <span class="timeline-event">{{ item.event }}</span>
                <span class="timeline-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="analysis-card">
          <div class="analysis-card-header"><AlertTriangle :size="16" /><span>风险提示</span></div>
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

      <!-- Generate Mode Switcher -->
      <div class="section-card">
        <div class="card-header">
          <div class="header-left">
            <ListOrdered :size="18" class="header-icon" />
            <span class="header-title">生成模式</span>
          </div>
        </div>
        <div class="card-body">
          <div class="mode-switcher">
            <div
              class="mode-card"
              :class="{ active: generateMode === 'oneclick' }"
              @click="generateMode = 'oneclick'"
            >
              <div class="mode-icon oneclick"><Zap :size="20" /></div>
              <div class="mode-info">
                <span class="mode-label">一键生成</span>
                <span class="mode-desc">AI 自动完成全部章节，适合时间紧迫的项目</span>
              </div>
              <div v-if="generateMode === 'oneclick'" class="mode-check"><Check :size="14" /></div>
            </div>
            <div
              class="mode-card"
              :class="{ active: generateMode === 'node' }"
              @click="generateMode = 'node'"
            >
              <div class="mode-icon node"><Edit3 :size="20" /></div>
              <div class="mode-info">
                <span class="mode-label">逐章节生成</span>
                <span class="mode-desc">逐章确认和编辑，适合对质量要求高的项目</span>
              </div>
              <div v-if="generateMode === 'node'" class="mode-check"><Check :size="14" /></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Node-by-node Outline (visible when mode is 'node') -->
      <div v-if="generateMode === 'node'" class="section-card">
        <div class="card-header">
          <div class="header-left">
            <FolderOpen :size="18" class="header-icon" />
            <span class="header-title">章节大纲</span>
            <span class="auto-fill-tag"><Sparkles :size="12" /> AI 已识别</span>
          </div>
          <div class="header-right">
            <span class="node-summary">
              <span class="node-count ai">{{ outlineNodes.filter(n => n.sourceType === 'ai').length }} AI生成</span>
              <span class="node-count material">{{ outlineNodes.filter(n => n.sourceType === 'material').length }} 素材导入</span>
              <span class="node-count manual">{{ outlineNodes.filter(n => n.sourceType === 'manual').length }} 手动填写</span>
            </span>
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="node-list">
            <div v-for="(node, idx) in outlineNodes" :key="node.id" class="node-item">
              <span class="node-index">{{ idx + 1 }}</span>
              <span class="node-name">{{ node.name }}</span>
              <span class="node-source" :class="getNodeSourceClass(node.sourceType)">
                <Package v-if="node.sourceType === 'material'" :size="11" />
                <Sparkles v-else-if="node.sourceType === 'ai'" :size="11" />
                <Edit3 v-else :size="11" />
                {{ node.sourceLabel }}
              </span>
              <span class="node-status" :class="getNodeStatusClass(node.status)">{{ node.statusLabel }}</span>
              <button v-if="node.sourceType === 'ai'" class="node-action-btn" title="单独生成此章节">
                <Play :size="12" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Editable Form -->
      <div class="editable-section">
        <div class="editable-header"><span>以下信息可手动调整</span></div>

        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <FileText :size="18" class="header-icon" />
              <span class="header-title">基础信息</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label"><span class="required">*</span> 标书标题</label>
              <input v-model="bidTitle" type="text" class="form-input" placeholder="请输入投标文件标题" maxlength="100" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label"><span class="required">*</span> 标书类型</label>
              <div class="icon-cards three-col">
                <div v-for="type in bidDocTypes" :key="type.key" class="icon-card" :class="{ active: bidDocType === type.key }" @click="bidDocType = type.key">
                  <span class="card-icon">{{ type.icon }}</span>
                  <span class="card-label">{{ type.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <FileText :size="18" class="header-icon" />
              <span class="header-title">技术方案要点</span>
              <span class="auto-fill-tag"><Sparkles :size="12" /> 已智能填充</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">项目理解与响应重点</label>
              <div class="textarea-wrapper">
                <textarea v-model="projectUnderstanding" class="form-textarea" maxlength="1000" placeholder="描述您对本项目的理解..."></textarea>
                <span class="char-count">{{ projectUnderstanding.length }} / 1000</span>
              </div>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">技术亮点与优势</label>
              <div class="textarea-wrapper">
                <textarea v-model="technicalHighlights" class="form-textarea" maxlength="1000" placeholder="描述技术优势与亮点..."></textarea>
                <span class="char-count">{{ technicalHighlights.length }} / 1000</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 大纲模式 -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <FolderOpen :size="18" class="header-icon" />
              <span class="header-title">大纲模式</span>
              <span class="auto-fill-tag"><Sparkles :size="12" /> AI 推荐</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group">
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

            <!-- 素材库模板匹配 -->
            <div v-if="outlineMode === 'template'" class="form-group" style="margin-bottom: 0;">
              <label class="form-label">匹配到的项目模板</label>
              <div class="template-list">
                <div
                  v-for="tpl in matchedTemplates"
                  :key="tpl.id"
                  class="template-item"
                  :class="{ selected: selectedTemplateId === tpl.id }"
                  @click="selectedTemplateId = tpl.id; pageCount = tpl.pages; aiRecommendedPages = tpl.pages;"
                >
                  <div class="template-radio">
                    <Check v-if="selectedTemplateId === tpl.id" :size="12" />
                  </div>
                  <div class="template-info">
                    <span class="template-name">{{ tpl.name }}</span>
                    <span class="template-meta">来源：{{ tpl.projectName }} · {{ tpl.pages }}页</span>
                  </div>
                  <span class="template-score">匹配度 {{ tpl.matchScore }}%</span>
                </div>
              </div>
            </div>

            <!-- 手动指定大纲 -->
            <div v-if="outlineMode === 'custom'" class="form-group" style="margin-bottom: 0;">
              <label class="form-label">自定义大纲目录</label>
              <div class="textarea-wrapper">
                <textarea class="form-textarea" maxlength="2000" placeholder="请输入大纲目录结构，每行一个章节标题，如：&#10;第一章 项目概述&#10;第二章 技术方案&#10;第三章 实施计划&#10;..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 页数设置 -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <Settings :size="18" class="header-icon" />
              <span class="header-title">生成配置</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">
                预设标书页数
                <span class="page-value">{{ pageCount }} 页</span>
                <span v-if="pageCount === aiRecommendedPages" class="ai-recommend-tag">
                  <Sparkles :size="11" /> AI 推荐
                </span>
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
                  <span class="ai-page-mark" v-if="aiRecommendedPages > 50 && aiRecommendedPages < 500">
                    AI推荐 {{ aiRecommendedPages }}页
                  </span>
                  <span>500页</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 补充说明 -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-left">
              <MessageSquare :size="18" class="header-icon" />
              <span class="header-title">补充说明</span>
              <span class="optional-tag">选填</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group" style="margin-bottom: 0;">
              <div class="textarea-wrapper">
                <textarea
                  v-model="additionalInfo"
                  class="form-textarea"
                  :maxlength="maxLength"
                  placeholder="请输入需要在标书中强调的内容，如：重点突出的技术优势、需要规避的竞争对手等..."
                ></textarea>
                <span class="char-count">{{ additionalInfo.length }} / {{ maxLength }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="submit-container">
        <button class="submit-btn" @click="handleSubmit">生成大纲</button>
      </div>
    </template>

    <template #info-sidebar>
      <InfoSidebar :icon="Zap" title="AI标书生成（一键版）" description="极简操作，上传文件即可自动生成专业标书" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
@import './styles.css';
</style>
