<script setup lang="ts">
import { computed, ref, watch, nextTick, type Component } from 'vue';
import {
  Building2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Users
} from 'lucide-vue-next';
import GroupedMaterialList from './GroupedMaterialList.vue';
import PersonnelDetailPage from './PersonnelDetailPage.vue';
import QualificationDetailPage from './QualificationDetailPage.vue';
import CaseDetailPage from './CaseDetailPage.vue';
import ProfileMaterialSectionList from './ProfileMaterialSectionList.vue';
import ExpiryAlertList from './ExpiryAlertList.vue';
import AddMaterialModal from './components/AddMaterialModal.vue';
import type {
  EnterpriseMaterialTab,
  EnterpriseMaterialTabItem,
  ExpiryAlertItem,
  ExpiryInfo,
  Material,
  MaterialCategory,
  MaterialGroup,
  Person,
  PersonQualification,
  PersonnelQualificationFormPayload,
  ProfileSection,
  QualificationFormPayload,
  RecordEditorMode,
  SourcePreviewEvidence,
  SourceFile
} from './types';

interface TabConfig extends EnterpriseMaterialTabItem {
  icon: Component;
}

const props = defineProps<{
  files: SourceFile[];
  materials: Material[];
  persons: Person[];
  selectedFile: SourceFile | null;
  activeMaterialId?: string | null;
  activeTab: EnterpriseMaterialTab;
}>();

const emit = defineEmits<{
  'update:activeTab': [tab: EnterpriseMaterialTab];
  locateMaterial: [{ material: Material; tab: EnterpriseMaterialTab }];
  locatePersonnelSource: [
    payload: {
      sourceFileId: number;
      pageRange?: string;
      personId: string;
      preview?: SourcePreviewEvidence;
    }
  ];
  updateMaterialContent: [payload: { materialId: string; content: string }];
  saveQualification: [payload: QualificationFormPayload];
  deleteQualification: [materialId: string];
  savePersonnelQualification: [payload: PersonnelQualificationFormPayload];
  deletePersonnelQualification: [payload: { personId: string; qualificationId: string }];
}>();

const tabs: TabConfig[] = [
  { key: 'qualification', label: '企业资质', icon: ShieldCheck },
  { key: 'personnel', label: '人员资质', icon: Users },
  { key: 'cases', label: '业绩案例', icon: FileText },
  { key: 'expiry', label: '临期资质提醒', icon: ShieldAlert },
  { key: 'profile', label: '企业简介', icon: Building2 }
];

/** Hide only the cases tab button; cases panel/detail branches stay in template. */
const hideCasesTabInNav = true;

const currentPage = ref(1);
const pageSize = 10;
const materialContentRef = ref<HTMLElement | null>(null);
/** When set, tab bar is hidden and personnel detail replaces the panel body. */
const personnelDetailPerson = ref<Person | null>(null);
const qualificationDetailMaterial = ref<Material | null>(null);
const caseDetailMaterial = ref<Material | null>(null);
const editorVisible = ref(false);
const editorVariant = ref<'qualification' | 'personnel'>('qualification');
const editorMode = ref<RecordEditorMode>('create');
const qualificationEditorValue = ref<QualificationFormPayload | null>(null);
const personnelEditorValue = ref<PersonnelQualificationFormPayload | null>(null);

const getSourceFile = (sourceFileId: number) => props.files.find((file) => file.id === sourceFileId);

const getMaterialExpiry = (material: Material): ExpiryInfo | null => {
  const expirySource = material.qualification?.expiresAt || material.expiryDate;
  if (!expirySource) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(expirySource);
  expiry.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { level: 'expired', label: `已过期 ${Math.abs(daysLeft)} 天`, daysLeft };
  if (daysLeft <= 7) return { level: 'week', label: daysLeft === 0 ? '今日到期' : `${daysLeft} 天后到期`, daysLeft };
  if (daysLeft <= 30) return { level: 'month', label: `${daysLeft} 天后到期`, daysLeft };
  if (daysLeft <= 90) return { level: 'quarter', label: `${daysLeft} 天后到期`, daysLeft };
  return null;
};

