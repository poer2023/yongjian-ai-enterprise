<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Search, X } from 'lucide-vue-next';
import type {
  Material,
  MaterialGroup,
  Person,
  PersonQualification,
  SourcePreviewEvidence
} from './types';

const props = defineProps<{
  variant: 'qualification' | 'cases' | 'personnel' | 'profile';
  groups: MaterialGroup[];
  persons?: Person[];
  activeMaterialId?: string | null;
  selectedFileId?: number | null;
  createButtonLabel?: string;
}>();

const emit = defineEmits<{
  create: [];
  locate: [material: Material];
  openDetail: [material: Material];
  openPersonDetail: [person: Person];
  editQualification: [material: Material];
  deleteQualification: [material: Material];
  editPersonnelQualification: [payload: { person: Person; qualification: PersonQualification }];
  deletePersonnelQualification: [payload: { person: Person; qualification: PersonQualification }];
  locatePersonnelQualification: [
    payload: {
      sourceFileId: number;
      pageRange?: string;
      personId: string;
      preview?: SourcePreviewEvidence;
    }
  ];
  updateContent: [payload: { materialId: string; content: string }];
}>();

const getKeyInfoValue = (material: Material, key: string) =>
  material.keyInfo.find((item) => item.key === key)?.value ?? '';

const editingProfileId = ref<string | null>(null);
const profileDraft = ref('');

