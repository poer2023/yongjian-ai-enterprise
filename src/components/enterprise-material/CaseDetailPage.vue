<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, FileText } from 'lucide-vue-next';
import type {
  AttachmentRef,
  Material,
  PerformanceCaseEvidence,
  SourceFile,
  SourcePreviewEvidence
} from './types';

const props = defineProps<{
  material: Material;
  files: SourceFile[];
}>();

const emit = defineEmits<{
  back: [];
  locateSource: [
    payload: {
      sourceFileId: number;
      pageRange?: string;
      materialId: string;
      preview?: SourcePreviewEvidence;
    }
  ];
}>();

type EvidenceStatus = 'available' | 'missing';

interface EvidenceChecklistRow {
  id: string;
  label: string;
  status: EvidenceStatus;
}

const caseEvidence = computed<PerformanceCaseEvidence | null>(() => props.material.caseEvidence ?? null);

const getKeyInfoValue = (...keys: string[]) => {
  for (const key of keys) {
    const matched = props.material.keyInfo.find((entry) => entry.key === key)?.value;
    if (matched) return matched;
  }
  return '';
};

const projectName = computed(() =>
  caseEvidence.value?.projectName ||
  getKeyInfoValue('合同/项目名称', '项目名称') ||
  props.material.name
);

const clientName = computed(() =>
  caseEvidence.value?.clientName ||
  getKeyInfoValue('客户单位', '使用单位', '甲方单位', '合同甲方', '项目业主') ||
  '—'
);

const projectTypeLabel = computed(() => caseEvidence.value?.projectType || props.material.projectType || '业绩案例');

const industryLabel = computed(() => caseEvidence.value?.industry || getKeyInfoValue('所属行业') || '');

const proofStatusText = (status?: PerformanceCaseEvidence['proofStatus']) => {
  if (status === 'complete') return '完整证明';
  if (status === 'partial') return '部分证明';
  if (status === 'list_only') return '列表摘录';
  return '—';
};

const proofStatusLabel = computed(() => proofStatusText(caseEvidence.value?.proofStatus));

const projectOverview = computed(() => {
  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, value?: string) => {
    if (value && value !== '—') rows.push({ label, value });
  };

  push('项目名称', projectName.value);
  push('客户单位', clientName.value);
  push('签订时间', caseEvidence.value?.signedAt || getKeyInfoValue('合同签订时间', '签订日期'));
  push('合同金额', caseEvidence.value?.contractAmount || getKeyInfoValue('合同金额'));
  return rows;
});

const serviceInfo = computed(() => {
  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, value?: string) => {
    if (value && value !== '—') rows.push({ label, value });
  };

  push('案例主要服务内容', caseEvidence.value?.serviceContent || getKeyInfoValue('案例主要服务内容', '服务内容'));
  push('等保等级覆盖', getKeyInfoValue('等保等级覆盖') || '未注明');
  push('服务范围说明', getKeyInfoValue('服务范围说明') || caseEvidence.value?.scopeSummary);
  push('关键标签', getKeyInfoValue('关键标签') || caseEvidence.value?.highlights);
  return rows;
});

const proofDocuments = computed<AttachmentRef[]>(() => props.material.proofDocuments ?? []);

const findProofDocument = (keywords: string[]) =>
  proofDocuments.value.find((doc) => keywords.some((keyword) => doc.name.includes(keyword)));

const evidenceRows = computed<EvidenceChecklistRow[]>(() => {
  return [
    { id: 'cover', label: '合同首页', doc: findProofDocument(['合同首页']) },
    { id: 'service', label: '服务内容页', doc: findProofDocument(['服务内容页', '工作内容页']) },
    { id: 'amount', label: '金额/时间页', doc: findProofDocument(['金额/时间页', '金额页', '时间页']) },
    { id: 'stamp', label: '签章页', doc: findProofDocument(['签章页', '盖章页']) },
    { id: 'reference', label: '用户证明', doc: findProofDocument(['用户证明', '业主证明']) }
  ].map((row) => ({
    id: row.id,
    label: row.label,
    status: row.doc ? 'available' : 'missing'
  }));
});

const availableEvidenceCount = computed(() =>
  evidenceRows.value.filter((row) => row.status === 'available').length
);

const evidenceStatusClass = (status: EvidenceStatus) =>
  status === 'available' ? 'status-valid' : 'status-missing';

const evidenceStatusLabel = (status: EvidenceStatus) =>
  status === 'available' ? '已识别' : '缺失';

const onLocateSource = () => {
  emit('locateSource', {
    sourceFileId: props.material.sourceFileId,
    pageRange: props.material.pageRange,
    materialId: props.material.id,
    preview: props.material.previewEvidence
  });
};

</script>

<template>
  <div class="case-detail">
    <header class="detail-toolbar">
      <button type="button" class="back-btn" @click="emit('back')">
        <ArrowLeft :size="18" />
        <span>返回业绩列表</span>
      </button>
      <div class="detail-heading">
        <div class="detail-heading-main">
          <h2>{{ projectName }}</h2>
          <p class="detail-sub">
            {{ projectTypeLabel }}
            <span v-if="industryLabel"> · {{ industryLabel }}行业</span>
          </p>
        </div>
        <button
          v-if="material.sourceFileId"
          type="button"
          class="source-link"
          @click="onLocateSource"
        >
          <FileText :size="14" />
          <span>查看原件</span>
        </button>
      </div>
    </header>

    <div class="detail-scroll">
      <section class="detail-section">
        <h3 class="detail-h3">案例主档案</h3>
        <div class="fact-grid">
          <div v-for="row in projectOverview" :key="row.label" class="fact-row">
            <span class="fact-label">{{ row.label }}</span>
            <span class="fact-value">{{ row.value }}</span>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3 class="detail-h3">服务要点</h3>
        <div class="fact-grid">
          <div v-for="row in serviceInfo" :key="row.label" class="fact-row">
            <span class="fact-label">{{ row.label }}</span>
            <span class="fact-value">{{ row.value }}</span>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3 class="detail-h3">
          证明材料（{{ evidenceRows.length }}）
          <span class="exp-stat">已识别 {{ availableEvidenceCount }} 项</span>
        </h3>
        <div class="fact-grid">
          <div v-for="(row, index) in evidenceRows" :key="row.id" class="fact-row">
            <span class="fact-label">{{ index + 1 }}. {{ row.label }}</span>
            <span class="fact-value">
              <span class="status-dot" :class="evidenceStatusClass(row.status)">
                {{ evidenceStatusLabel(row.status) }}
              </span>
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.case-detail {
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

.detail-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.detail-heading-main {
  min-width: 0;
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

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  background: #eff6ff;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.source-link:hover {
  background: #dbeafe;
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

.exp-stat {
  margin-left: 10px;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  text-transform: none;
  letter-spacing: 0;
}

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

.status-dot {
  font-size: 12px;
  font-weight: 500;
}

.status-valid {
  color: #16a34a;
}

.status-missing {
  color: #d97706;
}

@media (max-width: 640px) {
  .fact-row {
    grid-template-columns: 1fr;
  }
}
</style>