const groupMaterialsByFile = (materialList: Material[]) => {
  const groupedMap = new Map<number, Material[]>();

  for (const material of materialList) {
    const currentItems = groupedMap.get(material.sourceFileId) ?? [];
    currentItems.push(material);
    groupedMap.set(material.sourceFileId, currentItems);
  }

  return props.files
    .filter((file) => groupedMap.has(file.id))
    .map<MaterialGroup>((file) => ({
      sourceFile: file,
      items: groupedMap.get(file.id) ?? []
    }));
};

const visibleMaterials = computed(() => {
  if (!props.selectedFile) return props.materials;
  return props.materials.filter((material) => material.sourceFileId === props.selectedFile?.id);
});

const qualificationMaterials = computed(() =>
  props.materials.filter(
    (material) =>
      material.category === 'certificate' &&
      (!props.selectedFile || material.sourceFileId === props.selectedFile.id)
  )
);

const visiblePersons = computed(() => {
  if (!props.selectedFile) return props.persons;
  return props.persons.filter((person) =>
    person.sourceFileId === props.selectedFile?.id ||
    person.qualifications.some((qualification) => qualification.sourceFileId === props.selectedFile?.id)
  );
});

const caseMaterials = computed(() =>
  visibleMaterials.value.filter((material) => material.category === 'case')
);

const profileMaterials = computed(() =>
  visibleMaterials.value.filter((material) => ['company', 'honor', 'technical', 'template'].includes(material.category))
);

const qualificationGroups = computed(() => groupMaterialsByFile(qualificationMaterials.value));
const caseGroups = computed(() => groupMaterialsByFile(caseMaterials.value));

const openPersonnelDetail = (person: Person) => {
  personnelDetailPerson.value = person;
};

const openQualificationDetail = (material: Material) => {
  qualificationDetailMaterial.value = material;
};

const openCaseDetail = (material: Material) => {
  caseDetailMaterial.value = material;
};

const getDefaultCompletedFileId = () =>
  props.files.find((file) => file.status === 'completed')?.id ?? props.files[0]?.id ?? 0;

const getDefaultPersonId = () =>
  personnelDetailPerson.value?.id ?? visiblePersons.value[0]?.id ?? props.persons[0]?.id ?? '';

const toQualificationFormPayload = (material: Material): QualificationFormPayload => {
  const qualification = material.qualification;

  return {
    materialId: material.id,
    sourceFileId: material.sourceFileId,
    pageRange: material.pageRange ?? '',
    name: qualification?.name || material.name,
    category: qualification?.category || qualification?.bucket || '',
    subcategory: qualification?.subcategory || '',
    level: qualification?.level || '',
    issuer: qualification?.issuer || '',
    certificateNo: qualification?.certificateNo || '',
    issuedAt: qualification?.issuedAt || '',
    expiresAt: qualification?.expiresAt || material.expiryDate || '',
    status: qualification?.status ?? 'valid',
    majorScope: qualification?.majorScope || '',
    description: qualification?.description || ''
  };
};

const toPersonnelQualificationFormPayload = (
  person: Person,
  qualification: PersonQualification
): PersonnelQualificationFormPayload => ({
  qualificationId: qualification.id,
  personId: person.id,
  sourceFileId: qualification.sourceFileId ?? person.sourceFileId ?? getDefaultCompletedFileId(),
  pageRange: qualification.pageRange ?? '',
  qualificationType: qualification.qualificationType,
  qualificationName: qualification.qualificationName,
  level: qualification.level,
  majorScope: qualification.majorScope,
  issuer: qualification.issuer,
  certificateNo: qualification.certificateNo,
  issuedAt: qualification.issuedAt,
  expiresAt: qualification.expiresAt,
  registrationStatus: qualification.registrationStatus,
  status: qualification.status
});

const openQualificationCreate = () => {
  editorVariant.value = 'qualification';
  editorMode.value = 'create';
  qualificationEditorValue.value = {
    sourceFileId: 0,
    pageRange: '',
    name: '',
    category: '',
    subcategory: '',
    level: '',
    issuer: '',
    certificateNo: '',
    issuedAt: '',
    expiresAt: '',
    status: 'valid',
    majorScope: '',
    description: ''
  };
  personnelEditorValue.value = null;
  editorVisible.value = true;
};