interface ProfileDocumentParts {
  title: string;
  body: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderInlineMarkdown = (value: string) =>
  escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

const renderMarkdown = (value: string | undefined) => {
  const content = (value ?? '').replace(/\r\n/g, '\n');
  if (!content.trim()) return '';

  const lines = content.split('\n');
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith('### ')) {
      closeList();
      html.push(`<h3>${renderInlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      closeList();
      html.push(`<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith('# ')) {
      closeList();
      html.push(`<h1>${renderInlineMarkdown(trimmed.slice(2))}</h1>`);
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${renderInlineMarkdown(listMatch[1] ?? '')}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
  }

  closeList();
  return html.join('');
};

const getProfileDocumentParts = (material: Material): ProfileDocumentParts => {
  const content = (material.fullText || material.summary || '').replace(/\r\n/g, '\n').trim();
  const headingMatch = content.match(/^#\s+(.+?)\n+(.*)$/s);

  if (!headingMatch) {
    return {
      title: material.name,
      body: content
    };
  }

  return {
    title: headingMatch[1]?.trim() || material.name,
    body: headingMatch[2]?.trim() || ''
  };
};

const buildProfileDocument = (title: string, body: string) => {
  const trimmedBody = body.trim();
  return trimmedBody ? `# ${title}\n\n${trimmedBody}` : `# ${title}`;
};

const buildAiExtractedProfileBody = (material: Material, draftBody: string) => {
  const structuredInfo = material.keyInfo
    .filter((item) => item.value.trim() !== '')
    .map((item) => `- ${item.key}：${item.value}`)
    .join('\n');

  const fallbackBody = material.summary.trim() ? `## 企业介绍\n\n${material.summary.trim()}` : '';
  const normalizedBody = (draftBody.trim() || fallbackBody)
    .replace(/\n{2,}## AI智能提取要点[\s\S]*$/u, '')
    .trim();

  if (!structuredInfo) {
    return normalizedBody;
  }

  return [normalizedBody, `## AI智能提取要点\n\n${structuredInfo}`]
    .filter((section) => section.trim() !== '')
    .join('\n\n');
};

const startProfileEdit = (material: Material) => {
  editingProfileId.value = material.id;
  profileDraft.value = getProfileDocumentParts(material).body;
};

const cancelProfileEdit = () => {
  editingProfileId.value = null;
  profileDraft.value = '';
};

const saveProfileEdit = (material: Material) => {
  const { title } = getProfileDocumentParts(material);
  emit('updateContent', {
    materialId: material.id,
    content: buildProfileDocument(title, profileDraft.value)
  });
  cancelProfileEdit();
};

const applyProfileAiExtraction = (material: Material) => {
  profileDraft.value = buildAiExtractedProfileBody(material, profileDraft.value);
};

const sortByListOrder = (items: Material[]) =>
  [...items].sort((a, b) => {
    const ao = a.listOrder ?? 10_000;
    const bo = b.listOrder ?? 10_000;
    if (ao !== bo) return ao - bo;
    return a.id.localeCompare(b.id);
  });

type QualificationStatusFilter = '' | 'valid' | 'expiring' | 'expired' | 'revoked';

interface QualificationRow {
  material: Material;
  rowKey: string;
}

const filterQualificationName = ref('');
const filterQualificationStatus = ref<QualificationStatusFilter>('');

type PersonnelQualType = PersonQualification['qualificationType'] | '';
type PersonnelStatusType = PersonQualification['status'] | '';

interface PersonnelRow {
  person: Person;
  qual: PersonQualification;
  rowKey: string;
}

const filterPersonnelName = ref('');
const filterPersonnelQualType = ref<PersonnelQualType>('');
const filterPersonnelStatus = ref<PersonnelStatusType>('');

type CaseProofFilter = '' | 'complete' | 'partial' | 'list_only' | 'missing';

interface CaseRow {
  material: Material;
  rowKey: string;
}

const filterCaseKeyword = ref('');
const filterCaseProjectType = ref<NonNullable<Material['projectType']> | ''>('');
const filterCaseProofStatus = ref<CaseProofFilter>('');

const qualificationRows = computed<QualificationRow[]>(() => {
  if (props.variant !== 'qualification') return [];

  return props.groups.flatMap((group) =>
    sortByListOrder(group.items).map((material) => ({
      material,
      rowKey: `${group.sourceFile?.id ?? 'unknown'}__${material.id}`
    }))
  );
});

const qualificationStatusKey = (material: Material): Exclude<QualificationStatusFilter, ''> => {
  const status = material.qualification?.status;
  if (status === 'expired') return 'expired';
  if (status === 'revoked') return 'revoked';

  const expirySource = material.qualification?.expiresAt || material.expiryDate;
  if (!expirySource) return 'valid';

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(expirySource);
  expiry.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 90) return 'expiring';
  return 'valid';
};

const filteredQualificationRows = computed<QualificationRow[]>(() => {
  const keyword = filterQualificationName.value.trim().toLowerCase();

  return qualificationRows.value.filter((row) => {
    const material = row.material;
    const name = qualDisplayName(material);

    if (keyword && !name.toLowerCase().includes(keyword)) {
      return false;
    }

    if (filterQualificationStatus.value && qualificationStatusKey(material) !== filterQualificationStatus.value) {
      return false;
    }

    return true;
  });
});

const personnelRows = computed<PersonnelRow[]>(() => {
  if (props.variant !== 'personnel') return [];

  const rows: PersonnelRow[] = [];
  for (const person of props.persons ?? []) {
    for (const qual of person.qualifications) {
      const qualificationSourceFileId = qual.sourceFileId ?? person.sourceFileId;
      if (props.selectedFileId && qualificationSourceFileId !== props.selectedFileId) continue;
      rows.push({
        person,
        qual,
        rowKey: `${person.id}__${qual.id}`
      });
    }
  }
  return rows;
});

const availablePersonnelQualTypes = computed<PersonQualification['qualificationType'][]>(() => {
  const order: PersonQualification['qualificationType'][] = ['执业资格', '注册证', '职称', '认证', '其他'];
  const present = new Set(personnelRows.value.map((row) => row.qual.qualificationType));
  return order.filter((item) => present.has(item));
});

const filteredPersonnelRows = computed<PersonnelRow[]>(() => {
  const keyword = filterPersonnelName.value.trim().toLowerCase();

  return personnelRows.value.filter((row) => {
    if (
      keyword &&
      !row.person.name.toLowerCase().includes(keyword) &&
      !row.qual.qualificationName.toLowerCase().includes(keyword)
    ) {
      return false;
    }
    if (filterPersonnelQualType.value && row.qual.qualificationType !== filterPersonnelQualType.value) return false;
    if (filterPersonnelStatus.value && row.qual.status !== filterPersonnelStatus.value) return false;
    return true;
  });
});

const hasActivePersonnelFilter = computed(
  () =>
    filterPersonnelName.value.trim() !== '' ||
    filterPersonnelQualType.value !== '' ||
    filterPersonnelStatus.value !== ''
);

const clearPersonnelFilters = () => {
  filterPersonnelName.value = '';
  filterPersonnelQualType.value = '';
  filterPersonnelStatus.value = '';
};

const personnelStatusLabel = (q: PersonQualification) => {
  if (q.status === 'expired') return '已过期';
  if (q.status === 'suspended') return '暂停';
  return '有效';
};

const personnelStatusClass = (q: PersonQualification) => {
  if (q.status === 'expired') return 'status-expired';
  if (q.status === 'suspended') return 'status-suspended';
  return 'status-valid';
};

const personnelExpiryDisplay = (q: PersonQualification) => q.expiresAt || '长期';

const personnelEffectiveLabel = (q: PersonQualification) => {
  const expiryText = personnelExpiryDisplay(q);
  const statusText = personnelStatusLabel(q);
  if (q.status !== 'valid') return statusText;
  if (expiryText === '长期') return '长期有效';
  return expiryText;
};

const personnelEffectiveClass = (q: PersonQualification) => {
  if (q.status === 'expired') return 'expiry-expired';
  if (q.status === 'suspended') return 'expiry-revoked';
  return 'status-valid';
};

const personnelQualNameDisplay = (q: PersonQualification) =>
  q.level ? `${q.qualificationName}（${q.level}）` : q.qualificationName;

const locatePersonnelQualification = (person: Person, qualification: PersonQualification) => {
  const sourceFileId = qualification.sourceFileId ?? person.sourceFileId;
  if (!sourceFileId) return;

  emit('locatePersonnelQualification', {
    sourceFileId,
    pageRange: qualification.pageRange || person.pageRange,
    personId: person.id,
    preview: qualification.previewEvidence ?? person.sourcePreviewEvidence
  });
};

const caseRows = computed<CaseRow[]>(() => {
  if (props.variant !== 'cases') return [];

  return props.groups.flatMap((group) =>
    sortByListOrder(group.items).map((material) => ({
      material,
      rowKey: `${group.sourceFile?.id ?? 'unknown'}__${material.id}`
    }))
  );
});

const availableCaseProjectTypes = computed<NonNullable<Material['projectType']>[]>(() => {
  const order: NonNullable<Material['projectType']>[] = [
    '等保测评',
    '密评',
    '安全服务',
    '系统集成',
    '软件开发',
    '运维服务',
    '咨询规划'
  ];
  const present = new Set(
    caseRows.value
      .map((row) => row.material.caseEvidence?.projectType || row.material.projectType)
      .filter((value): value is NonNullable<Material['projectType']> => !!value)
  );
  return order.filter((item) => present.has(item));
});

const caseProofFilterValue = (material: Material): Exclude<CaseProofFilter, ''> => {
  return material.caseEvidence?.proofStatus ?? 'missing';
};

const filteredCaseRows = computed<CaseRow[]>(() => {
  const keyword = filterCaseKeyword.value.trim().toLowerCase();

  return caseRows.value.filter((row) => {
    const material = row.material;
    const projectName = caseNameCol(material).toLowerCase();
    const clientName = caseClientCol(material).toLowerCase();
    const serviceContent = (material.caseEvidence?.serviceContent || getKeyInfoValue(material, '服务内容')).toLowerCase();
    const projectType = material.caseEvidence?.projectType || material.projectType || '';

    if (
      keyword &&
      !projectName.includes(keyword) &&
      !clientName.includes(keyword) &&
      !serviceContent.includes(keyword)
    ) {
      return false;
    }

    if (filterCaseProjectType.value && projectType !== filterCaseProjectType.value) {
      return false;
    }

    if (filterCaseProofStatus.value && caseProofFilterValue(material) !== filterCaseProofStatus.value) {
      return false;
    }

    return true;
  });
});

const hasActiveCaseFilter = computed(
  () =>
    filterCaseKeyword.value.trim() !== '' ||
    filterCaseProjectType.value !== '' ||
    filterCaseProofStatus.value !== ''
);

const clearCaseFilters = () => {
  filterCaseKeyword.value = '';
  filterCaseProjectType.value = '';
  filterCaseProofStatus.value = '';
};

const hasActiveQualificationFilter = computed(
  () =>
    filterQualificationName.value.trim() !== '' ||
    filterQualificationStatus.value !== ''
);

const clearQualificationFilters = () => {
  filterQualificationName.value = '';
  filterQualificationStatus.value = '';
};

const qualDisplayName = (material: Material) =>
  material.qualification?.name ||
  getKeyInfoValue(material, '资质认证名称') ||
  material.name;

const qualExpiresCol = (material: Material) =>
  material.qualification?.expiresAt ||
  material.expiryDate ||
  '长期';

const qualStatusLabel = (material: Material) => {
  const status = qualificationStatusKey(material);
  if (status === 'expired') return '已过期';
  if (status === 'revoked') return '已撤销';
  if (status === 'expiring') return '临期';
  return '有效';
};

const qualStatusClass = (material: Material) => {
  const status = qualificationStatusKey(material);
  if (status === 'expired') return 'status-expired';
  if (status === 'revoked') return 'status-revoked';
  if (status === 'expiring') return 'status-expiring';
  if (status === 'valid') return 'status-valid';
  return '';
};

const qualEffectiveLabel = (material: Material) => {
  const dateText = qualExpiresCol(material);
  const statusText = qualStatusLabel(material);
  if (dateText === '长期') return statusText === '有效' ? '长期有效' : statusText;
  return dateText;
};

const qualEffectiveDisplayClass = (material: Material) => {
  const status = qualificationStatusKey(material);
  if (status === 'expired') return 'expiry-expired';
  if (status === 'revoked') return 'expiry-revoked';
  return 'status-valid';
};

const caseNameCol = (material: Material) =>
  material.caseEvidence?.projectName ||
  getKeyInfoValue(material, '合同/项目名称') ||
  getKeyInfoValue(material, '项目名称') ||
  material.name;

const caseClientCol = (material: Material) =>
  material.caseEvidence?.clientName ||
  getKeyInfoValue(material, '客户单位') ||
  getKeyInfoValue(material, '使用单位') ||
  getKeyInfoValue(material, '甲方单位') ||
  getKeyInfoValue(material, '合同甲方') ||
  getKeyInfoValue(material, '项目业主') ||
  '—';

const caseSignedAtCol = (material: Material) =>
  material.caseEvidence?.signedAt ||
  getKeyInfoValue(material, '合同签订时间') ||
  getKeyInfoValue(material, '签订日期') ||
  getKeyInfoValue(material, '项目周期') ||
  '—';

const caseProofStatusLabel = (material: Material) => {
  const status = material.caseEvidence?.proofStatus;
  if (status === 'complete') return '完整证明';
  if (status === 'partial') return '部分证明';
  if (status === 'list_only') return '列表摘录';
  return '—';
};

const caseProofStatusClass = (material: Material) => {
  const status = material.caseEvidence?.proofStatus;
  if (status === 'complete') return 'status-valid';
  if (status === 'partial') return 'status-revoked';
  if (status === 'list_only') return 'status-pending';
  return '';
};

const getLocateLabel = () => (props.variant === 'profile' ? '查看原文' : '定位原文');

const getMaterialExpiryLabel = (material: Material) => {
  const expirySource = material.qualification?.expiresAt || material.expiryDate;
  if (!expirySource) return '';

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(expirySource);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return `已过期 ${Math.abs(daysLeft)} 天`;
  if (daysLeft <= 7) return daysLeft === 0 ? '今日到期' : `${daysLeft} 天后到期`;
  if (daysLeft <= 30) return `${daysLeft} 天后到期`;
  if (daysLeft <= 90) return `${daysLeft} 天后到期`;
  return '';
};

const getMaterialExpiryClass = (material: Material) => {
  const expirySource = material.qualification?.expiresAt || material.expiryDate;
  if (!expirySource) return '';

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(expirySource);
  expiry.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return 'expiry-expired';
  if (daysLeft <= 7) return 'expiry-week';
  if (daysLeft <= 30) return 'expiry-month';
  if (daysLeft <= 90) return 'expiry-quarter';
  return '';
};
</script>

<template>
  <div v-if="variant === 'qualification'" class="qualification-wrap">
    <div class="filter-bar qualification-filter-bar">
      <div class="filter-input-wrap">
        <Search class="filter-input-icon" :size="13" />
        <input
          v-model="filterQualificationName"
          type="text"
          class="filter-input"
          placeholder="搜索资质名称…"
        />
      </div>

      <select v-model="filterQualificationStatus" class="filter-select">
        <option value="">全部有效期</option>
        <option value="valid">有效</option>
        <option value="expiring">临期</option>
        <option value="expired">已过期</option>
        <option value="revoked">已撤销</option>
      </select>

      <button
        v-if="hasActiveQualificationFilter"
        type="button"
        class="filter-clear"
        @click="clearQualificationFilters"
      >
        <X :size="12" />
        <span>清除</span>
      </button>

      <div class="filter-bar-actions">
        <span class="filter-count qualification-filter-count">{{ filteredQualificationRows.length }} 条</span>
        <button
          v-if="createButtonLabel"
          type="button"
          class="filter-create-btn"
          @click="emit('create')"
        >
          <Plus :size="14" />
          <span>{{ createButtonLabel }}</span>
        </button>
      </div>
    </div>

    <div class="table-wrap">
      <table class="matter-table qualification-table" role="grid">
        <thead>
          <tr>
            <th class="col-idx" scope="col">#</th>
            <th class="col-qualification-name" scope="col">资质名称</th>
            <th class="col-qualification-expiry" scope="col">有效期</th>
            <th class="col-act col-qualification-act" scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in filteredQualificationRows"
            :key="row.rowKey"
            class="matter-row"
            :class="{ active: row.material.id === activeMaterialId }"
            :data-material-id="row.material.id"
          >
            <td class="cell-num">{{ idx + 1 }}</td>
            <td class="cell-name qualification-name-cell">{{ qualDisplayName(row.material) }}</td>
            <td class="cell-status qualification-expiry-cell">
              <span
                class="status-tag effective-tag"
                :class="qualEffectiveDisplayClass(row.material)"
              >{{ qualEffectiveLabel(row.material) }}</span>
            </td>
            <td class="cell-act qualification-action-cell">
              <div class="action-links">
                <button
                  type="button"
                  class="row-link"
                  @click="emit('editQualification', row.material)"
                >
                  编辑
                </button>
                <button
                  type="button"
                  class="row-link"
                  @click="emit('locate', row.material)"
                >
                  {{ getLocateLabel() }}
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredQualificationRows.length === 0">
            <td colspan="4" class="empty-cell">暂无符合条件的资质记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else-if="variant === 'personnel'" class="qualification-wrap">
    <div class="filter-bar">
      <div class="filter-input-wrap">
        <Search class="filter-input-icon" :size="13" />
        <input
          v-model="filterPersonnelName"
          type="text"
          class="filter-input"
          placeholder="搜索姓名或资质…"
        />
      </div>

      <select v-model="filterPersonnelQualType" class="filter-select">
        <option value="">全部类型</option>
        <option v-for="item in availablePersonnelQualTypes" :key="item" :value="item">{{ item }}</option>
      </select>

      <select v-model="filterPersonnelStatus" class="filter-select">
        <option value="">全部状态</option>
        <option value="valid">有效</option>
        <option value="expired">已过期</option>
        <option value="suspended">暂停</option>
      </select>

      <button
        v-if="hasActivePersonnelFilter"
        type="button"
        class="filter-clear"
        @click="clearPersonnelFilters"
      >
        <X :size="12" />
        <span>清除</span>
      </button>

      <div class="filter-bar-actions">
        <span class="filter-count">{{ filteredPersonnelRows.length }} 条</span>
        <button
          v-if="createButtonLabel"
          type="button"
          class="filter-create-btn"
          @click="emit('create')"
        >
          <Plus :size="14" />
          <span>{{ createButtonLabel }}</span>
        </button>
      </div>
    </div>

    <div class="table-wrap">
      <table class="matter-table personnel-table" role="grid">
        <thead>
          <tr>
            <th class="col-idx" scope="col">#</th>
            <th class="col-personnel-name" scope="col">姓名</th>
            <th class="col-personnel-type" scope="col">资质类型</th>
            <th class="col-personnel-name-title" scope="col">资质名称</th>
            <th class="col-personnel-effective" scope="col">有效期</th>
            <th class="col-personnel-act" scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in filteredPersonnelRows"
            :key="row.rowKey"
            class="matter-row"
            :class="{ active: row.person.id === activeMaterialId }"
            :data-material-id="row.person.id"
          >
            <td class="cell-num">{{ idx + 1 }}</td>
            <td class="cell-name personnel-name-cell">{{ row.person.name }}</td>
            <td class="personnel-type-cell">
              <span class="type-tag">{{ row.qual.qualificationType }}</span>
            </td>
            <td class="cell-muted personnel-name-title-cell" :title="personnelQualNameDisplay(row.qual)">
              {{ personnelQualNameDisplay(row.qual) }}
            </td>
            <td class="cell-status personnel-effective-cell">
              <span class="status-tag effective-tag" :class="personnelEffectiveClass(row.qual)">
                {{ personnelEffectiveLabel(row.qual) }}
              </span>
            </td>
            <td class="cell-act personnel-action-cell">
              <div class="action-links">
                <button
                  type="button"
                  class="row-link"
                  @click="emit('editPersonnelQualification', { person: row.person, qualification: row.qual })"
                >
                  编辑
                </button>
                <button
                  v-if="row.qual.sourceFileId || row.person.sourceFileId"
                  type="button"
                  class="row-link"
                  @click="locatePersonnelQualification(row.person, row.qual)"
                >
                  {{ getLocateLabel() }}
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredPersonnelRows.length === 0">
            <td colspan="6" class="empty-cell">暂无符合条件的资质记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else-if="variant === 'cases'" class="qualification-wrap">
    <div class="filter-bar">
      <div class="filter-input-wrap">
        <Search class="filter-input-icon" :size="13" />
        <input
          v-model="filterCaseKeyword"
          type="text"
          class="filter-input"
          placeholder="搜索项目名称、客户单位…"
        />
      </div>

      <select v-model="filterCaseProjectType" class="filter-select">
        <option value="">全部类型</option>
        <option v-for="item in availableCaseProjectTypes" :key="item" :value="item">{{ item }}</option>
      </select>

      <select v-model="filterCaseProofStatus" class="filter-select">
        <option value="">全部证明状态</option>
        <option value="complete">完整证明</option>
        <option value="partial">部分证明</option>
        <option value="list_only">列表摘录</option>
        <option value="missing">未识别</option>
      </select>

      <button
        v-if="hasActiveCaseFilter"
        type="button"
        class="filter-clear"
        @click="clearCaseFilters"
      >
        <X :size="12" />
        <span>清除</span>
      </button>

      <span class="filter-count">{{ filteredCaseRows.length }} 条</span>
    </div>

    <div class="table-wrap">
      <table class="matter-table" role="grid">
        <thead>
          <tr>
            <th scope="col">项目名称</th>
            <th scope="col">客户单位</th>
            <th scope="col">签订日期</th>
            <th class="col-status" scope="col">证明状态</th>
            <th class="col-act" scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filteredCaseRows"
            :key="row.rowKey"
            class="matter-row"
            :class="{ active: row.material.id === activeMaterialId }"
            :data-material-id="row.material.id"
          >
            <td class="cell-name case-project-name">{{ caseNameCol(row.material) }}</td>
            <td class="cell-muted case-client-name">{{ caseClientCol(row.material) }}</td>
            <td class="cell-muted">{{ caseSignedAtCol(row.material) }}</td>
            <td class="cell-status">
              <span class="status-tag" :class="caseProofStatusClass(row.material)">
                {{ caseProofStatusLabel(row.material) }}
              </span>
            </td>
            <td class="cell-act">
              <div class="action-links">
                <button
                  type="button"
                  class="row-link"
                  @click="emit('openDetail', row.material)"
                >
                  详情
                </button>
                <button
                  type="button"
                  class="row-link"
                  @click="emit('locate', row.material)"
                >
                  {{ getLocateLabel() }}
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredCaseRows.length === 0">
            <td colspan="5" class="empty-cell">暂无符合条件的业绩记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Personnel / profile: compact list rows -->
  <div v-else class="flat-groups">
    <div
      v-for="group in groups"
      :key="group.sourceFile?.id ?? 'unknown'"
      class="source-block"
    >
      <div v-if="variant !== 'profile'" class="source-heading">
        {{ group.sourceFile?.name || '未知来源文件' }}
      </div>

      <ul class="plain-list" role="list">
        <li
          v-for="material in group.items"
          :key="material.id"
          class="plain-row"
          :class="{ active: material.id === activeMaterialId, 'is-profile': variant === 'profile' }"
          :data-material-id="material.id"
        >
          <!-- Profile: full document body only, no chrome -->
          <div
            v-if="variant === 'profile'"
            class="profile-document"
          >
            <div class="profile-header">
              <h1 class="profile-title">{{ getProfileDocumentParts(material).title }}</h1>
              <div class="profile-actions">
                <button
                  v-if="editingProfileId !== material.id"
                  type="button"
                  class="profile-action-btn profile-action-btn-edit"
                  @click="startProfileEdit(material)"
                >
                  编辑
                </button>
                <template v-else>
                  <button
                    type="button"
                    class="profile-action-btn profile-action-btn-ai"
                    @click="applyProfileAiExtraction(material)"
                  >
                    AI智能提取
                  </button>
                  <button
                    type="button"
                    class="profile-action-btn profile-action-btn-save"
                    @click="saveProfileEdit(material)"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    class="profile-action-btn profile-action-btn-cancel"
                    @click="cancelProfileEdit"
                  >
                    取消
                  </button>
                </template>
              </div>
            </div>

            <textarea
              v-if="editingProfileId === material.id"
              v-model="profileDraft"
              class="profile-editor"
              placeholder="请输入企业简介正文内容..."
              spellcheck="false"
            />
            <div
              v-else
              class="profile-markdown"
              v-html="renderMarkdown(getProfileDocumentParts(material).body)"
            ></div>
          </div>

          <template v-else>
          <div class="plain-row-head">
            <div class="plain-titles">
            </div>

            <button type="button" class="row-link" @click="emit('locate', material)">
              {{ getLocateLabel() }}
            </button>
          </div>

          <p v-if="material.summary" class="plain-one-line">
            {{ material.summary }}
          </p>

          <p
            v-if="getMaterialExpiryLabel(material)"
            class="plain-expiry"
            :class="getMaterialExpiryClass(material)"
          >
            {{ getMaterialExpiryLabel(material) }}
          </p>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.qualification-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.filter-input-icon {
  position: absolute;
  left: 8px;
  color: #94a3b8;
  pointer-events: none;
}

.filter-input {
  padding: 5px 10px 5px 26px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  font-size: 12px;
  color: #334155;
  width: 190px;
  outline: none;
  transition: border-color 0.12s ease;
}

.filter-input::placeholder {
  color: #94a3b8;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #93c5fd;
}

.filter-select {
  padding: 5px 24px 5px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: border-color 0.12s ease;
}

.filter-clear {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  background: #fff1f2;
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
  cursor: pointer;
  transition: background 0.12s ease;
  white-space: nowrap;
}

.filter-clear:hover {
  background: #ffe4e6;
}

.filter-count {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.filter-bar-actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.qualification-filter-bar {
  align-items: stretch;
}

.qualification-filter-bar .filter-input-wrap {
  min-width: 220px;
}

.qualification-filter-bar .filter-input {
  width: 220px;
}

.qualification-filter-bar .filter-select {
  min-width: 112px;
}

.qualification-filter-count {
  display: inline-flex;
  align-items: center;
  align-self: center;
  white-space: nowrap;
}

.filter-create-btn {
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.filter-create-btn:hover {
  background: #1d4ed8;
}

.flat-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.source-block {
  margin: 0;
}

.source-heading {
  margin: 0 0 8px;
  padding-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.02em;
  border-bottom: 1px solid #e2e8f0;
}

.table-wrap {
  overflow-x: auto;
}

.matter-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 1.45;
  color: #0f172a;
}

.qualification-table {
  table-layout: fixed;
}

.personnel-table {
  table-layout: fixed;
}

.matter-table thead th {
  text-align: left;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 8px 10px;
  white-space: nowrap;
}

.matter-table td {
  border-bottom: 1px solid #f1f5f9;
  padding: 10px;
  vertical-align: top;
}

.matter-row:hover td {
  background: #fafbfc;
}

.matter-row.active td {
  background: #eff6ff;
}

.col-idx {
  width: 44px;
}

.col-page {
  width: 72px;
}

.col-status {
  width: 86px;
}

.col-act {
  width: 106px;
  text-align: right;
}

.col-qualification-name {
  width: calc(100% - 44px - 132px - 152px);
}

.col-qualification-expiry {
  width: 132px;
  text-align: left;
}

.col-personnel-name {
  width: 88px;
}

.col-personnel-type {
  width: 74px;
}

.col-personnel-name-title {
  width: calc(100% - 44px - 88px - 74px - 112px - 164px);
}

.col-qualification-act {
  width: 152px;
  text-align: left;
}

.col-personnel-effective {
  width: 112px;
  text-align: left;
}

.col-personnel-act {
  width: 164px;
  text-align: left;
}

.cell-num {
  font-variant-numeric: tabular-nums;
  color: #64748b;
}

.cell-name {
  font-weight: 500;
  color: #0f172a;
}

.qualification-name-cell {
  padding-right: 8px;
  line-height: 1.6;
  word-break: break-word;
}

.personnel-name-cell,
.personnel-name-title-cell {
  min-width: 0;
  word-break: break-word;
}

.personnel-name-title-cell {
  line-height: 1.6;
}

.personnel-type-cell {
  text-align: left;
}

.case-project-name,
.case-client-name {
  min-width: 0;
  word-break: break-word;
}

.case-project-name {
  line-height: 1.55;
}

.cell-muted {
  color: #475569;
}

.cell-act {
  text-align: right;
}

.cell-status {
  white-space: nowrap;
}

.qualification-expiry-cell {
  text-align: left;
}

.personnel-effective-cell {
  text-align: left;
}

.personnel-action-cell {
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
}

.qualification-action-cell {
  padding-left: 10px;
  padding-right: 10px;
  text-align: left;
}

.action-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

.qualification-action-cell .action-links {
  width: 100%;
  justify-content: flex-start;
}

.row-link {
  padding: 0;
  border: none;
  background: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.row-link:hover {
  color: #1d4ed8;
}

.row-link-danger {
  color: #dc2626;
}

.row-link-danger:hover {
  color: #b91c1c;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.effective-tag {
  min-width: 0;
  padding-left: 10px;
  padding-right: 10px;
}

.status-valid {
  color: #166534;
  background: #dcfce7;
}

.status-expired {
  color: #b91c1c;
  background: #fee2e2;
}

.status-revoked {
  color: #9a3412;
  background: #ffedd5;
}

.status-suspended {
  color: #9a3412;
  background: #ffedd5;
}

.status-expiring {
  color: #92400e;
  background: #fef3c7;
}

.status-pending {
  color: #1d4ed8;
  background: #dbeafe;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.empty-cell {
  padding: 20px 10px;
  text-align: center;
  color: #94a3b8;
}

.plain-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.plain-row {
  margin: 0;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.plain-row.active {
  background: linear-gradient(90deg, rgba(239, 246, 255, 0.7) 0%, transparent 100%);
  margin: 0 -8px;
  padding-left: 8px;
  padding-right: 8px;
}

.plain-row.is-profile {
  padding: 0;
  border-bottom: none;
}

.plain-row.is-profile.active {
  margin: 0;
  padding: 0;
  background: transparent;
}

.profile-document {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.profile-title {
  margin: 0;
  font-size: 22px;
  line-height: 1.35;
  font-weight: 700;
  color: #0f172a;
}

.profile-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.profile-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: #ffffff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.profile-action-btn:hover {
  border-color: #93c5fd;
  background: #eff6ff;
}

.profile-action-btn-save {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.profile-action-btn-save:hover {
  border-color: #1d4ed8;
  background: #1d4ed8;
}

.profile-action-btn-cancel {
  border-color: #cbd5e1;
  color: #475569;
}

.profile-action-btn-cancel:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.profile-editor {
  min-height: 520px;
  width: 100%;
  resize: vertical;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.75;
  color: #334155;
  background: #ffffff;
  font-family: inherit;
  box-sizing: border-box;
}

.profile-editor:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.25);
}

.profile-markdown {
  font-size: 13px;
  line-height: 1.75;
  color: #334155;
  word-break: break-word;
}

.profile-markdown :deep(h2),
.profile-markdown :deep(h3) {
  margin: 0 0 12px;
  color: #0f172a;
  font-weight: 700;
}

.profile-markdown :deep(h2) {
  margin-top: 6px;
  font-size: 18px;
}

.profile-markdown :deep(h3) {
  margin-top: 18px;
  font-size: 15px;
}

.profile-markdown :deep(p) {
  margin: 0 0 12px;
}

.profile-markdown :deep(ul) {
  margin: 0 0 12px 18px;
  padding: 0;
}

.profile-markdown :deep(li) {
  margin: 0 0 6px;
}

.row-link-muted {
  color: #64748b;
}

.row-link-muted:hover {
  color: #475569;
}

.plain-row-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.plain-titles {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.plain-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.plain-sub {
  font-size: 12px;
  color: #64748b;
}

.plain-one-line,
.plain-meta,
.plain-detail,
.plain-expiry {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #64748b;
}

.plain-detail {
  color: #475569;
}

.plain-expiry {
  font-weight: 600;
}

.expiry-expired {
  color: #dc2626;
}

.expiry-revoked {
  color: #c2410c;
}

.expiry-week {
  color: #ea580c;
}

.expiry-month {
  color: #d97706;
}

.expiry-quarter {
  color: #2563eb;
}

@media (max-width: 960px) {
  .filter-bar-actions {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }

  .qualification-filter-bar .filter-input-wrap,
  .qualification-filter-bar .filter-input,
  .qualification-filter-bar .filter-select {
    min-width: 0;
    width: auto;
  }

  .qualification-filter-count {
    padding-left: 0;
  }

  .plain-row-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-header {
    flex-direction: column;
  }

  .profile-actions {
    flex-wrap: wrap;
  }
}
</style>
