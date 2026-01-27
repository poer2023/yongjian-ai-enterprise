<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileText,
  Download,
  Save,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  Edit3,
  Stamp
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 目录结构
const chapters = ref([
  { id: 1, title: '封面', level: 0, active: true },
  { id: 2, title: '投标函', level: 0 },
  { id: 3, title: '法定代表人授权书', level: 0 },
  { id: 4, title: '投标报价', level: 0 },
  { id: 5, title: '技术标', level: 0, children: [
    { id: 51, title: '项目理解', level: 1 },
    { id: 52, title: '技术方案', level: 1 },
    { id: 53, title: '实施计划', level: 1 },
    { id: 54, title: '质量保证', level: 1 },
  ]},
  { id: 6, title: '商务标', level: 0, children: [
    { id: 61, title: '企业介绍', level: 1 },
    { id: 62, title: '项目业绩', level: 1 },
    { id: 63, title: '团队配置', level: 1 },
  ]},
  { id: 7, title: '资格证明', level: 0, children: [
    { id: 71, title: '营业执照', level: 1 },
    { id: 72, title: '资质证书', level: 1 },
    { id: 73, title: '人员证书', level: 1 },
  ]},
]);

// 废标项检查
const disqualificationChecks = ref([
  { id: 1, item: '投标保证金', status: 'pass', detail: '金额：5万元' },
  { id: 2, item: '法人授权书', status: 'warning', detail: '需上传扫描件' },
  { id: 3, item: '营业执照副本', status: 'pass', detail: '已关联' },
  { id: 4, item: '资质证书', status: 'pass', detail: '共5项' },
  { id: 5, item: '投标报价单', status: 'pass', detail: '已填写' },
  { id: 6, item: '技术方案', status: 'pass', detail: '已生成' },
]);

// 评分点响应检查
const scoreChecks = ref([
  { item: '技术方案', score: 40, status: 'pass', suggestion: '内容完整' },
  { item: '项目业绩', score: 25, status: 'warning', suggestion: '建议补充2个案例' },
  { item: '团队配置', score: 20, status: 'pass', suggestion: '已配置8人团队' },
  { item: '企业资质', score: 10, status: 'pass', suggestion: '资质齐全' },
  { item: '报价', score: 5, status: 'pass', suggestion: '价格合理' },
]);

// 签章提醒
const signatureReminders = ref([
  { position: '封面', page: 1 },
  { position: '投标函', page: 2 },
  { position: '报价单', page: 5 },
  { position: '法人授权书', page: 3 },
  { position: '技术方案末页', page: 28 },
]);

// 当前编辑章节
const activeChapter = ref(chapters.value[0]);

const goBack = () => {
  router.push({ name: 'bid-doc-form' });
};

const selectChapter = (chapter: any) => {
  activeChapter.value = chapter;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pass': return CheckCircle;
    case 'warning': return AlertTriangle;
    case 'error': return AlertCircle;
    default: return CheckCircle;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pass': return 'status-pass';
    case 'warning': return 'status-warning';
    case 'error': return 'status-error';
    default: return '';
  }
};

const exportWord = () => {
  console.log('导出Word');
  alert('Word文档已导出');
};

const exportPdf = () => {
  console.log('导出PDF');
  alert('PDF文档已导出');
};

const saveDraft = () => {
  console.log('保存草稿');
  alert('草稿已保存');
};

const passCount = ref(disqualificationChecks.value.filter(c => c.status === 'pass').length);
const totalCount = ref(disqualificationChecks.value.length);
</script>

