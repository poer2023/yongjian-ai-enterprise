<script setup lang="ts">
import { ref } from 'vue';
import { FileText, Upload, X, Zap } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import { recentTools, features } from './mockData';

const router = useRouter();

const bidDocFiles = ref<File[]>([]);
const templateFile = ref<File | null>(null);
const referenceHistoryFile = ref<File | null>(null);
const additionalInfo = ref('');
const maxLength = 2000;

const handleBidDocsUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    bidDocFiles.value = [...bidDocFiles.value, ...Array.from(target.files)];
    target.value = '';
  }
};

const removeBidDoc = (index: number) => {
  bidDocFiles.value = bidDocFiles.value.filter((_, i) => i !== index);
};

const makeSingleFileHandler = (fileRef: typeof templateFile) => (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileRef.value = target.files[0] ?? null;
    target.value = '';
  }
};

const handleTemplateUpload = makeSingleFileHandler(templateFile);
const handleReferenceHistoryUpload = makeSingleFileHandler(referenceHistoryFile);

const removeTemplateFile = () => {
  templateFile.value = null;
};

const removeReferenceHistoryFile = () => {
  referenceHistoryFile.value = null;
};

const handleSubmit = () => {
  router.push({
    name: 'bid-doc-generating',
    query: {
      source: 'plugin',
      filename: bidDocFiles.value.map((f) => f.name).join(', '),
      templateName: templateFile.value?.name ?? '',
      referenceName: referenceHistoryFile.value?.name ?? '',
      additionalInfo: additionalInfo.value || undefined,
    },
  });
};
</script>

<template>
  <FormPageLayout :icon="Zap" title="AI标书插件版" subtitle="上传招标文件并补充需求后，AI 将直接开始生成投标文件">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <div class="flat-form-section">
      <div class="flat-section-title">
        <span><i class="title-required">*</i> 招标文件</span>
      </div>
      <div class="form-group upload-field-group">
        <p class="upload-note">
          请上传招标方提供的全套招标文件（含公告、须知、技术规范、评分办法、合同条款等），尽量齐全完整，便于准确理解与响应。
        </p>
        <div class="upload-stack">
          <div v-for="(file, index) in bidDocFiles" :key="`${file.name}-${index}-${file.size}`" class="uploaded-file-card">
            <div class="file-info">
              <FileText :size="22" class="file-icon" />
              <div class="file-details">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
              </div>
            </div>
            <div class="file-actions">
              <button type="button" class="remove-file-btn" @click="removeBidDoc(index)">
                <X :size="18" />
              </button>
            </div>
          </div>
          <label class="upload-area">
            <input type="file" multiple @change="handleBidDocsUpload" accept=".pdf,.doc,.docx" hidden />
            <div class="upload-icon-wrap">
              <Upload :size="26" />
            </div>
            <div class="upload-text">
              <span class="upload-main">{{ bidDocFiles.length ? '继续添加招标文件' : '点击上传招标文件' }}</span>
              <span class="upload-hint">支持多选 PDF / Word，可多次添加附件；也可将文件拖入此处</span>
            </div>
          </label>
        </div>
      </div>

      <div class="flat-section-title">
        <span><i class="title-required">*</i> 投标模板</span>
      </div>
      <div class="form-group upload-field-group">
        <p class="upload-note">
          请上传已明确章节大纲与版式格式的投标模板（或招标方指定的固定范本），生成内容将按该结构编排。
        </p>
        <label v-if="!templateFile" class="upload-area">
          <input type="file" @change="handleTemplateUpload" accept=".pdf,.doc,.docx" hidden />
          <div class="upload-icon-wrap">
            <Upload :size="26" />
          </div>
          <div class="upload-text">
            <span class="upload-main">点击上传投标模板</span>
            <span class="upload-hint">单个 PDF / Word；可将文件拖入此处</span>
          </div>
        </label>
        <div v-else class="uploaded-file-card">
          <div class="file-info">
            <FileText :size="22" class="file-icon" />
            <div class="file-details">
              <span class="file-name">{{ templateFile.name }}</span>
              <span class="file-size">{{ (templateFile.size / 1024 / 1024).toFixed(2) }} MB</span>
            </div>
          </div>
          <div class="file-actions">
            <button type="button" class="remove-file-btn" @click="removeTemplateFile">
              <X :size="18" />
            </button>
          </div>
        </div>
      </div>

      <div class="flat-section-title">
        <span><i class="title-required">*</i> 参考历史标书</span>
      </div>
      <div class="form-group upload-field-group" style="margin-bottom: 0;">
        <p class="upload-note">
          请上传与本项目类型、标的最为接近，且章节与表述最为详尽完整的一份历史投标书，便于参考结构与商务、技术写法。
        </p>
        <label v-if="!referenceHistoryFile" class="upload-area">
          <input type="file" @change="handleReferenceHistoryUpload" accept=".pdf,.doc,.docx" hidden />
          <div class="upload-icon-wrap">
            <Upload :size="26" />
          </div>
          <div class="upload-text">
            <span class="upload-main">点击上传参考历史标书</span>
            <span class="upload-hint">单个 PDF / Word；可将文件拖入此处</span>
          </div>
        </label>
        <div v-else class="uploaded-file-card">
          <div class="file-info">
            <FileText :size="22" class="file-icon" />
            <div class="file-details">
              <span class="file-name">{{ referenceHistoryFile.name }}</span>
              <span class="file-size">{{ (referenceHistoryFile.size / 1024 / 1024).toFixed(2) }} MB</span>
            </div>
          </div>
          <div class="file-actions">
            <button type="button" class="remove-file-btn" @click="removeReferenceHistoryFile">
              <X :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flat-form-section">
      <div class="flat-section-title">
        <span>补充需求</span>
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <div class="textarea-wrapper">
          <textarea
            v-model="additionalInfo"
            class="form-textarea"
            :maxlength="maxLength"
            placeholder="可填写特殊格式要求、重点章节要求、风格偏好等补充信息。例如：重点突出同类项目业绩，技术方案采用正式商务风格，报价部分保持简洁清晰。"
          ></textarea>
          <span class="char-count">{{ additionalInfo.length }} / {{ maxLength }}</span>
        </div>
      </div>
    </div>

    <div class="submit-container">
      <button type="button" class="submit-btn" @click="handleSubmit">AI生成</button>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="Zap" title="AI标书插件版" description="极简录入后直接进入等待页，不再跳转到大纲和编辑器流程" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
@import './styles.css';
</style>
