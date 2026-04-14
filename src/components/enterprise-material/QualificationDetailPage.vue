<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, FileText } from 'lucide-vue-next';
import type { Material, QualificationRecord, SourceFile, SourcePreviewEvidence } from './types';

const props = defineProps<{
  material: Material;
  files: SourceFile[];
}>();

const emit = defineEmits<{
  back: [];
  edit: [material: Material];
  delete: [material: Material];
  locateSource: [
    payload: {
      sourceFileId: number;
      pageRange?: string;
      materialId: string;
      preview?: SourcePreviewEvidence;
    }
  ];
}>();

const qualification = computed<QualificationRecord | null>(() => props.material.qualification ?? null);

const sourceFile = computed(() => props.files.find((file) => file.id === props.material.sourceFileId) ?? null);

const statusLabelMap: Record<NonNullable<QualificationRecord['status']>, string> = {
  valid: '有效',
  expired: '已过期',
  revoked: '已撤销'
};

const detailSummary = computed(() => {
  const q = qualification.value;
  return [q?.category, q?.subcategory].filter(Boolean).join(' / ') || props.material.categoryLabel;
});

const basicInfo = computed(() => {
  const q = qualification.value;
  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, value?: string) => {
    if (value) rows.push({ label, value });
  };

  push('资质名称', q?.name || props.material.name);
  push('资质类别', q?.bucket || q?.category);
  push('资质子类', q?.subcategory);
  push('专业领域', q?.serviceDomains?.join(' / '));
  push('当前状态', q?.status ? statusLabelMap[q.status] : '');
  push('资质等级', q?.level);
  push('荣誉级别', q?.honorLevel);
  return rows;
});

const certificateInfo = computed(() => {
  const q = qualification.value;
  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, value?: string) => {
    if (value) rows.push({ label, value });
  };

  push('发证机构', q?.issuer);
  push('证明形式', q?.proofType);
  push('证书编号', q?.certificateNo);
  push('发证日期', q?.issuedAt);
  push('到期日期', q?.expiresAt || props.material.expiryDate);
  push('标准依据', q?.standardCode);
  return rows;
});

const scopeInfo = computed(() => {
  const q = qualification.value;
  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, value?: string) => {
    if (value) rows.push({ label, value });
  };

  push('适用范围', q?.majorScope);
  push('核验方式', q?.verificationMethod);
  push('补充说明', q?.description);
  push('结构化来源', q?.isStructured === false ? '弱结构化抽取' : '强结构化证照');
  return rows;
});

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
  <div class="qualification-detail">
    <header class="detail-toolbar">
      <button type="button" class="back-btn" @click="emit('back')">
        <ArrowLeft :size="18" />
        <span>返回资质列表</span>
      </button>
      <div class="detail-heading">
        <h2>{{ qualification?.name || material.name }}</h2>
        <p class="detail-sub">{{ detailSummary }}</p>
      </div>
    </header>

    <div class="detail-scroll">
      <section class="detail-section">
        <h3 class="detail-h3">基础信息</h3>
        <div class="fact-grid">
          <div v-for="row in basicInfo" :key="row.label" class="fact-row">
            <span class="fact-label">{{ row.label }}</span>
            <span class="fact-value">{{ row.value }}</span>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3 class="detail-h3">证照信息</h3>
        <div class="fact-grid">
          <div v-for="row in certificateInfo" :key="row.label" class="fact-row">
            <span class="fact-label">{{ row.label }}</span>
            <span class="fact-value">{{ row.value }}</span>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3 class="detail-h3">适用范围与说明</h3>
        <div class="fact-grid">
          <div v-for="row in scopeInfo" :key="row.label" class="fact-row">
            <span class="fact-label">{{ row.label }}</span>
            <span class="fact-value">{{ row.value }}</span>
          </div>
        </div>
        <div v-if="qualification?.rawText" class="excerpt-block">
          <div class="excerpt-label">原文抽取片段</div>
          <p class="excerpt-text">{{ qualification.rawText }}</p>
        </div>
      </section>

      <section class="detail-section">
        <h3 class="detail-h3">来源证据</h3>
        <div class="fact-grid">
          <div class="fact-row">
            <span class="fact-label">来源文件</span>
            <span class="fact-value">{{ sourceFile?.name || '—' }}</span>
          </div>
          <div class="fact-row">
            <span class="fact-label">原文页码</span>
            <span class="fact-value">{{ material.pageRange || '—' }}</span>
          </div>
        </div>
        <div class="detail-actions">
          <button type="button" class="source-link ghost-link" @click="emit('edit', material)">
            <span>编辑条目</span>
          </button>
          <button type="button" class="source-link danger-link" @click="emit('delete', material)">
            <span>删除条目</span>
          </button>
          <button type="button" class="source-link" @click="onLocateSource">
            <FileText :size="14" />
            <span>定位原文</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.qualification-detail {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
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

.excerpt-block {
  margin-top: 12px;
}

.excerpt-label {
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.excerpt-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #475569;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
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
}

.source-link:hover {
  background: #dbeafe;
}

.ghost-link {
  background: #ffffff;
}

.ghost-link:hover {
  background: #f8fafc;
}

.danger-link {
  color: #dc2626;
  border-color: #fecaca;
  background: #fff5f5;
}

.danger-link:hover {
  background: #fee2e2;
}
</style>
