<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import {
  ChevronLeft,
  AlertTriangle,
  Download,
  Clock,
  RotateCcw,
  RotateCw,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  Image as ImageIcon,
  Zap
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import ComparePanel from '../ComparePanel.vue';
import type { CompareItem } from '../ComparePanel.vue';
import type { Modification, DocumentContent, HistoryState, RiskLevel } from './types';
import { mockDocumentContent, mockModifications } from './mockData';

const router = useRouter();

// ComparePanel ref
const comparePanelRef = ref<InstanceType<typeof ComparePanel> | null>(null);

// Toast state
const toastMessage = ref('');
const showToast = ref(false);

const displayToast = (message: string, duration = 3000) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, duration);
};

// Document content and modifications
const documentContent = ref<DocumentContent>(JSON.parse(JSON.stringify(mockDocumentContent)));
const modifications = ref<Modification[]>(JSON.parse(JSON.stringify(mockModifications)));

// History state
const historyStack = ref<HistoryState[]>([]);
const historyIndex = ref(-1);

const saveHistory = () => {
  const snapshot: HistoryState = {
    modifications: JSON.parse(JSON.stringify(modifications.value)),
    clauseContents: {}
  };
  documentContent.value.clauses.forEach(c => {
    snapshot.clauseContents[c.id] = c.content;
  });

  if (historyIndex.value < historyStack.value.length - 1) {
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
  }
  historyStack.value.push(snapshot);
  historyIndex.value++;
};

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < historyStack.value.length - 1);

const undo = () => {
  if (!canUndo.value) return;
  historyIndex.value--;
  const state = historyStack.value[historyIndex.value];
  if (state) restoreState(state);
};

const redo = () => {
  if (!canRedo.value) return;
  historyIndex.value++;
  const state = historyStack.value[historyIndex.value];
  if (state) restoreState(state);
};

const restoreState = (state: HistoryState) => {
  modifications.value = JSON.parse(JSON.stringify(state.modifications));
  documentContent.value.clauses.forEach(c => {
    const content = state.clauseContents[c.id];
    if (content !== undefined) {
      c.content = content;
    }
  });
};

saveHistory();

// Computed
const getClauseModifications = (clauseId: string) => {
  return modifications.value.filter(m => m.clauseId === clauseId);
};

const hasModifications = (clauseId: string) => {
  return modifications.value.some(m => m.clauseId === clauseId);
};

const hasPendingModifications = (clauseId: string) => {
  return modifications.value.some(m => m.clauseId === clauseId && m.status === 'pending');
};

// Contract panel ref
const contractPanelRef = ref<HTMLElement | null>(null);

const scrollToHighlight = (modId: string) => {
  nextTick(() => {
    const highlightEl = document.getElementById(`highlight-${modId}`);
    if (highlightEl && contractPanelRef.value) {
      const containerRect = contractPanelRef.value.getBoundingClientRect();
      const elementRect = highlightEl.getBoundingClientRect();
      const scrollTop = contractPanelRef.value.scrollTop + elementRect.top - containerRect.top - 100;

      contractPanelRef.value.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });

      highlightEl.classList.add('flash');
      setTimeout(() => {
        highlightEl.classList.remove('flash');
      }, 1500);
    }
  });
};

const toggleExpand = (modId: string) => {
  const mod = modifications.value.find(m => m.id === modId);
  if (mod) {
    const wasExpanded = mod.expanded;
    mod.expanded = !mod.expanded;
    if (!wasExpanded) {
      scrollToHighlight(modId);
    }
  }
};

const handleCardHeaderClick = (modId: string) => {
  const mod = modifications.value.find(m => m.id === modId);
  if (!mod) return;

  const anchor = document.getElementById(`highlight-${modId}`);
  if (!anchor) {
    displayToast('该内容位置可能已被手动修改，无法精确定位');
    return;
  }

  if (mod.status === 'pending') {
    toggleExpand(modId);
  } else {
    scrollToHighlight(modId);
  }
};

const expandCard = (modId: string) => {
  modifications.value.forEach(m => {
    m.expanded = m.id === modId;
  });
  scrollToHighlight(modId);
};

const acceptModification = (modId: string) => {
  const mod = modifications.value.find(m => m.id === modId);
  if (mod) {
    const clause = documentContent.value.clauses.find(c => c.id === mod.clauseId);
    if (clause) {
      clause.content = clause.content.replace(mod.originalText, mod.suggestedText);
    }

    mod.status = 'accepted';
    mod.expanded = false;
    saveHistory();
    const next = modifications.value.find(m => m.status === 'pending');
    if (next) next.expanded = true;
  }
};

