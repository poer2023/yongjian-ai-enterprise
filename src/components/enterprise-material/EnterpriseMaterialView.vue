<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SourceFileList from './SourceFileList.vue';
import FilePreviewPanel from './FilePreviewPanel.vue';
import EnterpriseMaterialRightPanel from './EnterpriseMaterialRightPanel.vue';
import type {
  EnterpriseMaterialTab,
  KeyValuePair,
  Material,
  PersonQualification,
  PersonnelQualificationFormPayload,
  QualificationFormPayload,
  SourceFile,
  SourcePreviewEvidence
} from './types';
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

const createKeyInfo = (pairs: Array<[string, string]>) =>
  pairs.reduce<KeyValuePair[]>((items, [key, value]) => {
    const trimmed = value.trim();
    if (trimmed) {
      items.push({ key, value: trimmed });
    }
    return items;
  }, []);

const createRecordId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getNextListOrder = (category: Material['category']) => {
  const currentMax = materials.value
    .filter((material) => material.category === category)
    .reduce((max, material) => Math.max(max, Math.floor(material.listOrder ?? 0)), 0);

  return currentMax + 1;
};

const buildQualificationMaterial = (
  payload: QualificationFormPayload,
  existingMaterial?: Material
): Material => {
  const summaryParts = [payload.category, payload.level, payload.issuer || payload.certificateNo]
    .map((item) => item.trim())
    .filter(Boolean);
  const summary = summaryParts.join(' · ') || `${payload.name}（手动维护）`;
  const fullTextLines = [
    `资质名称：${payload.name}`,
    payload.category ? `资质类别：${payload.category}` : '',
    payload.subcategory ? `资质子类：${payload.subcategory}` : '',
    payload.level ? `资质等级：${payload.level}` : '',
    payload.issuer ? `发证机构：${payload.issuer}` : '',
    payload.certificateNo ? `证书编号：${payload.certificateNo}` : '',
    payload.issuedAt ? `发证日期：${payload.issuedAt}` : '',
    payload.expiresAt ? `到期日期：${payload.expiresAt}` : '',
    payload.majorScope ? `适用范围：${payload.majorScope}` : '',
    payload.description ? `补充说明：${payload.description}` : ''
  ].filter(Boolean);

  return {
    id: existingMaterial?.id ?? createRecordId('manual-qualification'),
    name: payload.name,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary,
    keyInfo: createKeyInfo([
      ['资质认证名称', payload.name],
      ['资质类别', payload.category],
      ['资质子类', payload.subcategory],
      ['资质等级', payload.level],
      ['发证机构', payload.issuer],
      ['证书编号', payload.certificateNo],
      ['到期日期', payload.expiresAt]
    ]),
    sourceFileId: payload.sourceFileId,
    pageRange: payload.pageRange || undefined,
    contentType: 'text',
    fullText: fullTextLines.join('\n'),
    expiryDate: payload.expiresAt || undefined,
    listOrder: existingMaterial?.listOrder ?? getNextListOrder('certificate'),
    qualification: {
      organizationId: 'org-demo-manual',
      category: payload.category || '手工维护',
      subcategory: payload.subcategory || undefined,
      name: payload.name,
      level: payload.level || undefined,
      issuer: payload.issuer || undefined,
      certificateNo: payload.certificateNo || undefined,
      issuedAt: payload.issuedAt || undefined,
      expiresAt: payload.expiresAt || undefined,
      status: payload.status,
      majorScope: payload.majorScope || undefined,
      description: payload.description || undefined,
      isStructured: false,
      rawText: fullTextLines.join('；')
    },
    previewEvidence: existingMaterial?.previewEvidence
  };
};

const buildPersonnelQualification = (
  payload: PersonnelQualificationFormPayload,
  existingQualification?: PersonQualification
): PersonQualification => ({
  id: existingQualification?.id ?? createRecordId('manual-personnel-qualification'),
  personId: payload.personId,
  qualificationType: payload.qualificationType,
  qualificationName: payload.qualificationName,
  level: payload.level,
  majorScope: payload.majorScope,
  issuer: payload.issuer,
  certificateNo: payload.certificateNo,
  issuedAt: payload.issuedAt,
  expiresAt: payload.expiresAt,
  registrationStatus: payload.registrationStatus,
  status: payload.status,
  isPrimary: existingQualification?.isPrimary ?? false,
  sourceFileId: payload.sourceFileId,
  pageRange: payload.pageRange || undefined,
  previewDataUrl: existingQualification?.previewDataUrl,
  previewEvidence: existingQualification?.previewEvidence
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

const handleSaveQualification = async (payload: QualificationFormPayload) => {
  const existingMaterial = payload.materialId
    ? materials.value.find((material) => material.id === payload.materialId)
    : undefined;
  const nextMaterial = buildQualificationMaterial(payload, existingMaterial);

  materials.value = existingMaterial
    ? materials.value.map((material) => (material.id === existingMaterial.id ? nextMaterial : material))
    : [nextMaterial, ...materials.value];

  await handleLocateMaterial({
    material: nextMaterial,
    tab: 'qualification'
  });
};

const handleDeleteQualification = (materialId: string) => {
  materials.value = materials.value.filter((material) => material.id !== materialId);

  if (activeMaterialId.value === materialId) {
    activeMaterialId.value = null;
  }
};

const handleSavePersonnelQualification = async (payload: PersonnelQualificationFormPayload) => {
  const existingOwner = payload.qualificationId
    ? persons.value.find((person) =>
        person.qualifications.some((qualification) => qualification.id === payload.qualificationId)
      )
    : undefined;
  const existingQualification = payload.qualificationId
    ? existingOwner?.qualifications.find((qualification) => qualification.id === payload.qualificationId)
    : undefined;
  const nextQualification = buildPersonnelQualification(payload, existingQualification);

  persons.value = persons.value.map((person) => {
    const withoutEdited = payload.qualificationId
      ? person.qualifications.filter((qualification) => qualification.id !== payload.qualificationId)
      : person.qualifications;

    if (person.id !== payload.personId) {
      return {
        ...person,
        qualifications: withoutEdited
      };
    }

    return {
      ...person,
      qualifications: [...withoutEdited, nextQualification]
    };
  });

  await handleLocatePersonnelSource({
    sourceFileId: payload.sourceFileId,
    pageRange: payload.pageRange || undefined,
    personId: payload.personId,
    preview: existingQualification?.previewEvidence
  });
};

const handleDeletePersonnelQualification = (payload: {
  personId: string;
  qualificationId: string;
}) => {
  persons.value = persons.value.map((person) => {
    if (person.id !== payload.personId) return person;

    return {
      ...person,
      qualifications: person.qualifications.filter(
        (qualification) => qualification.id !== payload.qualificationId
      )
    };
  });
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
        @save-qualification="handleSaveQualification"
        @delete-qualification="handleDeleteQualification"
        @save-personnel-qualification="handleSavePersonnelQualification"
        @delete-personnel-qualification="handleDeletePersonnelQualification"
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
