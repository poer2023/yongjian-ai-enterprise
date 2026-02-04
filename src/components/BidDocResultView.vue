<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  ChevronLeft,
  Type,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Grid3X3,
  Code,
  Image,
  BarChart3,
  Table2,
  Search,
  FileText,
  LayoutGrid,
  Sparkles,
  Zap,
  Clock,
  Presentation,
  Edit3,
  Loader2
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Real outline from parsed document - IDs match the HTML headings
const outlineItems = ref([
  { id: 'section-1', title: '投标文件基本文件', level: 1, children: [
    { id: 'section-1-1', title: '公章对投标专用章的授权函', level: 2 },
    { id: 'section-1-2', title: '投标函', level: 2 },
    { id: 'section-1-3', title: '开标一览表', level: 2 },
    { id: 'section-1-4', title: '分项报价表', level: 2 },
    { id: 'section-1-5', title: '投标保证金缴纳凭证', level: 2 },
    { id: 'section-1-6', title: '投标保证金退款账户信息', level: 2 },
    { id: 'section-1-7', title: '中标服务费承诺书', level: 2 },
  ]},
  { id: 'section-2', title: '商务响应文件', level: 1, children: [
    { id: 'section-2-8', title: '企业法人营业执照副本', level: 2 },
    { id: 'section-2-9', title: '工商变更登记文件', level: 2 },
    { id: 'section-2-10', title: '法定代表人授权书', level: 2 },
    { id: 'section-2-11', title: '廉洁承诺书', level: 2 },
    { id: 'section-2-12', title: '投标人关联关系单位披露表', level: 2 },
    { id: 'section-2-13', title: '网络安全等级测评机构服务认证证书', level: 2 },
    { id: 'section-2-14', title: '全国网络安全等级测评机构目录截图', level: 2 },
    { id: 'section-2-15', title: '从业年限证明', level: 2 },
    { id: 'section-2-16', title: '资质认证', level: 2 },
    { id: 'section-2-17', title: '技术/服务需求响应偏离表', level: 2 },
    { id: 'section-2-18', title: '合同条款响应偏离表', level: 2 },
    { id: 'section-2-19', title: '投标人情况介绍', level: 2 },
    { id: 'section-2-20', title: '财务状况及财务报告', level: 2 },
  ]},
  { id: 'section-3', title: '技术响应文件', level: 1, children: [
    { id: 'section-3-21', title: '《技术要求与服务内容》点对点应答', level: 2 },
    { id: 'section-3-22', title: '投标人所投服务符合招标文件规定的证明', level: 2 },
    { id: 'section-3-23', title: '相关承诺书', level: 2 },
    { id: 'section-3-24', title: '项目方案', level: 2 },
    { id: 'section-3-25', title: '招标人需配合的前期准备工作', level: 2 },
    { id: 'section-3-26', title: '利益冲突说明', level: 2 },
  ]},
]);

const activeOutlineId = ref('1');
const documentContent = ref('');
const isLoading = ref(true);
const loadError = ref('');

const goBack = () => {
  router.push({ name: 'bid-doc-form' });
};