const rejectModification = (modId: string) => {
  const mod = modifications.value.find(m => m.id === modId);
  if (mod) {
    mod.status = 'rejected';
    mod.expanded = false;
    saveHistory();
    const next = modifications.value.find(m => m.status === 'pending');
    if (next) next.expanded = true;
  }
};

const acceptAll = () => {
  modifications.value.forEach(mod => {
    if (mod.status === 'pending') {
      const clause = documentContent.value.clauses.find(c => c.id === mod.clauseId);
      if (clause) {
        clause.content = clause.content.replace(mod.originalText, mod.suggestedText);
      }
      mod.status = 'accepted';
      mod.expanded = false;
    }
  });
  saveHistory();
};

const rejectAll = () => {
  modifications.value.forEach(m => {
    if (m.status === 'pending') {
      m.status = 'rejected';
      m.expanded = false;
    }
  });
  saveHistory();
};

const goBack = () => {
  router.back();
};

const exportResult = () => {
  alert('导出功能开发中...');
};

const addToKnowledgeBase = () => {
  alert('加入知识库功能开发中...');
};

// Helpers
const getRiskClass = (level: RiskLevel) => ({
  'risk-high': level === 'high',
  'risk-medium': level === 'medium',
  'risk-low': level === 'low'
});

const getClauseTitle = (clauseId: string) => {
  return documentContent.value.clauses.find(c => c.id === clauseId)?.title || '';
};

// Convert to ComparePanel format
const panelItems = computed((): CompareItem[] => {
  return modifications.value.map(m => ({
    id: m.id,
    clauseId: m.clauseId,
    clauseTitle: getClauseTitle(m.clauseId),
    baseText: m.originalText,
    compareText: m.suggestedText,
    reason: m.reason,
    riskLevel: m.riskLevel,
    status: m.status,
    expanded: m.expanded
  }));
});
</script>

