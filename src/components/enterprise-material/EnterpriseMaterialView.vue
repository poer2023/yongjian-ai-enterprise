<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Upload,
  ScanSearch,
  GitBranch,
  Tags,
  ArrowRight
} from 'lucide-vue-next';
import SourceFileList from './SourceFileList.vue';
import FilePreviewPanel from './FilePreviewPanel.vue';
import MaterialList from './MaterialList.vue';
import AddMaterialModal from './components/AddMaterialModal.vue';
import type { SourceFile, Material } from './types';
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

// Computed
const selectedFileMaterials = computed(() => {
  if (!selectedFile.value) return [];
  return materials.value.filter(m => m.sourceFileId === selectedFile.value?.id);
});

const selectedFilePreview = computed(() => {
  if (!selectedFile.value) return null;
  return filePreviewData.find(p => p.fileId === selectedFile.value?.id) || null;
});

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
  console.log('File select triggered');
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

        <!-- Default: Upload area -->
        <template v-else>
          <!-- Upload Area -->
          <div
            class="upload-area"
            :class="{ 'is-drag-over': isDragOver }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <div class="upload-icon">
              <Upload :size="32" stroke-width="1.5" />
            </div>
            <div class="upload-text">
              <span class="upload-main-text">拖放企业文件到此处，或</span>
              <button class="upload-btn" @click="handleFileSelect">选择文件</button>
            </div>
            <p class="upload-hint">支持 PDF、Word、Excel、图片等格式，单次可上传多个文件</p>

            <!-- Process Flow Card -->
            <div class="process-flow-card">
              <div class="flow-header">
                <span class="flow-icon">✨</span>
                <span>上传后，AI 将自动为您完成：</span>
              </div>
              <div class="flow-steps">
                <div class="flow-step">
                  <div class="step-icon">
                    <ScanSearch :size="20" />
                  </div>
                  <div class="step-label">智能识别</div>
                  <div class="step-desc">识别文件内容</div>
                </div>
                <div class="flow-arrow">
                  <ArrowRight :size="16" />
                </div>
                <div class="flow-step">
                  <div class="step-icon">
                    <GitBranch :size="20" />
                  </div>
                  <div class="step-label">自动拆分</div>
                  <div class="step-desc">拆分为原子素材</div>
                </div>
                <div class="flow-arrow">
                  <ArrowRight :size="16" />
                </div>
                <div class="flow-step">
                  <div class="step-icon">
                    <Tags :size="20" />
                  </div>
                  <div class="step-label">分类归档</div>
                  <div class="step-desc">归入对应分类</div>
                </div>
              </div>
              <p class="flow-footer">拆分后的素材可在「AI标书生成」等场景中自动匹配调用</p>
            </div>
          </div>

          <!-- Usage Tips -->
          <div class="usage-tips">
            <h3 class="tips-title">如何使用素材库？</h3>
            <div class="tips-list">
              <div class="tip-item">
                <span class="tip-number">1</span>
                <span class="tip-text">上传企业资质、业绩、团队等相关文件</span>
              </div>
              <div class="tip-item">
                <span class="tip-number">2</span>
                <span class="tip-text">点击左侧文件，查看 AI 自动拆分出的原子化素材</span>
              </div>
              <div class="tip-item">
                <span class="tip-number">3</span>
                <span class="tip-text">在「AI标书生成」时，系统自动匹配相关素材</span>
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
  padding: 24px;
  overflow-y: auto;
  gap: 24px;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #bfdbfe;
  border-radius: 16px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
  transition: all 0.2s;
}

.upload-area.is-drag-over {
  border-color: #3b82f6;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
}

.upload-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.upload-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.upload-main-text {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

.upload-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: #1d4ed8;
}

.upload-hint {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
}

/* Process Flow Card */
.process-flow-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
}

.flow-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 16px;
}

.flow-icon {
  font-size: 16px;
}

.flow-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 120px;
}

.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.step-desc {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.flow-arrow {
  color: #9ca3af;
  margin-top: 10px;
}

.flow-footer {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
}

/* Usage Tips */
.usage-tips {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px 24px;
}

.tips-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-text {
  font-size: 14px;
  color: #4b5563;
}
</style>