const selectOutline = (id: string) => {
  activeOutlineId.value = id;
  // Scroll to corresponding section in document
  const heading = document.getElementById(id);
  if (heading) {
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const exportWord = () => {
  alert('Word文档已导出');
};

// Load document content
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await fetch('/docs/bid-doc.html');
    if (!response.ok) {
      throw new Error('Failed to load document');
    }
    const html = await response.text();
    documentContent.value = html;
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading document:', error);
    loadError.value = '文档加载失败，请刷新重试';
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="result-page-fullscreen">
    <!-- Header -->
    <header class="result-header">
      <!-- Left blue section -->
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
        </button>
        <div class="header-tag">AI标书生成</div>
        <div class="header-title">信息系统安全等级保护测评（等保2.0）项目投标文件</div>
        <div class="header-status">已保存</div>
      </div>

      <!-- Right white section -->
      <div class="header-right">
        <div class="format-toolbar">
          <button class="toolbar-btn"><Type :size="16" /></button>
          <button class="toolbar-btn"><Undo2 :size="16" /></button>
          <button class="toolbar-btn"><Redo2 :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn text-btn">H1</button>
          <button class="toolbar-btn text-btn">H2</button>
          <button class="toolbar-btn text-btn">H3</button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Bold :size="16" /></button>
          <button class="toolbar-btn"><Italic :size="16" /></button>
          <button class="toolbar-btn"><Underline :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Grid3X3 :size="16" /></button>
          <button class="toolbar-btn"><Code :size="16" /></button>
        </div>
        <button class="export-btn" @click="exportWord">
          导出Word
        </button>
      </div>
    </header>

    <div class="result-body">
      <!-- Left Outline Panel -->
      <aside class="outline-panel">
        <h3 class="outline-title">大纲</h3>
        <div class="outline-list">
          <template v-for="item in outlineItems" :key="item.id">
            <div
              class="outline-item level-1"
              :class="{ active: activeOutlineId === item.id }"
              @click="selectOutline(item.id)"
            >
              {{ item.title }}
            </div>
            <template v-if="item.children">
              <div
                v-for="sub in item.children"
                :key="sub.id"
                class="outline-item level-2"
                :class="{ active: activeOutlineId === sub.id }"
                @click="selectOutline(sub.id)"
              >
                {{ sub.title }}
              </div>
            </template>
          </template>
        </div>
      </aside>

      <!-- Center Content Panel -->
      <main class="content-panel">
        <div class="document-container">
          <div class="document-wrapper">
            <!-- Loading State -->
            <div v-if="isLoading" class="loading-state">
              <Loader2 :size="32" class="loading-spinner" />
              <p>正在加载文档...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="loadError" class="error-state">
              <p>{{ loadError }}</p>
            </div>

            <!-- Document Content -->
            <article v-else class="document-content" v-html="documentContent">
            </article>

            <!-- Edit icon -->
            <button class="doc-edit-btn">
              <Edit3 :size="14" />
            </button>
          </div>
        </div>
      </main>

      <!-- Right AI Tools Panel -->
      <aside class="ai-tools-panel">
        <!-- AI Text Edit -->
        <div class="tool-section">
          <div class="section-header">
            <Edit3 :size="16" class="section-icon blue" />
            <span class="section-title">AI文本编辑</span>
          </div>
          <p class="section-desc">选中文字后，点击对应文本编辑工具</p>
          <div class="ai-edit-grid">
            <button class="ai-edit-btn">改写</button>
            <button class="ai-edit-btn">扩写</button>
            <button class="ai-edit-btn">缩写</button>
            <button class="ai-edit-btn">翻译</button>
          </div>
        </div>

        <!-- Multi-modal AI Generation -->
        <div class="tool-section">
          <div class="section-header">
            <Sparkles :size="16" class="section-icon purple" />
            <span class="section-title">多模态AI生成</span>
          </div>
          <p class="section-desc">选中文字后，点击对应多模态生成工具</p>
          <div class="multimodal-grid">
            <button class="multimodal-btn">
              <BarChart3 :size="24" />
              <span>示意图</span>
            </button>
            <button class="multimodal-btn">
              <LayoutGrid :size="24" />
              <span>图表</span>
            </button>
            <button class="multimodal-btn">
              <Image :size="24" />
              <span>图片</span>
            </button>
            <button class="multimodal-btn">
              <Table2 :size="24" />
              <span>表格</span>
            </button>
            <button class="multimodal-btn">
              <Code :size="24" />
              <span>公式</span>
            </button>
          </div>
        </div>

        <!-- Academic Optimization -->
        <div class="tool-section">
          <div class="section-header">
            <FileText :size="16" class="section-icon green" />
            <span class="section-title">学术优化</span>
          </div>
          <div class="academic-grid">
            <button class="academic-btn">
              <Search :size="20" />
              <span>学术搜索</span>
            </button>
            <button class="academic-btn active">
              <FileText :size="20" />
              <span>文献格式</span>
            </button>
            <button class="academic-btn">
              <BarChart3 :size="20" />
              <span>图表排序</span>
            </button>
          </div>
        </div>

        <!-- Document to PPT -->
        <div class="tool-section ppt-section">
          <div class="section-header">
            <Presentation :size="16" class="section-icon orange" />
            <span class="section-title">文档转PPT</span>
          </div>
          <div class="ppt-features">
            <div class="ppt-feature">
              <Zap :size="14" class="feature-icon green" />
              <span class="feature-label">智能匹配</span>
              <span class="feature-tag green">100%忠于原文内容生成</span>
            </div>
            <div class="ppt-feature">
              <Sparkles :size="14" class="feature-icon red" />
              <span class="feature-label">专业排版</span>
              <span class="feature-desc">海量模版选择，专业图示效果</span>
            </div>
            <div class="ppt-feature">
              <Clock :size="14" class="feature-icon yellow" />
              <span class="feature-label">省时省力</span>
              <span class="feature-desc">只需几分钟，演讲、汇报轻松搞定</span>
            </div>
          </div>
          <button class="ppt-generate-btn">
            立即生成专业PPT
            <Presentation :size="18" />
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.result-page-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  z-index: 100;
}

/* Header */
.result-header {
  display: flex;
  height: 54px;
  background: white;
  border-bottom: 1px solid #e8ecf1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: #eef4ff;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 10px 20px;
  background: #eef4ff;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #eef4ff;
  border: none;
  border-radius: 10px;
  color: #4b83f0;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dde9ff;
}

.header-tag {
  padding: 6px 14px;
  background: white;
  color: #4b83f0;
  border: 1px solid #4b83f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.header-title {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 400;
}

.header-status {
  color: #999;
  font-size: 13px;
}

.format-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn.text-btn {
  font-size: 13px;
  font-weight: 600;
  width: auto;
  padding: 0 8px;
}

.toolbar-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.toolbar-divider {
  width: 1px;
  height: 16px;
  background: #e0e0e0;
  margin: 0 6px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #4b83f0;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 16px;
}

.export-btn:hover {
  background: #3a6fd8;
}

/* Body Layout */
.result-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Outline Panel */
.outline-panel {
  width: 340px;
  background: white;
  border-right: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.outline-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 20px 24px 16px;
  margin: 0;
}

.outline-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 20px;
}