<template>
  <div class="contract-review-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <button class="back-circle-btn" @click="goBack">
          <ChevronLeft :size="20" />
        </button>

        <div class="header-info-group">
          <span class="header-badge">文档纠错</span>
          <h1 class="page-title">{{ documentContent.title }}</h1>
          <span class="save-status">已保存</span>

          <div class="history-controls">
            <button class="tool-btn icon-only" title="历史记录">
              <Clock :size="16" />
            </button>
            <button
              class="tool-btn icon-only"
              :class="{ disabled: !canUndo }"
              :disabled="!canUndo"
              @click="undo"
              title="撤销"
            >
              <RotateCcw :size="16" />
            </button>
            <button
              class="tool-btn icon-only"
              :class="{ disabled: !canRedo }"
              :disabled="!canRedo"
              @click="redo"
              title="重做"
            >
              <RotateCw :size="16" />
            </button>
          </div>
        </div>
      </div>

      <div class="header-center">
        <div class="editor-toolbar">
          <button class="tool-btn icon-only"><Type :size="16" /></button>
          <div class="divider-v"></div>
          <button class="tool-btn icon-only"><Heading1 :size="16" /></button>
          <button class="tool-btn icon-only"><Heading2 :size="16" /></button>
          <button class="tool-btn icon-only"><Heading3 :size="16" /></button>
          <div class="divider-v"></div>
          <button class="tool-btn icon-only"><Bold :size="16" /></button>
          <button class="tool-btn icon-only"><Italic :size="16" /></button>
          <button class="tool-btn icon-only"><Underline :size="16" /></button>
          <div class="divider-v"></div>
          <button class="tool-btn icon-only"><AlignLeft :size="16" /></button>
          <button class="tool-btn icon-only"><ImageIcon :size="16" /></button>
        </div>
      </div>

      <div class="header-right">
        <button class="action-btn-primary" @click="exportResult">
          <Download :size="16" />
          导出Word
        </button>
        <button class="action-btn-secondary" @click="addToKnowledgeBase">
          <Zap :size="16" />
          加入知识库
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Left: Document -->
      <div class="contract-panel" ref="contractPanelRef">
        <div class="pages-container">
          <!-- Page 1 -->
          <div class="doc-page">
            <div class="page-content">
              <div class="contract-header">
                <h1 class="contract-title">{{ documentContent.title }}</h1>
                <p class="contract-no">文号：{{ documentContent.docNo }}</p>
              </div>

              <div class="parties-section">
                <div class="party">
                  <div class="party-label">致：</div>
                  <div class="party-info">
                    <p><strong>{{ documentContent.recipient.name }}</strong></p>
                    <p>地址：{{ documentContent.recipient.address }}</p>
                  </div>
                </div>
                <div class="party">
                  <div class="party-label">发函人：</div>
                  <div class="party-info">
                    <p><strong>{{ documentContent.sender.name }}</strong></p>
                    <p>承办律师：{{ documentContent.sender.lawyer }}</p>
                    <p>地址：{{ documentContent.sender.address }}</p>
                    <p>联系电话：{{ documentContent.sender.phone }}</p>
                  </div>
                </div>
              </div>

              <p class="contract-intro">&nbsp;</p>

              <!-- First 2 clauses -->
              <div
                v-for="clause in documentContent.clauses.slice(0, 2)"
                :key="clause.id"
                class="contract-clause"
                :class="{
                  'has-issues': hasModifications(clause.id),
                  'has-pending': hasPendingModifications(clause.id)
                }"
              >
                <h3 class="clause-title">{{ clause.title }}</h3>
                <div class="clause-content">
                  <template v-for="(mod, idx) in getClauseModifications(clause.id)" :key="mod.id">
                    <div
                      v-if="mod.status === 'pending'"
                      :id="`highlight-${mod.id}`"
                      class="highlight-block"
                      :class="[getRiskClass(mod.riskLevel)]"
                      @click="expandCard(mod.id)"
                    >
                      <div class="highlight-marker">
                        <span class="marker-dot"></span>
                        <span class="marker-label">修改建议 {{ idx + 1 }}</span>
                      </div>
                      <div class="diff-content">
                        <div v-if="mod.originalText" class="diff-line del">{{ mod.originalText }}</div>
                        <div v-if="mod.suggestedText" class="diff-line add">{{ mod.suggestedText }}</div>
                      </div>
                    </div>
                    <span
                      v-else
                      :id="`highlight-${mod.id}`"
                      class="modification-anchor"
                      :class="{ 'status-accepted': mod.status === 'accepted', 'status-rejected': mod.status === 'rejected' }"
                    >{{ mod.status === 'accepted' ? mod.suggestedText : mod.originalText }}</span>
                  </template>
                  <pre class="clause-text">{{ clause.content }}</pre>
                </div>
              </div>
            </div>
            <div class="page-footer">
              <span class="page-number">第 1 页</span>
            </div>
          </div>

          <!-- Page 2 -->
          <div class="doc-page">
            <div class="page-content">
              <div
                v-for="clause in documentContent.clauses.slice(2, 4)"
                :key="clause.id"
                class="contract-clause"
                :class="{
                  'has-issues': hasModifications(clause.id),
                  'has-pending': hasPendingModifications(clause.id)
                }"
              >
                <h3 class="clause-title">{{ clause.title }}</h3>
                <div class="clause-content">
                  <template v-for="(mod, idx) in getClauseModifications(clause.id)" :key="mod.id">
                    <div
                      v-if="mod.status === 'pending'"
                      :id="`highlight-${mod.id}`"
                      class="highlight-block"
                      :class="[getRiskClass(mod.riskLevel)]"
                      @click="expandCard(mod.id)"
                    >
                      <div class="highlight-marker">
                        <span class="marker-dot"></span>
                        <span class="marker-label">修改建议 {{ idx + 1 }}</span>
                      </div>
                      <div class="diff-content">
                        <div v-if="mod.originalText" class="diff-line del">{{ mod.originalText }}</div>
                        <div v-if="mod.suggestedText" class="diff-line add">{{ mod.suggestedText }}</div>
                      </div>
                    </div>
                    <span
                      v-else
                      :id="`highlight-${mod.id}`"
                      class="modification-anchor"
                      :class="{ 'status-accepted': mod.status === 'accepted', 'status-rejected': mod.status === 'rejected' }"
                    >{{ mod.status === 'accepted' ? mod.suggestedText : mod.originalText }}</span>
                  </template>
                  <pre class="clause-text">{{ clause.content }}</pre>
                </div>
              </div>

              <!-- Signature Section -->
              <div class="signature-section">
                <div class="sign-row single">
                  <div class="sign-box">
                    <p>发函律师（签章）：</p>
                    <p class="sign-line"></p>
                    <p>{{ documentContent.createDate }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="page-footer">
              <span class="page-number">第 2 页</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Modification Cards Panel -->
      <ComparePanel
        ref="comparePanelRef"
        :items="panelItems"
        panel-title="纠错建议"
        theme="red-green"
        :labels="{
          reviewTabLabel: 'AI 纠错',
          baseLabel: '原文内容',
          compareLabel: '纠正后',
          reasonTitle: '错误说明',
          keepBtn: '忽略',
          adoptBtn: '纠正',
          keepAllBtn: '全部忽略',
          adoptAllBtn: '全部纠正',
          keptStatus: '已忽略此错误',
          adoptedStatus: '已纠正此错误'
        }"
        @accept="acceptModification"
        @reject="rejectModification"
        @accept-all="acceptAll"
        @reject-all="rejectAll"
        @toggle-expand="toggleExpand"
        @card-click="handleCardHeaderClick"
      />
    </div>
  </div>

  <!-- Toast -->
  <Transition name="toast">
    <div v-if="showToast" class="toast-container">
      <div class="toast-message">
        <AlertTriangle :size="18" />
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.contract-review-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
}

