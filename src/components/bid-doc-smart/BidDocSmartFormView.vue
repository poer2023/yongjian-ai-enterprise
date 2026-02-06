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
  Briefcase
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import {
  enterprises as defaultEnterprises,
  parsedAnalysis,
  mockParsedData,
  recentTools,
  bidDocTypes,
  features
} from './mockData';
import type { Enterprise } from './types';

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
  projectUnderstanding.value = '';
  technicalHighlights.value = '';
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
  <FormPageLayout :icon="Zap" title="AI标书生成（智能版）" subtitle="极简操作，上传文件即可自动生成专业标书">
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
                  <span class="qualification-matched">{{ item.matched }}</span>
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
      </div>

      <div class="submit-container">
        <button class="submit-btn" @click="handleSubmit">生成大纲</button>
      </div>
    </template>

    <template #info-sidebar>
      <InfoSidebar :icon="Zap" title="AI标书生成（智能版）" description="极简操作，上传文件即可自动生成专业标书" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
@import './styles.css';
</style>
