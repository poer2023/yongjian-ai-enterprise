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
import { Toast } from '../shared';
import { contractContent as initialContract, differences as initialDiffs } from './mockData';
import type { Difference, HistoryState, DiffLevel } from './types';

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

// Reactive data from mock
const contractContent = ref(JSON.parse(JSON.stringify(initialContract)));
const differences = ref<Difference[]>(JSON.parse(JSON.stringify(initialDiffs)));

// History stack for undo/redo
const historyStack = ref<HistoryState[]>([]);
const historyIndex = ref(-1);

const saveHistory = () => {
  const snapshot: HistoryState = {
    differences: JSON.parse(JSON.stringify(differences.value)),
    clauseContents: {}
  };
  contractContent.value.clauses.forEach((c: { id: string; content: string }) => {
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
  differences.value = JSON.parse(JSON.stringify(state.differences));
  contractContent.value.clauses.forEach((c: { id: string; content: string }) => {
    const content = state.clauseContents[c.id];
    if (content !== undefined) {
      c.content = content;
    }
  });
};

saveHistory();

// Computed stats
const stats = computed(() => ({
  total: differences.value.length,
  pending: differences.value.filter(m => m.status === 'pending').length,
  accepted: differences.value.filter(m => m.status === 'accepted').length,
  rejected: differences.value.filter(m => m.status === 'rejected').length,
  highRisk: differences.value.filter(m => m.diffLevel === 'high').length
}));

const getClauseDifferences = (clauseId: string) => {
  return differences.value.filter(m => m.clauseId === clauseId);
};

const hasDifferences = (clauseId: string) => {
  return differences.value.some(m => m.clauseId === clauseId);
};

const hasPendingDifferences = (clauseId: string) => {
  return differences.value.some(m => m.clauseId === clauseId && m.status === 'pending');
};

const getClauseTitle = (clauseId: string) => {
  return contractContent.value.clauses.find((c: { id: string; title: string }) => c.id === clauseId)?.title || '';
};

// Helpers
const getRiskClass = (level: DiffLevel) => ({
  'risk-high': level === 'high',
  'risk-medium': level === 'medium',
  'risk-low': level === 'low'
});

// Panel ref
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
  const mod = differences.value.find(m => m.id === modId);
  if (mod) {
    const wasExpanded = mod.expanded;
    mod.expanded = !mod.expanded;
    if (!wasExpanded) {
      scrollToHighlight(modId);
    }
  }
};

const handleCardHeaderClick = (modId: string) => {
  const mod = differences.value.find(m => m.id === modId);
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
  differences.value.forEach(m => {
    m.expanded = m.id === modId;
  });
  scrollToHighlight(modId);
};

const acceptDifference = (modId: string) => {
  const mod = differences.value.find(m => m.id === modId);
  if (mod) {
    const clause = contractContent.value.clauses.find((c: { id: string; content: string }) => c.id === mod.clauseId);
    if (clause) {
      clause.content = clause.content.replace(mod.baseText, mod.compareText);
    }

    mod.status = 'accepted';
    mod.expanded = false;
    saveHistory();
    const next = differences.value.find(m => m.status === 'pending');
    if (next) next.expanded = true;
  }
};

const rejectDifference = (modId: string) => {
  const mod = differences.value.find(m => m.id === modId);
  if (mod) {
    mod.status = 'rejected';
    mod.expanded = false;
    saveHistory();
    const next = differences.value.find(m => m.status === 'pending');
    if (next) next.expanded = true;
  }
};

const acceptAll = () => {
  differences.value.forEach(mod => {
    if (mod.status === 'pending') {
      const clause = contractContent.value.clauses.find((c: { id: string; content: string }) => c.id === mod.clauseId);
      if (clause) {
        clause.content = clause.content.replace(mod.baseText, mod.compareText);
      }
      mod.status = 'accepted';
      mod.expanded = false;
    }
  });
  saveHistory();
};

const rejectAll = () => {
  differences.value.forEach(m => {
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

// Convert to ComparePanel format
const panelItems = computed<CompareItem[]>(() => {
  return differences.value.map(diff => ({
    id: diff.id,
    clauseId: diff.clauseId,
    clauseTitle: getClauseTitle(diff.clauseId),
    baseText: diff.baseText,
    compareText: diff.compareText,
    reason: diff.diffNote,
    riskLevel: diff.diffLevel,
    status: diff.status,
    expanded: diff.expanded
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
          <span class="header-badge">合同对比</span>
          <h1 class="page-title">{{ contractContent.title }}</h1>
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
                <h1 class="contract-title">{{ contractContent.title }}</h1>
                <p class="contract-no">合同编号：{{ contractContent.contractNo }}</p>
              </div>

              <div class="parties-section">
                <div class="party">
                  <div class="party-label">甲方（委托方）：</div>
                  <div class="party-info">
                    <p><strong>{{ contractContent.partyA.name }}</strong></p>
                    <p>地址：{{ contractContent.partyA.address }}</p>
                    <p>法定代表人：{{ contractContent.partyA.legalRep }}</p>
                    <p>联系电话：{{ contractContent.partyA.contact }}</p>
                  </div>
                </div>
                <div class="party">
                  <div class="party-label">乙方（受托方）：</div>
                  <div class="party-info">
                    <p><strong>{{ contractContent.partyB.name }}</strong></p>
                    <p>地址：{{ contractContent.partyB.address }}</p>
                    <p>法定代表人：{{ contractContent.partyB.legalRep }}</p>
                    <p>联系电话：{{ contractContent.partyB.contact }}</p>
                  </div>
                </div>
              </div>

              <p class="contract-intro">
                甲、乙双方经友好协商，就甲方委托乙方进行软件开发事宜，达成如下协议：
              </p>

              <!-- First 2 clauses on page 1 -->
              <div
                v-for="clause in contractContent.clauses.slice(0, 2)"
                :key="clause.id"
                class="contract-clause"
                :class="{
                  'has-issues': hasDifferences(clause.id),
                  'has-pending': hasPendingDifferences(clause.id)
                }"
              >
                <h3 class="clause-title">
                  {{ clause.title }}
                </h3>
                <div class="clause-content">
                  <template v-for="(mod, idx) in getClauseDifferences(clause.id)" :key="mod.id">
                    <div
                      v-if="mod.status === 'pending'"
                      :id="`highlight-${mod.id}`"
                      class="highlight-block"
                      :class="[getRiskClass(mod.diffLevel)]"
                      @click="expandCard(mod.id)"
                    >
                      <div class="highlight-marker">
                        <span class="marker-dot"></span>
                        <span class="marker-label">差异对比 {{ idx + 1 }}</span>
                      </div>
                      <div class="diff-content">
                        <div v-if="mod.baseText" class="diff-line del">{{ mod.baseText }}</div>
                        <div v-if="mod.compareText" class="diff-line add">{{ mod.compareText }}</div>
                      </div>
                    </div>
                    <span
                      v-else
                      :id="`highlight-${mod.id}`"
                      class="modification-anchor"
                      :class="{ 'status-accepted': mod.status === 'accepted', 'status-rejected': mod.status === 'rejected' }"
                    >{{ mod.status === 'accepted' ? mod.compareText : mod.baseText }}</span>
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
                v-for="clause in contractContent.clauses.slice(2, 4)"
                :key="clause.id"
                class="contract-clause"
                :class="{
                  'has-issues': hasDifferences(clause.id),
                  'has-pending': hasPendingDifferences(clause.id)
                }"
              >
                <h3 class="clause-title">
                  {{ clause.title }}
                </h3>
                <div class="clause-content">
                  <template v-for="(mod, idx) in getClauseDifferences(clause.id)" :key="mod.id">
                    <div
                      v-if="mod.status === 'pending'"
                      :id="`highlight-${mod.id}`"
                      class="highlight-block"
                      :class="[getRiskClass(mod.diffLevel)]"
                      @click="expandCard(mod.id)"
                    >
                      <div class="highlight-marker">
                        <span class="marker-dot"></span>
                        <span class="marker-label">差异对比 {{ idx + 1 }}</span>
                      </div>
                      <div class="diff-content">
                        <div v-if="mod.baseText" class="diff-line del">{{ mod.baseText }}</div>
                        <div v-if="mod.compareText" class="diff-line add">{{ mod.compareText }}</div>
                      </div>
                    </div>
                    <span
                      v-else
                      :id="`highlight-${mod.id}`"
                      class="modification-anchor"
                      :class="{ 'status-accepted': mod.status === 'accepted', 'status-rejected': mod.status === 'rejected' }"
                    >{{ mod.status === 'accepted' ? mod.compareText : mod.baseText }}</span>
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
                v-for="clause in contractContent.clauses.slice(4)"
                :key="clause.id"
                class="contract-clause"
                :class="{
                  'has-issues': hasDifferences(clause.id),
                  'has-pending': hasPendingDifferences(clause.id)
                }"
              >
                <h3 class="clause-title">
                  {{ clause.title }}
                </h3>
                <div class="clause-content">
                  <template v-for="(mod, idx) in getClauseDifferences(clause.id)" :key="mod.id">
                    <div
                      v-if="mod.status === 'pending'"
                      :id="`highlight-${mod.id}`"
                      class="highlight-block"
                      :class="[getRiskClass(mod.diffLevel)]"
                      @click="expandCard(mod.id)"
                    >
                      <div class="highlight-marker">
                        <span class="marker-dot"></span>
                        <span class="marker-label">差异对比 {{ idx + 1 }}</span>
                      </div>
                      <div class="diff-content">
                        <div v-if="mod.baseText" class="diff-line del">{{ mod.baseText }}</div>
                        <div v-if="mod.compareText" class="diff-line add">{{ mod.compareText }}</div>
                      </div>
                    </div>
                    <span
                      v-else
                      :id="`highlight-${mod.id}`"
                      class="modification-anchor"
                      :class="{ 'status-accepted': mod.status === 'accepted', 'status-rejected': mod.status === 'rejected' }"
                    >{{ mod.status === 'accepted' ? mod.compareText : mod.baseText }}</span>
                  </template>
                  <pre class="clause-text">{{ clause.content }}</pre>
                </div>
              </div>

              <!-- Signature Section -->
              <div class="signature-section">
                <div class="sign-row">
                  <div class="sign-box">
                    <p>甲方（盖章）：</p>
                    <p class="sign-line"></p>
                    <p>法定代表人（签字）：</p>
                    <p class="sign-line"></p>
                    <p>日期：{{ contractContent.signDate }}</p>
                  </div>
                  <div class="sign-box">
                    <p>乙方（盖章）：</p>
                    <p class="sign-line"></p>
                    <p>法定代表人（签字）：</p>
                    <p class="sign-line"></p>
                    <p>日期：{{ contractContent.signDate }}</p>
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

      <!-- Right: Difference Cards Panel -->
      <ComparePanel
        ref="comparePanelRef"
        :items="panelItems"
        panel-title="差异对比"
        theme="red-green"
        @accept="acceptDifference"
        @reject="rejectDifference"
        @accept-all="acceptAll"
        @reject-all="rejectAll"
        @toggle-expand="toggleExpand"
        @card-click="handleCardHeaderClick"
      />
    </div>
  </div>

  <!-- Toast -->
  <Toast :message="toastMessage" :visible="showToast" type="warning" />
</template>

<style scoped>
@import './styles.css';
</style>
