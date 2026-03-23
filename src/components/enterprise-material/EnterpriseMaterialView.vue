<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Upload,
  ScanSearch,
  GitBranch,
  Tags,
  ArrowRight,
  AlertTriangle,
  Clock,
  CalendarClock,
  ChevronRight,
  ShieldAlert,
  Files,
  FolderOpen
} from 'lucide-vue-next';
import SourceFileList from './SourceFileList.vue';
import FilePreviewPanel from './FilePreviewPanel.vue';
import MaterialList from './MaterialList.vue';
import AddMaterialModal from './components/AddMaterialModal.vue';
import type { SourceFile, Material, ExpiryLevel } from './types';
import {
  folders,
  initialFiles,
  initialMaterials,
  filePreviewData
} from './mockData';

// State
const files = ref<SourceFile[]>([...initialFiles]);
const materials = ref<Material[]>([...initialMaterials]);
const selectedFile = ref<SourceFile | null>(null);
const showAddMaterialModal = ref(false);
const filePreviewRef = ref<InstanceType<typeof FilePreviewPanel> | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const folderInputRef = ref<HTMLInputElement | null>(null);

// Computed
const selectedFileMaterials = computed(() => {
  if (!selectedFile.value) return [];
  return materials.value.filter(m => m.sourceFileId === selectedFile.value?.id);
});

const selectedFilePreview = computed(() => {
  if (!selectedFile.value) return null;
  return filePreviewData.find(p => p.fileId === selectedFile.value?.id) || null;
});

// Expiry alert items for the summary panel
interface ExpiryAlertItem {
  material: Material;
  sourceFile: SourceFile | undefined;
  level: ExpiryLevel;
  label: string;
  daysLeft: number;
}

const expiryAlerts = computed<ExpiryAlertItem[]>(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const alerts: ExpiryAlertItem[] = [];
  for (const m of materials.value) {
    if (!m.expiryDate) continue;
    const expiry = new Date(m.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffMs = expiry.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let level: ExpiryLevel;
    let label: string;
    if (daysLeft < 0) {
      level = 'expired';
      label = `已过期 ${Math.abs(daysLeft)} 天`;
    } else if (daysLeft <= 7) {
      level = 'week';
      label = daysLeft === 0 ? '今日到期' : `${daysLeft} 天后到期`;
    } else if (daysLeft <= 30) {
      level = 'month';
      label = `${daysLeft} 天后到期`;
    } else if (daysLeft <= 90) {
      level = 'quarter';
      label = `${daysLeft} 天后到期`;
    } else {
      continue; // normal, skip
    }

    alerts.push({
      material: m,
      sourceFile: files.value.find(f => f.id === m.sourceFileId),
      level,
      label,
      daysLeft
    });
  }
  // Sort: expired first, then by daysLeft ascending
  alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  return alerts;
});

const handleAlertClick = (item: ExpiryAlertItem) => {
  const file = item.sourceFile;
  if (file) {
    selectedFile.value = file;
  }
};

// Handlers
const handleFileClick = (file: SourceFile) => {
  selectedFile.value = file;
};

const closeFileDetail = () => {
  selectedFile.value = null;
};

const handleAddMaterial = (data: { type: 'image' | 'text'; title: string; content: string }) => {
  if (!selectedFile.value) return;

  const newId = `m${selectedFile.value.id}-new-${Date.now()}`;
  const newMaterial: Material = {
    id: newId,
    name: data.title,
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: data.content || '手动添加的素材',
    contentType: data.type,
    fullText: data.type === 'text' ? data.content : undefined,
    keyInfo: [],
    sourceFileId: selectedFile.value.id,
    pageRange: '手动添加'
  };

  materials.value.push(newMaterial);
  selectedFile.value.materialCount++;
  showAddMaterialModal.value = false;
};