const openPersonnelQualificationCreate = () => {
  editorVariant.value = 'personnel';
  editorMode.value = 'create';
  personnelEditorValue.value = {
    personId: '',
    sourceFileId: 0,
    pageRange: '',
    qualificationType: '认证',
    qualificationName: '',
    level: '',
    majorScope: '',
    issuer: '',
    certificateNo: '',
    issuedAt: '',
    expiresAt: '',
    registrationStatus: '',
    status: 'valid'
  };
  qualificationEditorValue.value = null;
  editorVisible.value = true;
};

const openQualificationEdit = (material: Material) => {
  editorVariant.value = 'qualification';
  editorMode.value = 'edit';
  qualificationEditorValue.value = toQualificationFormPayload(material);
  personnelEditorValue.value = null;
  editorVisible.value = true;
};

const openPersonnelQualificationEdit = (payload: {
  person: Person;
  qualification: PersonQualification;
}) => {
  editorVariant.value = 'personnel';
  editorMode.value = 'edit';
  personnelEditorValue.value = toPersonnelQualificationFormPayload(payload.person, payload.qualification);
  qualificationEditorValue.value = null;
  editorVisible.value = true;
};

const closeEditor = () => {
  editorVisible.value = false;
};

const submitQualificationEditor = (payload: QualificationFormPayload) => {
  emit('saveQualification', payload);
  editorVisible.value = false;
};

const submitPersonnelQualificationEditor = (payload: PersonnelQualificationFormPayload) => {
  emit('savePersonnelQualification', payload);
  editorVisible.value = false;
};

const deleteQualificationRecord = (material: Material) => {
  if (!window.confirm(`确认删除企业资质「${material.name}」吗？`)) return;
  emit('deleteQualification', material.id);
};

const deletePersonnelQualificationRecord = (payload: {
  person: Person;
  qualification: PersonQualification;
}) => {
  if (!window.confirm(`确认删除「${payload.person.name}」的资质「${payload.qualification.qualificationName}」吗？`)) {
    return;
  }

  emit('deletePersonnelQualification', {
    personId: payload.person.id,
    qualificationId: payload.qualification.id
  });
};

const handleLocateQualificationSource = (payload: { materialId: string }) => {
  const material = props.materials.find((item) => item.id === payload.materialId);
  if (!material) return;
  emitLocate(material, 'qualification');
};

const handleLocateCaseSource = (payload: { materialId: string }) => {
  const material = props.materials.find((item) => item.id === payload.materialId);
  if (!material) return;
  emitLocate(material, 'cases');
};

const profileSections = computed<ProfileSection[]>(() => {
  const createSection = (
    key: string,
    title: string,
    description: string,
    category: MaterialCategory
  ): ProfileSection => {
    const items = profileMaterials.value.filter((material) => material.category === category);

    return {
      key,
      title,
      description,
      groups: groupMaterialsByFile(items),
      total: items.length
    };
  };

  return [
    createSection('company', '企业简介', '公司概况、发展历程与服务能力等介绍内容。', 'company'),
    createSection('technical', '技术能力', '核心技术能力、技术优势与平台能力说明。', 'technical'),
    createSection('honor', '荣誉资质', '企业获奖、知识产权与综合荣誉汇总。', 'honor'),
    createSection('template', '模板资料', '与投标相关的通用承诺、模板与补充资料。', 'template')
  ].filter((section) => section.total > 0);
});

const expiryAlerts = computed<ExpiryAlertItem[]>(() => {
  const alerts = visibleMaterials.value.reduce<ExpiryAlertItem[]>((items, material) => {
    const expiryInfo = getMaterialExpiry(material);
    if (!expiryInfo) return items;

    items.push({
      ...expiryInfo,
      material,
      sourceFile: getSourceFile(material.sourceFileId)
    });

    return items;
  }, []);

  alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  return alerts;
});

const totalPages = computed(() => Math.max(1, Math.ceil(expiryAlerts.value.length / pageSize)));

const paginatedAlerts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return expiryAlerts.value.slice(start, start + pageSize);
});

