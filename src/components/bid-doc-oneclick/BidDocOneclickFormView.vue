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
const uploadedTemplate = ref<File | null>(null);
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
const additionalInfo = ref('');
const maxLength = 2000;

// Generate mode: oneclick or node-by-node
const generateMode = ref<GenerateMode>('node');
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

const handleTemplateUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadedTemplate.value = target.files[0] ?? null;
    target.value = '';
  }
};

const removeTemplate = () => {
  uploadedTemplate.value = null;
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
  additionalInfo.value = '';
};

const handleParse = () => {
  isParsing.value = true;
  setTimeout(() => {
    bidTitle.value = mockParsedData.bidTitle;
    bidDocType.value = mockParsedData.bidDocType;
    projectUnderstanding.value = mockParsedData.projectUnderstanding;
    technicalHighlights.value = mockParsedData.technicalHighlights;
    isParsing.value = false;
    isParsed.value = true;
  }, 3000);
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

const handleNodeGenerate = () => {
  router.push({
    name: 'bid-doc-skeleton',
    query: {
      company: selectedEnterprise.value?.id.toString() || '',
      type: bidDocType.value,
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
  <!-- Processing Waiting Page -->
  <div v-if="isParsing" class="processing-page">
    <div class="processing-content">
      <h1 class="processing-main-title">解读中</h1>
      <p class="processing-main-subtitle">请耐心等待，AI正在为您解读标书文件</p>

      <div class="progress-card">
        <div class="progress-card-header">解读进度</div>
        <div class="progress-card-body">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p class="progress-status">解读中...</p>
        </div>
      </div>

      <p class="processing-footer-hint">完成解读大约需要1~3分钟，后续可在 个人中心-使用记录 中查看，感谢理解~</p>
    </div>
  </div>

  <FormPageLayout v-else :icon="Zap" title="AI标书生成（一键版）" subtitle="极简操作，上传文件即可自动生成专业标书">
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

            <!-- 上传项目模板 -->
            <div v-if="outlineMode === 'template'" class="form-group" style="margin-bottom: 0;">
              <label v-if="!uploadedTemplate" class="upload-area">
                <input type="file" @change="handleTemplateUpload" accept=".pdf,.doc,.docx" hidden />
                <Upload :size="32" />
                <div class="upload-text">
                  <span class="upload-main">点击上传模板文件</span>
                  <span class="upload-hint">支持 PDF、Word 格式</span>
                </div>
              </label>
              <div v-else class="uploaded-file-card">
                <div class="file-info">
                  <FileText :size="24" class="file-icon" />
                  <div class="file-details">
                    <span class="file-name">{{ uploadedTemplate.name }}</span>
                    <span class="file-size">{{ (uploadedTemplate.size / 1024 / 1024).toFixed(2) }} MB</span>
                  </div>
                </div>
                <div class="file-actions">
                  <button class="remove-file-btn" @click="removeTemplate"><X :size="18" /></button>
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