const handleDeleteMaterial = (materialId: string) => {
  const index = materials.value.findIndex(m => m.id === materialId);
  if (index !== -1) {
    materials.value.splice(index, 1);
    if (selectedFile.value) {
      selectedFile.value.materialCount--;
    }
  }
};

const handleNavigateToPage = (pageRange: string) => {
  const page = parseInt(pageRange.replace(/[^0-9]/g, '') || '1');
  if (filePreviewRef.value) {
    filePreviewRef.value.setCurrentPage(page);
  }
};

const handleUpdateMaterialName = (materialId: string, name: string) => {
  const material = materials.value.find(m => m.id === materialId);
  if (material) {
    material.name = name;
  }
};

// Drag and drop for upload area
const isDragOver = ref(false);

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  console.log('Files dropped:', e.dataTransfer?.files);
};

const handleFileSelect = () => {
  fileInputRef.value?.click();
};

const handleFolderSelect = () => {
  folderInputRef.value?.click();
};

const handleFileInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  console.log('Selected files:', input.files);
  input.value = '';
};

const handleFolderInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  console.log('Selected folder files:', input.files);
  input.value = '';
};

// Resizer logic
const containerRef = ref<HTMLElement | null>(null);
const leftPanelWidth = ref(50);
const isDragging = ref(false);
const minWidth = 30;
const maxWidth = 70;

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  const containerRect = containerRef.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const mouseX = e.clientX - containerRect.left;
  let newWidth = (mouseX / containerWidth) * 100;
  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
  leftPanelWidth.value = newWidth;
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