const activeTabMeta = computed(() => {
  const fileMode = !!props.selectedFile;

  if (props.activeTab === 'qualification') {
    return {
      emptyTitle: fileMode ? '当前文件未识别到企业资质' : '暂无企业资质数据',
      emptyDescription: fileMode ? '可切换其他文件查看已解析的资质信息。' : '等待素材解析后在此处展示资质字段。'
    };
  }

  if (props.activeTab === 'personnel') {
    return {
      emptyTitle: fileMode ? '当前文件未识别到人员资质' : '暂无人员资质数据',
      emptyDescription: fileMode ? '当前文件可能不是团队简历类素材。' : '待企业团队材料完成解析后展示。'
    };
  }

  if (props.activeTab === 'cases') {
    return {
      emptyTitle: fileMode ? '当前文件未识别到业绩案例' : '暂无业绩案例数据',
      emptyDescription: fileMode ? '可切换到案例集文件查看解析结果。' : '等待案例类文件解析后在此展示。'
    };
  }

  if (props.activeTab === 'expiry') {
    return {
      emptyTitle: fileMode ? '当前文件没有临期提醒' : '暂无临期资质提醒',
      emptyDescription: fileMode ? '当前文件中的资质状态正常。' : '所有资质文件当前均处于正常状态。'
    };
  }

  return {
    emptyTitle: fileMode ? '当前文件未识别到企业简介信息' : '暂无企业简介数据',
    emptyDescription: fileMode ? '当前文件可能不属于企业介绍类材料。' : '等待企业介绍类素材解析后展示。'
  };
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const emitLocate = (material: Material, tab: EnterpriseMaterialTab) => {
  emit('locateMaterial', { material, tab });
};

const deleteQualificationFromEditor = (materialId: string) => {
  const material = props.materials.find((item) => item.id === materialId);
  if (!material) return;

  if (!window.confirm(`确认删除企业资质「${material.name}」吗？`)) return;

  emit('deleteQualification', material.id);
  editorVisible.value = false;
};

const deletePersonnelQualificationFromEditor = (payload: {
  personId: string;
  qualificationId: string;
}) => {
  const person = props.persons.find((item) => item.id === payload.personId);
  const qualification = person?.qualifications.find((item) => item.id === payload.qualificationId);

  if (!person || !qualification) return;

  if (!window.confirm(`确认删除「${person.name}」的资质「${qualification.qualificationName}」吗？`)) {
    return;
  }

  emit('deletePersonnelQualification', payload);
  editorVisible.value = false;
};

watch(
  () => props.activeTab,
  (tab) => {
    if (tab !== 'personnel') personnelDetailPerson.value = null;
    if (tab !== 'qualification') qualificationDetailMaterial.value = null;
    if (tab !== 'cases') caseDetailMaterial.value = null;
    if (tab !== 'qualification' && tab !== 'personnel') {
      editorVisible.value = false;
    }
  }
);

watch(
  () => props.materials,
  () => {
    if (qualificationDetailMaterial.value) {
      qualificationDetailMaterial.value =
        props.materials.find((material) => material.id === qualificationDetailMaterial.value?.id) ?? null;
    }

    if (caseDetailMaterial.value) {
      caseDetailMaterial.value =
        props.materials.find((material) => material.id === caseDetailMaterial.value?.id) ?? null;
    }
  },
  { deep: true }
);

watch(
  () => props.persons,
  () => {
    if (personnelDetailPerson.value) {
      personnelDetailPerson.value =
        props.persons.find((person) => person.id === personnelDetailPerson.value?.id) ?? null;
    }
  },
  { deep: true }
);

watch(
  [() => props.selectedFile?.id, () => props.activeTab, () => expiryAlerts.value.length],
  () => {
    currentPage.value = 1;
  }
);

watch(
  () => [props.activeMaterialId, props.activeTab, visibleMaterials.value.map((material) => material.id).join(',')],
  async () => {
    if (!props.activeMaterialId) return;

    await nextTick();

    const target = materialContentRef.value?.querySelector<HTMLElement>(
      `[data-material-id="${props.activeMaterialId}"]`
    );
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  { immediate: true }
);
</script>

<template>
  <div class="material-panel-content">
    <div
      v-show="!personnelDetailPerson && !qualificationDetailMaterial && !caseDetailMaterial"
      class="material-tabs"
      role="tablist"
      aria-label="企业素材库结构化标签页"
    >
      <button
        v-for="tab in tabs"
        v-show="!hideCasesTabInNav || tab.key !== 'cases'"
        :key="tab.key"
        type="button"
        class="material-tab"
        :class="{ active: activeTab === tab.key }"
        :aria-selected="activeTab === tab.key"
        @click="emit('update:activeTab', tab.key)"
      >
        <component :is="tab.icon" :size="14" />
        <span class="material-tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div ref="materialContentRef" class="material-panel-body">
      <QualificationDetailPage
        v-if="qualificationDetailMaterial"
        :material="qualificationDetailMaterial"
        :files="files"
        @back="qualificationDetailMaterial = null"
        @edit="openQualificationEdit"
        @delete="deleteQualificationRecord"
        @locate-source="handleLocateQualificationSource"
      />

      <CaseDetailPage
        v-else-if="caseDetailMaterial"
        :material="caseDetailMaterial"
        :files="files"
        @back="caseDetailMaterial = null"
        @locate-source="handleLocateCaseSource"
      />

      <PersonnelDetailPage
        v-else-if="personnelDetailPerson"
        :person="personnelDetailPerson"
        :files="files"
        :cases="caseMaterials"
        @back="personnelDetailPerson = null"
        @edit-qualification="openPersonnelQualificationEdit"
        @delete-qualification="deletePersonnelQualificationRecord"
        @locate-source="emit('locatePersonnelSource', $event)"
      />

      <template v-else>
        <GroupedMaterialList
          v-if="activeTab === 'qualification'"
          variant="qualification"
          :groups="qualificationGroups"
          :active-material-id="activeMaterialId"
          :selected-file-id="selectedFile?.id ?? null"
          create-button-label="新增企业资质"
          @create="openQualificationCreate"
          @locate="emitLocate($event, 'qualification')"
          @edit-qualification="openQualificationEdit"
        />

        <GroupedMaterialList
          v-else-if="activeTab === 'personnel'"
          variant="personnel"
          :groups="[]"
          :persons="visiblePersons"
          :active-material-id="activeMaterialId"
          :selected-file-id="selectedFile?.id ?? null"
          create-button-label="新增人员资质"
          @create="openPersonnelQualificationCreate"
          @edit-personnel-qualification="openPersonnelQualificationEdit"
          @locate-personnel-qualification="emit('locatePersonnelSource', $event)"
        />

        <GroupedMaterialList
          v-else-if="activeTab === 'cases' && caseGroups.length > 0"
          variant="cases"
          :groups="caseGroups"
          :active-material-id="activeMaterialId"
          @locate="emitLocate($event, 'cases')"
          @open-detail="openCaseDetail"
        />

        <ExpiryAlertList
          v-else-if="activeTab === 'expiry' && expiryAlerts.length > 0"
          :alerts="paginatedAlerts"
          :current-page="currentPage"
          :total-pages="totalPages"
          @select-alert="emitLocate($event.material, 'qualification')"
          @go-to-page="goToPage"
        />

        <ProfileMaterialSectionList
          v-else-if="activeTab === 'profile' && profileSections.length > 0"
          :sections="profileSections"
          :active-material-id="activeMaterialId"
          @locate="emitLocate($event, 'profile')"
          @update-content="emit('updateMaterialContent', $event)"
        />

        <div v-else class="empty-state">
          <component
            :is="tabs.find((tab) => tab.key === activeTab)?.icon || FileText"
            :size="28"
          />
          <h4>{{ activeTabMeta.emptyTitle }}</h4>
          <p>{{ activeTabMeta.emptyDescription }}</p>
        </div>
      </template>
    </div>

    <AddMaterialModal
      :visible="editorVisible"
      :variant="editorVariant"
      :mode="editorMode"
      :files="files"
      :persons="persons"
      :qualification-value="qualificationEditorValue"
      :personnel-value="personnelEditorValue"
      @close="closeEditor"
      @submit-qualification="submitQualificationEditor"
      @submit-personnel-qualification="submitPersonnelQualificationEditor"
      @delete-qualification="deleteQualificationFromEditor"
      @delete-personnel-qualification="deletePersonnelQualificationFromEditor"
    />
  </div>
</template>

<style scoped>
.material-panel-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
}

.material-tabs {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.material-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  gap: 4px;
  height: 36px;
  padding: 0 6px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.material-tab-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.material-tab:hover {
  background: #eef2ff;
  color: #1e293b;
}

.material-tab.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08);
}

.material-panel-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-state {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  background: #f8fafc;
  color: #94a3b8;
  text-align: center;
}

.empty-state h4 {
  margin: 4px 0 0;
  font-size: 16px;
  color: #334155;
}

.empty-state p {
  margin: 0;
  max-width: 360px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

@media (max-width: 960px) {
  .material-panel-content {
    padding: 14px;
  }
}
</style>
