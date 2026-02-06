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
import type { Modification, DocumentContent, HistoryState, RiskLevel, ChangeStatus } from './types';
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
          <span class="header-badge">文书审查</span>
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
      <!-- Left: Contract Document -->
      <div class="contract-panel" ref="contractPanelRef">
        <div class="pages-container">
          <!-- Page 1: Title & Parties -->
          <div class="doc-page">
            <div class="page-content">
              <div class="contract-header">
                <h1 class="contract-title">{{ documentContent.title }}</h1>
                <p class="contract-no">案号：{{ documentContent.caseNo }}</p>
              </div>

              <div class="parties-section">
                <div class="party">
                  <div class="party-label">原告：</div>
                  <div class="party-info">
                    <p><strong>{{ documentContent.plaintiff.name }}</strong></p>
                    <p>性别：{{ documentContent.plaintiff.gender }}，民族：{{ documentContent.plaintiff.nationality }}</p>
                    <p>出生日期：{{ documentContent.plaintiff.birthDate }}</p>
                    <p>身份证号：{{ documentContent.plaintiff.idNumber }}</p>
                    <p>住址：{{ documentContent.plaintiff.address }}</p>
                    <p>联系电话：{{ documentContent.plaintiff.phone }}</p>
                  </div>
                </div>
                <div class="party">
                  <div class="party-label">被告：</div>
                  <div class="party-info">
                    <p><strong>{{ documentContent.defendant.name }}</strong></p>
                    <p>法定代表人：{{ documentContent.defendant.legalRep }}（{{ documentContent.defendant.position }}）</p>
                    <p>住所地：{{ documentContent.defendant.address }}</p>
                    <p>联系电话：{{ documentContent.defendant.phone }}</p>
                  </div>
                </div>
              </div>

              <p class="contract-intro">&nbsp;</p>

              <!-- First 2 clauses on page 1 -->
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

          <!-- Page 2: Clauses 3-4 -->
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
            </div>
            <div class="page-footer">
              <span class="page-number">第 2 页</span>
            </div>
          </div>

          <!-- Page 3: Remaining clauses & Signature -->
          <div class="doc-page">
            <div class="page-content">
              <div
                v-for="clause in documentContent.clauses.slice(4)"
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
                    <p>起诉人（签名/捺印）：</p>
                    <p class="sign-line"></p>
                    <p>{{ documentContent.createDate }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="page-footer">
              <span class="page-number">第 3 页</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Modification Cards Panel -->
      <ComparePanel
        ref="comparePanelRef"
        :items="panelItems"
        panel-title="修改建议"
        :labels="{
          reviewTabLabel: 'AI 审查',
          baseLabel: '原文内容',
          compareLabel: '建议修改为',
          reasonTitle: '修改理由',
          keepBtn: '拒绝',
          adoptBtn: '接受',
          keepAllBtn: '全部拒绝',
          adoptAllBtn: '全部接受',
          keptStatus: '已拒绝此修改',
          adoptedStatus: '已接受此修改'
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
@import './styles.css';
</style>
