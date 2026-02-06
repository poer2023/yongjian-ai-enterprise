<script setup lang="ts">
import { ref, computed } from 'vue';
import { History, Save, GitCompare, RotateCcw, Clock, User, ChevronDown, ChevronRight, X } from 'lucide-vue-next';
import type { DocVersion, VersionDiff } from '@/mocks/bidDocSkeleton';
import { docVersionsData, versionDiffData } from '@/mocks/bidDocSkeleton';

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save-version', name: string, description: string): void;
  (e: 'rollback', versionId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// State
const activeTab = ref<'history' | 'compare'>('history');
const versions = ref<DocVersion[]>(docVersionsData);
const selectedVersions = ref<string[]>([]);
const showSaveModal = ref(false);
const saveVersionName = ref('');
const saveVersionDesc = ref('');
const expandedDiffs = ref<Set<string>>(new Set());

// Computed
const canCompare = computed(() => selectedVersions.value.length === 2);

const versionDiffs = computed(() => versionDiffData);

// Methods
const toggleVersionSelect = (versionId: string) => {
  const index = selectedVersions.value.indexOf(versionId);
  if (index === -1) {
    if (selectedVersions.value.length < 2) {
      selectedVersions.value.push(versionId);
    }
  } else {
    selectedVersions.value.splice(index, 1);
  }
};

const startCompare = () => {
  if (canCompare.value) {
    activeTab.value = 'compare';
  }
};

const toggleDiffExpand = (sectionId: string) => {
  if (expandedDiffs.value.has(sectionId)) {
    expandedDiffs.value.delete(sectionId);
  } else {
    expandedDiffs.value.add(sectionId);
  }
};

const openSaveModal = () => {
  saveVersionName.value = '';
  saveVersionDesc.value = '';
  showSaveModal.value = true;
};

const handleSaveVersion = () => {
  if (saveVersionName.value.trim()) {
    emit('save-version', saveVersionName.value, saveVersionDesc.value);
    showSaveModal.value = false;
    alert(`版本「${saveVersionName.value}」已保存`);
  }
};

const handleRollback = (versionId: string) => {
  const version = versions.value.find(v => v.id === versionId);
  if (version && confirm(`确定要回滚到版本「${version.name}」吗？当前未保存的修改将丢失。`)) {
    emit('rollback', versionId);
    alert(`已回滚到版本「${version.name}」`);
  }
};

const getChangeTypeClass = (type: string) => {
  return {
    'added': 'change-added',
    'modified': 'change-modified',
    'deleted': 'change-deleted'
  }[type] || '';
};

const getChangeTypeText = (type: string) => {
  return {
    'added': '新增',
    'modified': '修改',
    'deleted': '删除'
  }[type] || '';
};
</script>

<template>
  <div v-if="isOpen" class="version-panel-overlay" @click.self="$emit('close')">
    <div class="version-panel">
      <!-- Header -->
      <div class="panel-header">
        <div class="header-left">
          <History :size="18" />
          <h3>版本管理</h3>
        </div>
        <div class="header-actions">
          <button class="action-btn primary" @click="openSaveModal">
            <Save :size="14" />
            保存版本
          </button>
          <button class="close-btn" @click="$emit('close')">
            <X :size="18" />
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="panel-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          <History :size="14" />
          版本历史
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'compare' }"
          @click="activeTab = 'compare'"
        >
          <GitCompare :size="14" />
          版本对比
        </button>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <div class="compare-hint" v-if="selectedVersions.length > 0">
          已选择 {{ selectedVersions.length }} 个版本
          <button
            class="compare-btn"
            :disabled="!canCompare"
            @click="startCompare"
          >
            <GitCompare :size="14" />
            对比
          </button>
        </div>

        <div class="version-list">
          <div
            v-for="version in versions"
            :key="version.id"
            class="version-item"
            :class="{
              'is-current': version.id === 'v5',
              'is-auto': version.isAuto,
              'is-selected': selectedVersions.includes(version.id)
            }"
          >
            <div class="version-checkbox">
              <input
                type="checkbox"
                :checked="selectedVersions.includes(version.id)"
                @change="toggleVersionSelect(version.id)"
              />
            </div>
            <div class="version-info">
              <div class="version-header">
                <span class="version-tag">{{ version.version }}</span>
                <span class="version-name">{{ version.name }}</span>
                <span v-if="version.id === 'v5'" class="current-badge">当前</span>
                <span v-if="version.isAuto" class="auto-badge">自动</span>
              </div>
              <div class="version-meta">
                <span class="meta-item">
                  <Clock :size="12" />
                  {{ version.createTime }}
                </span>
                <span class="meta-item">
                  <User :size="12" />
                  {{ version.author }}
                </span>
              </div>
              <div class="version-desc">{{ version.description }}</div>
              <div class="version-changes">{{ version.changesSummary }}</div>
            </div>
            <div class="version-actions" v-if="version.id !== 'v5'">
              <button class="rollback-btn" @click="handleRollback(version.id)">
                <RotateCcw :size="14" />
                回滚
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Compare Tab -->
      <div v-if="activeTab === 'compare'" class="tab-content">
        <div class="compare-header">
          <div class="compare-versions">
            <span class="compare-label">V1.3</span>
            <span class="compare-arrow">→</span>
            <span class="compare-label">V1.4（当前）</span>
          </div>
          <div class="compare-stats">
            共 {{ versionDiffs.length }} 处变更
          </div>
        </div>

        <div class="diff-list">
          <div
            v-for="diff in versionDiffs"
            :key="diff.sectionId"
            class="diff-item"
            :class="getChangeTypeClass(diff.changeType)"
          >
            <div class="diff-header" @click="toggleDiffExpand(diff.sectionId)">
              <component
                :is="expandedDiffs.has(diff.sectionId) ? ChevronDown : ChevronRight"
                :size="14"
              />
              <span class="diff-type-tag">{{ getChangeTypeText(diff.changeType) }}</span>
              <span class="diff-section">{{ diff.sectionTitle }}</span>
            </div>
            <div v-if="expandedDiffs.has(diff.sectionId)" class="diff-content">
              <div v-if="diff.oldContent" class="diff-old">
                <div class="diff-label">原内容：</div>
                <div class="diff-text">{{ diff.oldContent }}</div>
              </div>
              <div v-if="diff.newContent" class="diff-new">
                <div class="diff-label">新内容：</div>
                <div class="diff-text">{{ diff.newContent }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Version Modal -->
      <div v-if="showSaveModal" class="save-modal-overlay" @click.self="showSaveModal = false">
        <div class="save-modal">
          <div class="modal-header">
            <h4>保存新版本</h4>
            <button class="modal-close" @click="showSaveModal = false">
              <X :size="16" />
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>版本名称 <span class="required">*</span></label>
              <input
                v-model="saveVersionName"
                type="text"
                placeholder="例如：技术方案优化版"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>版本说明</label>
              <textarea
                v-model="saveVersionDesc"
                placeholder="描述本次修改的主要内容..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showSaveModal = false">取消</button>
            <button
              class="modal-btn primary"
              :disabled="!saveVersionName.trim()"
              @click="handleSaveVersion"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.version-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.version-panel {
  width: 480px;
  max-width: 90vw;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf1;
  background: #f8fafc;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #4b83f0;
  color: white;
}

.action-btn.primary:hover {
  background: #3b73e0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e8ecf1;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f8fafc;
  color: #4b83f0;
}

.tab-btn.active {
  color: #4b83f0;
  border-bottom-color: #4b83f0;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.compare-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #eff6ff;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #3b82f6;
}

.compare-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.compare-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.version-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.version-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;
}

