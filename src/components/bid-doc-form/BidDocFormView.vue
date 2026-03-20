<script setup lang="ts">
import { ref } from 'vue';
import {
  FileText,
  Bell,
  FileSearch,
  Upload,
  HelpCircle,
  X,
  Lightbulb,
  Settings,
  FolderOpen,
  MessageSquare,
  Check
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import {
  companyOptions,
  bidDocTypes,
  outlineModes,
  writingStyles,
  tableConfigs,
  chartConfigs,
  imageConfigs,
  focusModes,
  mockCases,
  mockMembers,
  mockCertificates,
  features
} from './mockData';

const router = useRouter();

// Form data
const bidFile = ref<File | null>(null);
const bidTitle = ref('');
const selectedCompany = ref('company1');
const bidDocType = ref('service');
const outlineMode = ref('ai');
const pageCount = ref(100);
const writingStyle = ref('formal');
const tableConfig = ref('moderate');
const chartConfig = ref('flowchart');
const imageConfig = ref('moderate');
const focusMode = ref('auto');
const additionalInfo = ref('');
const maxLength = 2000;
const technicalHighlights = ref('');
const technicalMaxLength = 1000;

const recentTools = [
  { icon: FileText, label: 'AI标书生成（表单版）', active: true, route: 'bid-doc-form' },
  { icon: FileSearch, label: '标讯解读', active: false, route: 'bid-analysis-form' },
  { icon: Bell, label: '资讯订阅', active: false, route: 'bid-subscription' },
];

// Material selections
const selectedCases = ref<string[]>([]);
const selectedMembers = ref<string[]>([]);
const selectedCertificates = ref<string[]>([]);

const toggleMaterial = (type: 'cases' | 'members' | 'certificates', id: string) => {
  const target = type === 'cases' ? selectedCases : type === 'members' ? selectedMembers : selectedCertificates;
  const index = target.value.indexOf(id);
  if (index > -1) {
    target.value.splice(index, 1);
  } else {
    target.value.push(id);
  }
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
  <FormPageLayout :icon="FileText" title="AI标书生成（表单版）" subtitle="智能解析招标文件，一键生成规范标书">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <!-- Section 1: 基础信息 -->
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
        <div class="form-group" style="margin-bottom: 0;">
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

    <!-- Section 2: 技术方案要点 -->
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

    <!-- Section 3: 生成配置 -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <Settings :size="18" class="header-icon" />
          <span class="header-title">生成配置</span>
        </div>
      </div>
      <div class="card-body">
        <!-- 大纲模式 -->
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

    <!-- Section 4: 内容与素材 -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <FolderOpen :size="18" class="header-icon" />
          <span class="header-title">内容与素材</span>
        </div>
      </div>
      <div class="card-body">
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

        <!-- 素材匹配模式 -->
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

        <!-- 素材精细控制 -->
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

    <!-- Section 5: 补充说明 -->
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

    <template #info-sidebar>
      <InfoSidebar :icon="FileText" title="AI标书生成（表单版）" description="智能解析招标文件，一键生成规范标书" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
@import './styles.css';
</style>