.page-header {
  height: 56px;
  background: linear-gradient(90deg, #e0e7ff 0%, #eff6ff 50%, #e0e7ff 100%);
  border-bottom: 1px solid #c7d2fe;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.back-circle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.back-circle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-info-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-badge {
  background: white;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
}

.page-title {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.save-status {
  font-size: 12px;
  color: #94a3b8;
  margin-left: 4px;
}

.history-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px solid #cbd5e1;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tool-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
}

.tool-btn:hover:not(:disabled) {
  background: rgba(0,0,0,0.05);
  color: #1e293b;
}

.tool-btn:disabled,
.tool-btn.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.divider-v {
  width: 1px;
  height: 16px;
  background: #cbd5e1;
  margin: 0 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}

.action-btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
}

.action-btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.action-btn-secondary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: white;
  color: #1e293b;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.action-btn-secondary:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.contract-panel {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  background: #e5e7eb;
}

.pages-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.doc-page {
  width: 720px;
  min-height: 1018px;
  background: white;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-content {
  flex: 1;
  padding: 56px 64px 40px 64px;
  overflow: hidden;
}

.page-footer {
  padding: 16px 64px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
}

.page-number {
  font-size: 12px;
  color: #94a3b8;
}

.contract-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #1e293b;
}

.contract-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: 4px;
}

.contract-no {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.parties-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}

.party-label {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.party-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}

.contract-intro {
  font-size: 14px;
  color: #475569;
  margin-bottom: 32px;
  text-indent: 2em;
  line-height: 1.8;
}

.contract-clause {
  margin-bottom: 28px;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.clause-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.clause-text {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.9;
  color: #475569;
  white-space: pre-wrap;
  margin: 0;
}

.highlight-block {
  margin: 12px 0;
  padding: 0;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.highlight-marker {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.highlight-block.risk-high .marker-dot { background: #dc2626; }
.highlight-block.risk-medium .marker-dot { background: #d97706; }
.highlight-block.risk-low .marker-dot { background: #16a34a; }

.marker-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

.diff-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.diff-line {
  font-size: 14px;
  line-height: 1.6;
  padding: 4px 8px;
  border-radius: 4px;
}

.diff-line.del {
  background-color: #fee2e2;
  color: #b91c1c;
  text-decoration: line-through;
  text-decoration-color: rgba(185, 28, 28, 0.4);
}

.diff-line.add {
  background-color: #dcfce7;
  color: #15803d;
}

@keyframes flash-highlight {
  0%, 100% { box-shadow: none; }
  25%, 75% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.5); }
}

.highlight-block.flash {
  animation: flash-highlight 2.5s ease-out;
}

.modification-anchor {
  display: inline;
  position: relative;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.modification-anchor.status-rejected {
  text-decoration: line-through;
  text-decoration-color: #94a3b8;
  color: #94a3b8;
}

.modification-anchor.flash {
  animation: anchor-flash 2s ease-out;
}

@keyframes anchor-flash {
  0% { background-color: transparent; }
  20%, 60% { background-color: rgba(37, 99, 235, 0.2); }
  100% { background-color: transparent; }
}

.signature-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
}

.sign-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.sign-box p {
  font-size: 14px;
  color: #475569;
  margin: 8px 0;
}

.sign-line {
  border-bottom: 1px solid #1e293b;
  margin: 16px 0;
}

.toast-container {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.toast-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: #1e293b;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.toast-message svg {
  color: #fbbf24;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