onMounted(() => {
  if (folderInputRef.value) {
    folderInputRef.value.setAttribute('webkitdirectory', '');
    folderInputRef.value.setAttribute('directory', '');
  }

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
  <div class="knowledge-base-page" ref="containerRef">
    <!-- Left: File Manager -->
    <div class="file-manager" :style="{ width: leftPanelWidth + '%' }">
      <!-- When file is selected, show file preview -->
      <FilePreviewPanel
        v-if="selectedFile"
        ref="filePreviewRef"
        :selected-file="selectedFile"
        :file-preview="selectedFilePreview"
        @close="closeFileDetail"
      />

      <!-- Default: File list view -->
      <SourceFileList
        v-else
        :folders="folders"
        :files="files"
        @file-click="handleFileClick"
      />
    </div>

    <!-- Resizer -->
    <div
      class="resizer"
      :class="{ 'is-dragging': isDragging }"
      @mousedown="startDrag"
    >
      <div class="resizer-handle"></div>
    </div>

    <!-- Right Panel -->
    <div class="material-panel" :style="{ width: (100 - leftPanelWidth) + '%' }">
      <div class="material-panel-content">
        <!-- When file is selected, show extracted materials list -->
        <MaterialList
          v-if="selectedFile"
          :materials="selectedFileMaterials"
          @add-material="showAddMaterialModal = true"
          @delete-material="handleDeleteMaterial"
          @navigate-to-page="handleNavigateToPage"
          @update:material-name="handleUpdateMaterialName"
        />

        <!-- Default: split top/bottom -->
        <template v-else>
          <div class="material-overview-layout">
            <!-- Top half: Expiry Alerts -->
            <div class="panel-half panel-half-top">
              <div v-if="expiryAlerts.length > 0" class="expiry-summary-panel">
                <div class="expiry-summary-header">
                  <div class="expiry-summary-title">
                    <ShieldAlert :size="20" />
                    <span>临期资质提醒</span>
                    <span class="expiry-summary-count">{{ expiryAlerts.length }}</span>
                  </div>
                  <span class="expiry-summary-hint">以下资质文件即将到期或已过期，请及时补充更新</span>
                </div>
                <div class="expiry-alert-list">
                  <div
                    v-for="item in expiryAlerts"
                    :key="item.material.id"
                    class="expiry-alert-row"
                    :class="'expiry-row-' + item.level"
                    @click="handleAlertClick(item)"
                  >
                    <div class="expiry-alert-row-left">
                      <div class="expiry-level-dot" :class="'dot-' + item.level"></div>
                      <div class="expiry-alert-info">
                        <span class="expiry-alert-name">{{ item.material.name }}</span>
                        <span class="expiry-alert-file">{{ item.sourceFile?.name || '—' }}</span>
                      </div>
                    </div>
                    <div class="expiry-alert-row-right">
                      <span class="expiry-alert-tag" :class="'tag-' + item.level">
                        <AlertTriangle v-if="item.level === 'expired' || item.level === 'week'" :size="12" />
                        <Clock v-else-if="item.level === 'month'" :size="12" />
                        <CalendarClock v-else :size="12" />
                        {{ item.label }}
                      </span>
                      <ChevronRight :size="16" class="expiry-arrow" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="expiry-empty">
                <ShieldAlert :size="32" />
                <span>暂无临期资质</span>
                <span class="expiry-empty-hint">所有资质文件状态正常</span>
              </div>
            </div>

            <!-- Bottom half: Upload Area -->
            <div class="panel-half panel-half-bottom">
              <div
                class="upload-area"
                :class="{ 'is-drag-over': isDragOver }"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @drop="handleDrop"
              >
                <input
                  ref="fileInputRef"
                  class="sr-only-input"
                  type="file"
                  multiple
                  @change="handleFileInputChange"
                />
                <input
                  ref="folderInputRef"
                  class="sr-only-input"
                  type="file"
                  multiple
                  @change="handleFolderInputChange"
                />
                <div class="upload-hero">
                  <div class="upload-icon">
                    <Upload :size="28" stroke-width="1.5" />
                  </div>
                  <div class="upload-copy">
                    <div class="upload-text">
                      <span class="upload-main-text">拖放文件到此处，或直接导入文件夹</span>
                    </div>
                    <p class="upload-hint">支持 PDF、Word、Excel、图片；可批量导入文件或文件夹</p>
                  </div>
                </div>
                <div class="upload-actions">
                  <button class="upload-btn upload-btn-primary" @click="handleFileSelect">
                    <Files :size="16" />
                    选择文件
                  </button>
                  <button class="upload-btn upload-btn-secondary" @click="handleFolderSelect">
                    <FolderOpen :size="16" />
                    选择文件夹
                  </button>
                </div>

                <!-- Process Flow Card -->
                <div class="process-flow-card">
                  <div class="flow-header">
                    <span class="flow-icon">✨</span>
                    <span>上传后，AI 将自动为您完成：</span>
                  </div>
                  <div class="flow-steps">
                    <div class="flow-step">
                      <div class="step-icon">
                        <ScanSearch :size="18" />
                      </div>
                      <div class="step-label">智能识别</div>
                      <div class="step-desc">识别文件内容</div>
                    </div>
                    <div class="flow-arrow">
                      <ArrowRight :size="14" />
                    </div>
                    <div class="flow-step">
                      <div class="step-icon">
                        <GitBranch :size="18" />
                      </div>
                      <div class="step-label">自动拆分</div>
                      <div class="step-desc">拆分为原子素材</div>
                    </div>
                    <div class="flow-arrow">
                      <ArrowRight :size="14" />
                    </div>
                    <div class="flow-step">
                      <div class="step-icon">
                        <Tags :size="18" />
                      </div>
                      <div class="step-label">分类归档</div>
                      <div class="step-desc">归入对应分类</div>
                    </div>
                  </div>
                  <p class="flow-footer">拆分后的素材可在「AI标书生成」等场景中自动匹配调用</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Add Material Modal -->
    <AddMaterialModal
      :visible="showAddMaterialModal"
      @close="showAddMaterialModal = false"
      @add="handleAddMaterial"
    />
  </div>
</template>

<style scoped>
.knowledge-base-page {
  flex: 1;
  height: 100%;
  display: flex;
  background: #eff6ff;
  overflow: hidden;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.file-manager {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  min-width: 480px;
  flex-shrink: 0;
  background-color: #eff6ff;
}

.resizer {
  width: 1px;
  background: #dbeafe;
  position: relative;
  z-index: 10;
  cursor: col-resize;
  flex-shrink: 0;
}

.resizer:hover {
  width: 4px;
  background: #bfdbfe;
}

/* Right Panel */
.material-panel {
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.material-panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
  gap: 12px;
  min-height: 0;
}

.material-overview-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 12px;
}

/* Top/Bottom half split */
.panel-half {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-half-top {
  min-height: 0;
}

.panel-half-bottom {
  flex: none;
  min-height: auto;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #bfdbfe;
  border-radius: 16px;
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
  transition: all 0.2s;
}

.upload-area.is-drag-over {
  border-color: #3b82f6;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
}

.sr-only-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.upload-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 12px;
}

.upload-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  flex-shrink: 0;
}

.upload-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 520px;
  gap: 4px;
}