.version-item:hover {
  border-color: #cbd5e1;
}

.version-item.is-current {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.version-item.is-selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.version-checkbox {
  padding-top: 2px;
}

.version-checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.version-info {
  flex: 1;
  min-width: 0;
}

.version-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.version-tag {
  padding: 2px 8px;
  background: #334155;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.version-name {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.current-badge {
  padding: 2px 6px;
  background: #22c55e;
  color: white;
  border-radius: 4px;
  font-size: 10px;
}

.auto-badge {
  padding: 2px 6px;
  background: #94a3b8;
  color: white;
  border-radius: 4px;
  font-size: 10px;
}

.version-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.version-desc {
  font-size: 13px;
  color: #475569;
  margin-bottom: 4px;
}

.version-changes {
  font-size: 12px;
  color: #94a3b8;
}

.version-actions {
  display: flex;
  align-items: flex-start;
}

.rollback-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.rollback-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  background: #fffbeb;
}

/* Compare Tab Styles */
.compare-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #f1f5f9;
  border-radius: 8px;
  margin-bottom: 16px;
}

.compare-versions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compare-label {
  padding: 4px 10px;
  background: #334155;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.compare-arrow {
  color: #64748b;
}

.compare-stats {
  font-size: 13px;
  color: #64748b;
}

.diff-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.diff-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.diff-item.change-added {
  border-left: 3px solid #22c55e;
}

.diff-item.change-modified {
  border-left: 3px solid #3b82f6;
}

.diff-item.change-deleted {
  border-left: 3px solid #ef4444;
}

.diff-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: background 0.2s;
}

.diff-header:hover {
  background: #f1f5f9;
}

.diff-type-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.change-added .diff-type-tag {
  background: #dcfce7;
  color: #16a34a;
}

.change-modified .diff-type-tag {
  background: #dbeafe;
  color: #2563eb;
}

.change-deleted .diff-type-tag {
  background: #fee2e2;
  color: #dc2626;
}

.diff-section {
  font-size: 13px;
  color: #334155;
}

.diff-content {
  padding: 12px;
  border-top: 1px solid #e2e8f0;
}

.diff-old, .diff-new {
  margin-bottom: 10px;
}

.diff-old:last-child, .diff-new:last-child {
  margin-bottom: 0;
}

.diff-label {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

.diff-old .diff-label {
  color: #dc2626;
}

.diff-new .diff-label {
  color: #16a34a;
}

.diff-text {
  font-size: 12px;
  color: #475569;
  background: #f8fafc;
  padding: 8px 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  line-height: 1.5;
}

.diff-old .diff-text {
  background: #fef2f2;
}

.diff-new .diff-text {
  background: #f0fdf4;
}

/* Save Modal */
.save-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.save-modal {
  width: 400px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf1;
}

.modal-header h4 {
  margin: 0;
  font-size: 16px;
  color: #334155;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 4px;
}

.modal-close:hover {
  background: #f1f5f9;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.form-group .required {
  color: #ef4444;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4b83f0;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e8ecf1;
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.secondary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.modal-btn.secondary:hover {
  background: #f8fafc;
}

.modal-btn.primary {
  background: #4b83f0;
  border: none;
  color: white;
}

.modal-btn.primary:hover {
  background: #3b73e0;
}

.modal-btn.primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>
