<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SourceFileList from './SourceFileList.vue';
import FilePreviewPanel from './FilePreviewPanel.vue';
import EnterpriseMaterialRightPanel from './EnterpriseMaterialRightPanel.vue';
import type { EnterpriseMaterialTab, Material, SourceFile, SourcePreviewEvidence } from './types';
import {
  folders,
  initialFiles,
  initialMaterials,
  initialPersons,
  filePreviewData
} from './mockData';

const route = useRoute();

const categoryTabMap: Record<Material['category'], EnterpriseMaterialTab> = {
  certificate: 'qualification',
  team: 'personnel',
  case: 'cases',
  company: 'profile',
  honor: 'profile',
  technical: 'profile',
  template: 'profile'
};

const files = ref<SourceFile[]>([...initialFiles]);
const materials = ref<Material[]>([...initialMaterials]);
const persons = ref([...initialPersons]);
const selectedFile = ref<SourceFile | null>(null);
const activeMaterialId = ref<string | null>(null);
const activeTab = ref<EnterpriseMaterialTab>('qualification');
const filePreviewRef = ref<InstanceType<typeof FilePreviewPanel> | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const focusedPreview = ref<SourcePreviewEvidence | null>(null);

const selectedFilePreview = computed(() => {
  if (!selectedFile.value) return null;
  return filePreviewData.find((preview) => preview.fileId === selectedFile.value?.id) ?? null;
});

const handleNavigateToPage = (pageRange?: string, preview?: SourcePreviewEvidence | null) => {
  const pageMatch = pageRange?.match(/\d+/);
  const page = preview?.targetPage ?? (pageMatch ? Number.parseInt(pageMatch[0], 10) : 1);

  if (filePreviewRef.value) {
    filePreviewRef.value.setCurrentPage(page);
  }
};

const handleLocateMaterial = async ({
  material,
  tab
}: {
  material: Material;
  tab: EnterpriseMaterialTab;
}) => {
  const sourceFile = files.value.find((file) => file.id === material.sourceFileId);
  if (!sourceFile) return;

  selectedFile.value = sourceFile;
  activeMaterialId.value = material.id;
  activeTab.value = tab;
  const sourceFilePreview = filePreviewData.find((preview) => preview.fileId === sourceFile.id) ?? null;
  focusedPreview.value = sourceFilePreview ? null : (material.previewEvidence ?? null);

  await nextTick();

  handleNavigateToPage(material.pageRange, material.previewEvidence);
};

const handleLocatePersonnelSource = async (payload: {
  sourceFileId: number;
  pageRange?: string;
  personId: string;
  preview?: SourcePreviewEvidence;
}) => {
  const file = files.value.find((f) => f.id === payload.sourceFileId);
  if (!file) return;

  selectedFile.value = file;
  activeMaterialId.value = payload.personId;
  activeTab.value = 'personnel';
  const sourceFilePreview = filePreviewData.find((preview) => preview.fileId === file.id) ?? null;
  focusedPreview.value = sourceFilePreview ? null : (payload.preview ?? null);

  await nextTick();

  handleNavigateToPage(payload.pageRange, payload.preview);
};

const handleFileClick = (file: SourceFile) => {
  selectedFile.value = file;
  activeMaterialId.value = null;
  focusedPreview.value = null;
};

const handleUpdateMaterialContent = ({
  materialId,
  content
}: {
  materialId: string;
  content: string;
}) => {
  materials.value = materials.value.map((material) =>
    material.id === materialId
      ? {
          ...material,
          fullText: content
        }
      : material
  );
};

const closeFileDetail = () => {
  selectedFile.value = null;
  activeMaterialId.value = null;
  focusedPreview.value = null;
};

const syncSelectionFromRoute = async () => {
  const fileIdQuery = typeof route.query.fileId === 'string' ? Number(route.query.fileId) : Number.NaN;
  const materialIdQuery = typeof route.query.materialId === 'string' ? route.query.materialId : null;

  const targetMaterial = materialIdQuery
    ? materials.value.find((material) => material.id === materialIdQuery) ?? null
    : null;
  const targetFileId = Number.isFinite(fileIdQuery) ? fileIdQuery : targetMaterial?.sourceFileId;

  if (!targetFileId) return;

  const targetFile = files.value.find((file) => file.id === targetFileId);
  if (!targetFile) return;

  selectedFile.value = targetFile;
  activeMaterialId.value = targetMaterial?.id ?? null;
  const sourceFilePreview = filePreviewData.find((preview) => preview.fileId === targetFile.id) ?? null;
  focusedPreview.value = sourceFilePreview ? null : (targetMaterial?.previewEvidence ?? null);

  if (targetMaterial) {
    activeTab.value = categoryTabMap[targetMaterial.category];
  }

  await nextTick();

  handleNavigateToPage(targetMaterial?.pageRange, targetMaterial?.previewEvidence);
};

const leftPanelWidth = ref(50);
const isDragging = ref(false);
const minWidth = 30;
const maxWidth = 70;

const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  event.preventDefault();
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const mouseX = event.clientX - containerRect.left;
  const nextWidth = (mouseX / containerRect.width) * 100;

  leftPanelWidth.value = Math.max(minWidth, Math.min(maxWidth, nextWidth));
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

watch(
  [() => route.query.fileId, () => route.query.materialId],
  () => {
    void syncSelectionFromRoute();
  }
);

onMounted(() => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  void syncSelectionFromRoute();
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
  <div ref="containerRef" class="knowledge-base-page">
    <div class="file-manager" :style="{ width: `${leftPanelWidth}%` }">
      <FilePreviewPanel
        v-if="selectedFile"
        ref="filePreviewRef"
        :selected-file="selectedFile"
        :file-preview="selectedFilePreview"
        :focused-preview="focusedPreview"
        @close="closeFileDetail"
      />

      <SourceFileList
        v-else
        :folders="folders"
        :files="files"
        @file-click="handleFileClick"
      />
    </div>

    <div
      class="resizer"
      :class="{ 'is-dragging': isDragging }"
      @mousedown="startDrag"
    >
      <div class="resizer-handle"></div>
    </div>

    <div class="material-panel" :style="{ width: `${100 - leftPanelWidth}%` }">
      <EnterpriseMaterialRightPanel
        v-model:active-tab="activeTab"
        :files="files"
        :materials="materials"
        :persons="persons"
        :selected-file="selectedFile"
        :active-material-id="activeMaterialId"
        @locate-material="handleLocateMaterial"
        @locate-personnel-source="handleLocatePersonnelSource"
        @update-material-content="handleUpdateMaterialContent"
      />
    </div>
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
  /* Avoid flex min-content width forcing horizontal scroll; cap on narrow viewports */
  min-width: min(480px, 100%);
  min-height: 0;
  flex-shrink: 0;
  background: #eff6ff;
}

.resizer {
  width: 1px;
  background: #dbeafe;
  position: relative;
  z-index: 10;
  cursor: col-resize;
  flex-shrink: 0;
}

.resizer:hover,
.resizer.is-dragging {
  width: 4px;
  background: #bfdbfe;
}

.resizer-handle {
  position: absolute;
  inset: 0;
}

.material-panel {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