.outline-item {
  padding: 12px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.6;
  margin-bottom: 2px;
}

.outline-item:hover {
  background: #f8f9fb;
}

.outline-item.active {
  background: #eef4ff;
  color: #4b83f0;
}

.outline-item.level-1 {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
}

.outline-item.level-2 {
  padding-left: 28px;
  font-size: 13px;
  color: #666;
}

/* Content Panel */
.content-panel {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  background: #f5f7fa;
}

.document-container {
  max-width: 820px;
  margin: 0 auto;
}

.document-wrapper {
  position: relative;
}

.document-content {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 48px 56px;
  min-height: 800px;
}

/* Loading and Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  color: #4b83f0;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.doc-edit-btn {
  position: absolute;
  top: 48px;
  right: -40px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
}

.doc-edit-btn:hover {
  color: #4b83f0;
  border-color: #4b83f0;
}

/* AI Tools Panel */
.ai-tools-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e8ecf1;
  overflow-y: auto;
  padding: 20px;
}

.tool-section {
  margin-bottom: 28px;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-icon {
  flex-shrink: 0;
}

.section-icon.blue { color: #4b83f0; }
.section-icon.purple { color: #9b59b6; }
.section-icon.green { color: #27ae60; }
.section-icon.orange { color: #e74c3c; }

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.section-desc {
  font-size: 12px;
  color: #999;
  margin: 0 0 14px 0;
}

/* AI Edit Buttons */
.ai-edit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.ai-edit-btn {
  padding: 12px 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-edit-btn:hover {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f8fbff;
}

/* Multi-modal Grid */
.multimodal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.multimodal-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 10px;
  background: #f8f9fb;
  border: 1px solid #eee;
  border-radius: 8px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.multimodal-btn:hover {
  background: #eef4ff;
  border-color: #4b83f0;
  color: #4b83f0;
}

/* Academic Grid */
.academic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.academic-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 10px;
  background: #f8f9fb;
  border: 1px solid #eee;
  border-radius: 8px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.academic-btn:hover {
  background: #eef4ff;
  border-color: #4b83f0;
  color: #4b83f0;
}

.academic-btn.active {
  background: #eef4ff;
  border-color: #4b83f0;
  color: #4b83f0;
}

/* PPT Section */
.ppt-section {
  background: #fff;
  border-radius: 8px;
  padding: 0;
}

.ppt-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.ppt-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.feature-icon {
  flex-shrink: 0;
}

.feature-icon.green { color: #27ae60; }
.feature-icon.red { color: #e74c3c; }
.feature-icon.yellow { color: #f39c12; }

.feature-label {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.feature-tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.feature-tag.green {
  background: #e8f8ef;
  color: #27ae60;
}

.feature-desc {
  color: #999;
  font-size: 11px;
}

.ppt-generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #f5a623, #e8852e);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.ppt-generate-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 166, 35, 0.3);
}

/* Document Content Styles */
:deep(.document-content) {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

:deep(.document-content p) {
  margin: 0 0 12px 0;
  text-align: justify;
}

/* Cover Section Styles */
:deep(.doc-cover-section) {
  text-align: center;
  padding: 60px 40px 40px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 40px;
}

:deep(.doc-cover-section p) {
  text-align: center;
  margin: 12px 0;
}

:deep(.doc-cover-section p strong) {
  font-size: 22px;
  display: block;
  margin: 20px 0;
}

:deep(.doc-cover-section p:first-child strong) {
  font-size: 28px;
  border: 2px solid #333;
  padding: 12px 32px;
  display: inline-block;
}

/* TOC Section Styles */
:deep(.doc-toc-section) {
  padding: 40px 20px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 40px;
}

:deep(.doc-toc-section > p:first-child) {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

:deep(.toc-item) {
  display: flex;
  align-items: baseline;
  margin: 6px 0;
  text-align: left;
}

:deep(.toc-item a) {
  display: flex;
  align-items: baseline;
  width: 100%;
  color: #333;
  text-decoration: none;
}

:deep(.toc-item a:hover) {
  color: #4b83f0;
}

:deep(.toc-num) {
  flex-shrink: 0;
  min-width: 50px;
}

:deep(.toc-title) {
  flex-shrink: 0;
}

:deep(.toc-dots) {
  flex: 1;
  border-bottom: 1px dotted #999;
  margin: 0 8px;
  min-width: 20px;
  height: 1em;
}

:deep(.toc-page) {
  flex-shrink: 0;
  color: #666;
}

:deep(.toc-level-1) {
  font-weight: 600;
  font-size: 14px;
  margin-top: 12px;
}

:deep(.toc-level-2) {
  padding-left: 24px;
  font-size: 13px;
}

:deep(.toc-level-3) {
  padding-left: 48px;
  font-size: 12px;
  color: #666;
}

/* Heading Styles */
:deep(.document-content h1) {
  font-size: 20px;
  font-weight: 700;
  margin: 32px 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #4b83f0;
  color: #1a1a1a;
}

:deep(.document-content h2) {
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 16px 0;
  padding-left: 12px;
  border-left: 4px solid #4b83f0;
  color: #1a1a1a;
}

:deep(.document-content h3) {
  font-size: 15px;
  font-weight: 600;
  margin: 20px 0 12px 0;
  color: #333;
}

/* Table Styles */
:deep(.document-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 13px;
}

:deep(.document-content table td),
:deep(.document-content table th) {
  border: 1px solid #d0d0d0;
  padding: 10px 12px;
  vertical-align: top;
}

:deep(.document-content table th),
:deep(.document-content thead td) {
  background: #f0f4f8;
  font-weight: 600;
  text-align: center;
}

:deep(.document-content table tr:nth-child(even)) {
  background: #fafbfc;
}

/* Image Styles */
:deep(.document-content img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

/* List Styles */
:deep(.document-content ul),
:deep(.document-content ol) {
  margin: 12px 0;
  padding-left: 2em;
}

:deep(.document-content li) {
  margin-bottom: 6px;
}

/* Strong/Bold Text */
:deep(.document-content strong) {
  font-weight: 600;
  color: #1a1a1a;
}
</style>
