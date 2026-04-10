<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import type {
  Material,
  Person,
  PersonQualification,
  SourceFile,
  SourcePreviewEvidence
} from './types';

const props = defineProps<{
  person: Person;
  files: SourceFile[];
  cases: Material[];
}>();

const emit = defineEmits<{
  back: [];
  locateSource: [
    payload: {
      sourceFileId: number;
      pageRange?: string;
      personId: string;
      preview?: SourcePreviewEvidence;
    }
  ];
}>();

const profileInfo = computed(() => {
  const p = props.person;
  const rows: { label: string; value: string }[] = [];
  const push = (label: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '' && value !== null) rows.push({ label, value: String(value) });
  };
  push('姓名', p.name);
  push('年龄', p.age);
  push('学历', p.education);
  push('毕业学校', p.school);
  push('专业', p.major);
  push('职称', p.professionalTitle);
  push('职务', p.currentPosition);
  push('当前单位', p.organizationName);
  push('从业年限', p.totalYearsOfExperience ? `${p.totalYearsOfExperience}年` : undefined);
  push('身份证号', p.idNoMasked);
  return rows;
});

const qualifications = computed(() =>
  [...props.person.qualifications].sort((a, b) => {
    const typeOrder: Record<string, number> = { '注册证': 0, '执业资格': 1, '职称': 2, '认证': 3, '其他': 4 };
    return (typeOrder[a.qualificationType] ?? 9) - (typeOrder[b.qualificationType] ?? 9);
  })
);

const projectExperiences = computed(() => props.person.projectExperiences ?? []);

const statusLabel = (q: PersonQualification) => {
  if (q.status === 'expired') return '已过期';
  if (q.status === 'suspended') return '暂停';
  return '有效';
};

const onQualSourceClick = (q: PersonQualification) => {
  if (!q.sourceFileId) return;
  emit('locateSource', {
    sourceFileId: q.sourceFileId,
    pageRange: q.pageRange,
    personId: props.person.id,
    preview: q.previewEvidence
  });
};

interface ArchiveField {
  label: string;
  value: string;
  documentKey?: keyof NonNullable<Person['documents']>;
  sourceFileId?: number;
  pageRange?: string;
  preview?: SourcePreviewEvidence;
}

const archiveFields = computed<ArchiveField[]>(() => {
  const d = props.person.documents;
  const firstQual = props.person.qualifications.find((q) => q.sourceFileId);
  const firstCase = projectExperiences.value
    .map((e) => (e.caseId ? props.cases.find((m) => m.id === e.caseId) : undefined))
    .find(Boolean);

  const withPersonSource = (ok?: boolean, pageLabel?: string): Omit<ArchiveField, 'label'> => ({
    value: ok ? '' : '暂无',
    sourceFileId: ok ? props.person.sourceFileId : undefined,
    pageRange: ok ? pageLabel || props.person.pageRange : undefined
  });

  return [
    {
      label: '身份证',
      documentKey: 'idCard',
      ...withPersonSource(d?.idCard, '身份证明页'),
      preview: props.person.documentPreviewMap?.idCard
    },
    {
      label: '毕业证',
      documentKey: 'diploma',
      ...withPersonSource(d?.diploma, '学历证明页'),
      preview: props.person.documentPreviewMap?.diploma
    },
    {
      label: '学位证',
      documentKey: 'degree',
      ...withPersonSource(d?.degree, '学历证明页'),
      preview: props.person.documentPreviewMap?.degree
    },
    {
      label: '资质证书',
      value: props.person.qualifications.length > 0 ? `${props.person.qualifications.length} 张` : '暂无',
      sourceFileId: firstQual?.sourceFileId,
      pageRange: firstQual?.pageRange,
      preview: firstQual?.previewEvidence
    },
    {
      label: '社保证明',
      documentKey: 'socialSecurity',
      ...withPersonSource(d?.socialSecurity, '社保材料页'),
      preview: props.person.documentPreviewMap?.socialSecurity
    }
  ];
});

const onArchiveSourceClick = (field: ArchiveField) => {
  if (!field.sourceFileId) return;
  emit('locateSource', {
    sourceFileId: field.sourceFileId,
    pageRange: field.pageRange,
    personId: props.person.id,
    preview: field.preview
  });
};
</script>