.upload-text {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.upload-main-text {
  font-size: 17px;
  line-height: 1.3;
  color: #1f2937;
  font-weight: 700;
}

.upload-btn {
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upload-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.upload-btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.24);
}

.upload-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.3);
}

.upload-btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  box-shadow: 0 6px 16px rgba(148, 163, 184, 0.12);
}

.upload-btn-secondary:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Process Flow Card */
.process-flow-card {
  background: white;
  border-radius: 12px;
  padding: 12px 14px;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
}

.flow-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 10px;
}

.flow-icon {
  font-size: 16px;
}

.flow-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  max-width: 120px;
}

.step-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
}

.step-desc {
  font-size: 10px;
  color: #6b7280;
  text-align: center;
  line-height: 1.35;
}

.flow-arrow {
  color: #9ca3af;
  margin-top: 8px;
}

.flow-footer {
  font-size: 10px;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
}

/* Expiry Summary Panel */
.expiry-summary-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #fecaca;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.expiry-summary-header {
  padding: 14px 18px;
  background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
  border-bottom: 1px solid #fecaca;
}

.expiry-summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 2px;
}

.expiry-summary-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  background: #dc2626;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 11px;
}

.expiry-summary-hint {
  font-size: 12px;
  color: #9ca3af;
}

.expiry-alert-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

.expiry-alert-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
}

.expiry-alert-row:last-child {
  border-bottom: none;
}

.expiry-alert-row:hover {
  background: #f9fafb;
}

.expiry-alert-row-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.expiry-level-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-expired {
  background: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.dot-week {
  background: #ea580c;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.15);
}

.dot-month {
  background: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

.dot-quarter {
  background: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.expiry-alert-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.expiry-alert-name {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expiry-alert-file {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expiry-alert-row-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.expiry-alert-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
}

.tag-expired {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.tag-week {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.tag-month {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.tag-quarter {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.expiry-arrow {
  color: #d1d5db;
  transition: color 0.15s;
}

.expiry-alert-row:hover .expiry-arrow {
  color: #6b7280;
}

/* Expiry empty state */
.expiry-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 15px;
  font-weight: 500;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
}

.expiry-empty-hint {
  font-size: 13px;
  font-weight: 400;
  color: #c0c5cc;
}

@media (max-width: 1280px) {
  .material-panel-content {
    padding: 16px;
    gap: 10px;
  }

  .material-overview-layout {
    gap: 10px;
  }

  .upload-area {
    padding: 16px 16px 12px;
  }

  .upload-main-text {
    font-size: 16px;
  }
}

@media (max-width: 960px) {
  .material-panel-content {
    overflow-y: auto;
  }

  .material-overview-layout {
    display: flex;
    flex-direction: column;
  }

  .flow-steps {
    gap: 12px;
  }

  .flow-step {
    max-width: none;
  }

  .flow-arrow {
    display: none;
  }

  .upload-hero {
    flex-direction: column;
    text-align: center;
  }

  .upload-copy,
  .upload-text {
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
