<script setup lang="ts">
import { ref } from 'vue';
import {
  FileSearch,
  Bell,
  FileText,
  Upload,
  X,
  Building2,
  Award,
  Briefcase,
  Users,
  ChevronDown,
  Check,
  ExternalLink
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from './shared';

const router = useRouter();
const route = useRoute();

// Get project info from query params if coming from bid list
const projectTitle = ref(route.query.title as string || '');
const preloadedFileName = ref(route.query.fileName as string || '');

// 只支持上传一套招标文件
const uploadedFile = ref<File | null>(null);
const additionalInfo = ref('');
const maxLength = 5000;

// Enterprise selection
const showEnterpriseDropdown = ref(false);

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

const selectedEnterprise = ref<Enterprise | null>(enterprises.value[0] ?? null);

const selectEnterprise = (enterprise: Enterprise) => {
  selectedEnterprise.value = enterprise;
  showEnterpriseDropdown.value = false;
};

const goToMaterialLibrary = () => {
  router.push({ name: 'enterprise-material' });
};

const templateTypes = [
  { icon: FileSearch, label: '标讯解读', active: true },
  { icon: Bell, label: '标讯订阅' },
  { icon: FileText, label: 'AI标书生成' },
];

const recentTools = [
  { icon: FileSearch, label: '标讯解读', active: true, route: 'bid-analysis-form' },
  { icon: FileText, label: 'AI标书生成', route: 'bid-doc-smart-form' },
  { icon: Bell, label: '标讯订阅', route: 'bid-subscription' },
];

const features = [
  '招标文件智能解析',
  '九大模块结构化提取',
  '企业素材库自动匹配',
  '投标可行性评估',
  '下一步行动计划生成',
];

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0] ?? null;
    target.value = '';
  }
};

const removeFile = () => {
  uploadedFile.value = null;
};

const clearAdditionalInfo = () => {
  additionalInfo.value = '';
};

const handleSubmit = () => {
  const formData = {
    additionalInfo: additionalInfo.value,
    fileName: uploadedFile.value?.name || ''
  };
  console.log('Submitting:', formData);

  router.push({
    name: 'bid-analysis-result',
    query: {
      fileName: uploadedFile.value?.name || ''
    }
  });
};
</script>

<template>
  <FormPageLayout :icon="FileSearch" title="标讯解读" subtitle="AI智能解析招标文件，快速提取关键信息">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

      <div class="form-content">
        <!-- File Upload -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 上传招标文件
          </label>
          <p class="upload-tip">请上传完整的一套招标文件，AI将进行精准解读分析</p>
          <label v-if="!uploadedFile" class="upload-area">
            <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" hidden />
            <Upload :size="32" />
            <div class="upload-text">
              <span class="upload-main">点击上传招标文件</span>
              <span class="upload-hint">支持 PDF、Word 格式，仅限上传 1 份完整招标文件</span>
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
            <button class="remove-file-btn" @click="removeFile">
              <X :size="18" />
            </button>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="form-group">
          <label class="form-label">投标主体</label>
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
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="form-group">
          <label class="form-label">辅助信息</label>
          <div class="textarea-wrapper">
            <textarea
              v-model="additionalInfo"
              class="info-textarea"
              :maxlength="maxLength"
              placeholder="建议输入清晰准确的审查要求，如：企业资质情况、重点关注条款、投标预算范围、竞争对手信息等（非必填）"
            ></textarea>
            <button v-if="additionalInfo" class="clear-btn" @click="clearAdditionalInfo">清空</button>
            <span class="char-count">{{ additionalInfo.length }} / {{ maxLength }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit">
            提交
          </button>
        </div>
      </div>

    <template #info-sidebar>
      <InfoSidebar :icon="FileSearch" title="标讯解读" description="AI快速解析招标文件，助您精准把握投标要点" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
.form-group {
  margin-bottom: 28px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
  margin-right: 2px;
}

.upload-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

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

.upload-tip {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.5;
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

.upload-count {
  font-weight: 400;
  color: #64748b;
  font-size: 13px;
}

/* Uploaded files list */
.uploaded-files-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
}

.uploaded-file-item .file-name {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-file-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.textarea-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.info-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  padding-bottom: 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

.info-textarea::placeholder {
  color: #94a3b8;
}

.textarea-wrapper:focus-within {
  border-color: #2563eb;
}

.clear-btn {
  position: absolute;
  right: 50px;
  bottom: 8px;
  padding: 2px 8px;
  border: none;
  background: transparent;
  color: #64748b;
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
  bottom: 8px;
  font-size: 13px;
  color: #94a3b8;
}

/* Enterprise Selector */
.field-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

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
</style>