<template>
  <div class="personnel-detail">
    <header class="detail-toolbar">
      <button type="button" class="back-btn" @click="emit('back')">
        <ArrowLeft :size="18" />
        <span>返回人员列表</span>
      </button>
      <div class="detail-heading">
        <h2>{{ person.name }}</h2>
        <p class="detail-sub">
          {{ person.currentPosition }}
          <span v-if="person.professionalTitle"> · {{ person.professionalTitle }}</span>
        </p>
        <p class="detail-meta">
          {{ person.organizationName }}
          <span v-if="person.professionalTitle"> · {{ person.professionalTitle }}</span>
        </p>
      </div>
    </header>

    <div class="detail-scroll">
      <section class="detail-section">
        <h3 class="detail-h3">人员主档案</h3>
        <div class="fact-grid">
          <div v-for="row in profileInfo" :key="row.label" class="fact-row">
            <span class="fact-label">{{ row.label }}</span>
            <span class="fact-value">{{ row.value }}</span>
          </div>
          <div v-for="item in archiveFields" :key="item.label" class="fact-row">
            <span class="fact-label">{{ item.label }}</span>
            <span class="fact-value fact-value-inline">
              <span v-if="item.value">{{ item.value }}</span>
              <button
                v-if="item.sourceFileId && item.value !== '暂无'"
                type="button"
                class="source-link-inline"
                @click="onArchiveSourceClick(item)"
              >
                查看原件
              </button>
            </span>
          </div>
        </div>
      </section>

      <section v-if="qualifications.length > 0" class="detail-section">
        <h3 class="detail-h3">资质证书（{{ qualifications.length }}）</h3>
        <div class="qual-table-wrap">
          <table class="qual-table">
            <thead>
              <tr>
                <th class="qt-num">#</th>
                <th class="qt-type">类型</th>
                <th class="qt-name">证书名称</th>
                <th class="qt-level">等级</th>
                <th class="qt-issuer">发证机构</th>
                <th class="qt-no">编号</th>
                <th class="qt-dates">有效期</th>
                <th class="qt-status">状态</th>
                <th class="qt-action"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(q, qi) in qualifications" :key="q.id">
                <td class="qt-num">{{ qi + 1 }}</td>
                <td class="qt-type">
                  <span class="type-tag">{{ q.qualificationType }}</span>
                </td>
                <td class="qt-name" :title="q.qualificationName">{{ q.qualificationName }}</td>
                <td class="qt-level">{{ q.level || '—' }}</td>
                <td class="qt-issuer" :title="q.issuer">{{ q.issuer || '—' }}</td>
                <td class="qt-no" :title="q.certificateNo">{{ q.certificateNo || '—' }}</td>
                <td class="qt-dates">
                  <template v-if="q.issuedAt || q.expiresAt">
                    {{ q.issuedAt || '—' }}<br v-if="q.expiresAt">
                    <span v-if="q.expiresAt" class="date-expiry">至 {{ q.expiresAt }}</span>
                  </template>
                  <template v-else>—</template>
                </td>
                <td class="qt-status">
                  <span
                    class="status-dot"
                    :class="{
                      'status-valid': q.status === 'valid',
                      'status-expired': q.status === 'expired',
                      'status-suspended': q.status === 'suspended'
                    }"
                  >{{ statusLabel(q) }}</span>
                </td>
                <td class="qt-action">
                  <button
                    v-if="q.sourceFileId"
                    type="button"
                    class="view-original-link"
                    @click="onQualSourceClick(q)"
                  >
                    <span>查看原件</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-else class="detail-section">
        <h3 class="detail-h3">资质证书</h3>
        <p class="empty-note">暂无资质证书记录</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.personnel-detail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.detail-toolbar {
  flex-shrink: 0;
  padding: 0 0 14px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 14px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 6px 10px 6px 6px;
  border: none;
  border-radius: 8px;
  background: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: background 0.15s ease;
}

.back-btn:hover {
  background: #e2e8f0;
}

.detail-heading h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.detail-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748b;
}

.detail-meta {
  margin: 4px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.detail-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-h3 {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
}

/* Basic info grid */
.fact-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fact-row {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 8px 12px;
  font-size: 13px;
  line-height: 1.5;
}

.fact-label {
  font-weight: 600;
  color: #64748b;
}

.fact-value {
  color: #0f172a;
  word-break: break-word;
}

.fact-value-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.source-link-inline {
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
}

/* Qualifications table */
.qual-table-wrap {
  overflow-x: auto;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  background: #ffffff;
}

.qual-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 1.4;
  color: #37352f;
}

.qual-table thead th {
  text-align: left;
  font-weight: 500;
  color: #787774;
  background: #f7f6f3;
  border-bottom: 1px solid #e9e9e7;
  padding: 7px 8px;
  white-space: nowrap;
}

.qual-table tbody td {
  border-bottom: 1px solid #f0f0ef;
  padding: 8px 8px;
  vertical-align: top;
}

.qual-table tbody tr:last-child td {
  border-bottom: none;
}

.qual-table tbody tr:hover td {
  background: #f7f7f5;
}

.qt-num { width: 36px; color: #9b9a97; font-variant-numeric: tabular-nums; }
.qt-type { width: 72px; }
.qt-name { min-width: 140px; }
.qt-level { width: 70px; }
.qt-issuer { min-width: 100px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qt-no { width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; color: #64748b; }
.qt-dates { width: 110px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.qt-status { width: 60px; }
.qt-action { width: 72px; text-align: right; }

/* Proof status badges */
.proof-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.proof-complete { background: #dcfce7; color: #166534; }
.proof-partial  { background: #ffedd5; color: #9a3412; }
.proof-list     { background: #dbeafe; color: #1d4ed8; }

.type-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
}

.date-expiry {
  color: #94a3b8;
  font-size: 11px;
}

.status-dot {
  font-size: 12px;
  font-weight: 500;
}

.status-valid { color: #16a34a; }
.status-expired { color: #dc2626; }
.status-suspended { color: #d97706; }

.view-original-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: #ffffff;
  font-size: 11px;
  font-weight: 500;
  color: #2563eb;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.view-original-link:hover {
  background: #f0f7ff;
}

.empty-note {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .fact-row {
    grid-template-columns: 1fr;
  }
}

</style>