<template>
  <div class="result-page">
    <!-- Header -->
    <div class="result-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回</span>
      </button>
      <div class="header-title">
        <FileText :size="20" />
        <h1>标书预览与编辑</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn tertiary" @click="saveDraft">
          <Save :size="16" />
          保存草稿
        </button>
        <button class="action-btn secondary" @click="exportWord">
          <Download :size="16" />
          导出Word
        </button>
        <button class="action-btn primary" @click="exportPdf">
          <Download :size="16" />
          导出PDF
        </button>
      </div>
    </div>

    <div class="result-content">
      <!-- 左侧：目录导航 -->
      <div class="nav-panel">
        <div class="nav-header">
          <h3>目录</h3>
        </div>
        <div class="chapter-list">
          <template v-for="chapter in chapters" :key="chapter.id">
            <div
              class="chapter-item"
              :class="{ active: activeChapter.id === chapter.id }"
              @click="selectChapter(chapter)"
            >
              <span class="chapter-title">{{ chapter.title }}</span>
              <ChevronRight v-if="chapter.children" :size="14" />
            </div>
            <template v-if="chapter.children">
              <div
                v-for="sub in chapter.children"
                :key="sub.id"
                class="chapter-item sub"
                :class="{ active: activeChapter.id === sub.id }"
                @click="selectChapter(sub)"
              >
                <span class="chapter-title">{{ sub.title }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- 中间：内容预览 -->
      <div class="content-panel">
        <div class="content-header">
          <h2>{{ activeChapter.title }}</h2>
          <button class="edit-btn">
            <Edit3 :size="14" />
            编辑
          </button>
        </div>
        <div class="content-body">
          <div class="doc-preview">
            <div class="preview-page">
              <div v-if="activeChapter.id === 1" class="cover-page">
                <h1>投标文件</h1>
                <div class="cover-info">
                  <p class="project-name">XX市政府信息系统安全等级保护测评服务项目</p>
                  <div class="cover-divider"></div>
                  <p class="company-name">XX科技有限公司</p>
                  <p class="date">2024年2月</p>
                </div>
                <div class="stamp-placeholder">
                  <Stamp :size="24" />
                  <span>公章位置</span>
                </div>
              </div>
              <div v-else class="content-placeholder">
                <FileText :size="48" />
                <p>{{ activeChapter.title }} 内容预览</p>
                <span>点击"编辑"按钮可修改内容</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：AI辅助面板 -->
      <div class="ai-panel">
        <!-- 废标项检查 -->
        <div class="check-section">
          <div class="section-header">
            <h3>废标项检查</h3>
            <span class="check-summary">{{ passCount }}/{{ totalCount }}</span>
          </div>
          <div class="check-list">
            <div
              v-for="check in disqualificationChecks"
              :key="check.id"
              class="check-item"
              :class="getStatusClass(check.status)"
            >
              <component :is="getStatusIcon(check.status)" :size="14" class="check-icon" />
              <span class="check-name">{{ check.item }}</span>
              <span class="check-detail">{{ check.detail }}</span>
            </div>
          </div>
        </div>

        <!-- 评分点响应 -->
        <div class="check-section">
          <div class="section-header">
            <h3>评分点响应检查</h3>
          </div>
          <div class="score-list">
            <div
              v-for="check in scoreChecks"
              :key="check.item"
              class="score-item"
              :class="getStatusClass(check.status)"
            >
              <div class="score-header">
                <component :is="getStatusIcon(check.status)" :size="14" class="check-icon" />
                <span class="score-name">{{ check.item }}</span>
                <span class="score-value">{{ check.score }}分</span>
              </div>
              <span class="score-suggestion">{{ check.suggestion }}</span>
            </div>
          </div>
        </div>

        <!-- 签章提醒 -->
        <div class="check-section">
          <div class="section-header">
            <h3>签章提醒</h3>
            <span class="stamp-count">{{ signatureReminders.length }}处</span>
          </div>
          <div class="stamp-list">
            <div v-for="stamp in signatureReminders" :key="stamp.position" class="stamp-item">
              <Stamp :size="14" />
              <span class="stamp-position">{{ stamp.position }}</span>
              <span class="stamp-page">第{{ stamp.page }}页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
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

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #10b981;
}

.header-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #10b981;
  color: white;
}

.action-btn.primary:hover {
  background: #059669;
}

.action-btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #f8fafc;
}

.action-btn.tertiary {
  background: #f8fafc;
  color: #475569;
}

.action-btn.tertiary:hover {
  background: #f1f5f9;
}

.result-content {
  flex: 1;
  display: flex;
  gap: 0;
  overflow: hidden;
}

.nav-panel {
  width: 220px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.nav-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.nav-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chapter-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chapter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.chapter-item:hover {
  background: #f8fafc;
}

.chapter-item.active {
  background: #ecfdf5;
  color: #10b981;
  font-weight: 500;
}

.chapter-item.sub {
  padding-left: 28px;
  font-size: 12px;
}

.chapter-item svg {
  color: #94a3b8;
}

.content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.content-header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #eff6ff;
  border: none;
  border-radius: 6px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #dbeafe;
}

.content-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.doc-preview {
  width: 100%;
  max-width: 800px;
}

.preview-page {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 500px;
  padding: 48px;
}

.cover-page {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.cover-page h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 48px 0;
}

.cover-info {
  margin-bottom: 48px;
}

.project-name {
  font-size: 20px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 24px 0;
}

.cover-divider {
  width: 120px;
  height: 2px;
  background: #10b981;
  margin: 0 auto 24px;
}

.company-name {
  font-size: 18px;
  color: #475569;
  margin: 0 0 12px 0;
}

.date {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.stamp-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  border: 2px dashed #fbbf24;
  border-radius: 8px;
  color: #d97706;
  font-size: 13px;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #94a3b8;
  text-align: center;
}

.content-placeholder svg {
  margin-bottom: 16px;
}

.content-placeholder p {
  font-size: 16px;
  margin: 0 0 8px 0;
}

.content-placeholder span {
  font-size: 13px;
}

.ai-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.check-section {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.check-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.check-summary {
  font-size: 13px;
  font-weight: 500;
  color: #22c55e;
}

.stamp-count {
  font-size: 12px;
  color: #64748b;
}

.check-list,
.score-list,
.stamp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
}

.check-item.status-pass {
  background: #f0fdf4;
}

.check-item.status-pass .check-icon {
  color: #22c55e;
}

.check-item.status-warning {
  background: #fefce8;
}

.check-item.status-warning .check-icon {
  color: #eab308;
}

.check-item.status-error {
  background: #fef2f2;
}

.check-item.status-error .check-icon {
  color: #ef4444;
}

.check-name {
  flex: 1;
  color: #334155;
}

.check-detail {
  font-size: 12px;
  color: #64748b;
}

.score-item {
  padding: 10px 12px;
  border-radius: 6px;
}

.score-item.status-pass {
  background: #f0fdf4;
}

.score-item.status-warning {
  background: #fefce8;
}

.score-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.score-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.score-value {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
}

.score-suggestion {
  font-size: 12px;
  color: #64748b;
  margin-left: 20px;
}

.stamp-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #fef3c7;
  border-radius: 6px;
  font-size: 13px;
}

.stamp-item svg {
  color: #d97706;
}

.stamp-position {
  flex: 1;
  color: #92400e;
}

.stamp-page {
  font-size: 12px;
  color: #b45309;
}
</style>
