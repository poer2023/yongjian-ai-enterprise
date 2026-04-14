<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  PencilLine,
  Save,
  Search,
  ShieldCheck,
  UserRound,
  X
} from 'lucide-vue-next';
import type {
  Person,
  PersonnelQualificationFormPayload,
  QualificationFormPayload,
  RecordEditorMode,
  SourceFile
} from '../types';

const props = defineProps<{
  visible: boolean;
  variant: 'qualification' | 'personnel';
  mode: RecordEditorMode;
  files: SourceFile[];
  persons: Person[];
  qualificationValue?: QualificationFormPayload | null;
  personnelValue?: PersonnelQualificationFormPayload | null;
}>();

const emit = defineEmits<{
  close: [];
  submitQualification: [payload: QualificationFormPayload];
  submitPersonnelQualification: [payload: PersonnelQualificationFormPayload];
  deleteQualification: [materialId: string];
  deletePersonnelQualification: [payload: { personId: string; qualificationId: string }];
}>();

const personnelTypeOptions = ['职称', '注册证', '执业资格', '认证', '其他'] as const;

const availableFiles = computed(() => props.files.filter((file) => file.status === 'completed'));

/** File picker: type to filter; popover only when query matches at least one file. */
const materialFileSearch = ref('');

const matchingMaterialFiles = computed(() => {
  const q = materialFileSearch.value.trim().toLowerCase();
  if (!q) return [];
  return availableFiles.value.filter((f) => f.name.toLowerCase().includes(q));
});

const showMaterialFilePopover = computed(
  () => materialFileSearch.value.trim().length > 0 && matchingMaterialFiles.value.length > 0
);

const selectedQualificationFileLabel = computed(
  () => availableFiles.value.find((f) => f.id === qualificationDraft.sourceFileId)?.name ?? ''
);

const selectedPersonnelFileLabel = computed(
  () => availableFiles.value.find((f) => f.id === personnelDraft.sourceFileId)?.name ?? ''
);

const materialFileInputRef = ref<HTMLInputElement | null>(null);
const personInputRef = ref<HTMLInputElement | null>(null);
const personSearch = ref('');

const getPersonDisplayLabel = (person: Person) => `${person.name} · ${person.organizationName}`;

const selectedPersonnelPersonLabel = computed(() => {
  const person = personOptions.value.find((p) => p.id === personnelDraft.personId);
  return person ? getPersonDisplayLabel(person) : '';
});

const matchingPersons = computed(() => {
  const q = personSearch.value.trim().toLowerCase();
  if (!q) return [];
  return personOptions.value.filter((person) => {
    const name = person.name.toLowerCase();
    const org = person.organizationName.toLowerCase();
    return name.includes(q) || org.includes(q);
  });
});

const showPersonPopover = computed(
  () => personSearch.value.trim().length > 0 && matchingPersons.value.length > 0
);

const focusMaterialFileInput = () => {
  materialFileInputRef.value?.focus();
};

const focusPersonInput = () => {
  personInputRef.value?.focus();
};

const handlePersonSearchInput = () => {
  if (personSearch.value.trim() !== selectedPersonnelPersonLabel.value.trim()) {
    personnelDraft.personId = '';
  }
};

const selectPersonnelPerson = (personId: string) => {
  const person = personOptions.value.find((item) => item.id === personId);
  personnelDraft.personId = personId;
  personSearch.value = person ? getPersonDisplayLabel(person) : '';
};

const selectQualificationSourceFile = (id: number) => {
  qualificationDraft.sourceFileId = id;
  materialFileSearch.value = '';
};

const selectPersonnelSourceFile = (id: number) => {
  personnelDraft.sourceFileId = id;
  materialFileSearch.value = '';
};

const personOptions = computed(() =>
  [...props.persons].sort((left, right) => left.name.localeCompare(right.name, 'zh-CN'))
);

const getDefaultFileId = () => availableFiles.value[0]?.id ?? props.files[0]?.id ?? 0;

const getDefaultPersonId = () => personOptions.value[0]?.id ?? '';

const createQualificationDraft = (): QualificationFormPayload => ({
  sourceFileId: getDefaultFileId(),
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
});

const createPersonnelDraft = (): PersonnelQualificationFormPayload => ({
  personId: getDefaultPersonId(),
  sourceFileId: getDefaultFileId(),
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
});

const qualificationDraft = reactive<QualificationFormPayload>(createQualificationDraft());
const personnelDraft = reactive<PersonnelQualificationFormPayload>(createPersonnelDraft());

const syncQualificationDraft = (value?: QualificationFormPayload | null) => {
  Object.assign(qualificationDraft, createQualificationDraft(), value ?? {});
};

const syncPersonnelDraft = (value?: PersonnelQualificationFormPayload | null) => {
  Object.assign(personnelDraft, createPersonnelDraft(), value ?? {});
};

watch(
  () => [
    props.visible,
    props.variant,
    props.mode,
    props.qualificationValue,
    props.personnelValue,
    availableFiles.value.length,
    personOptions.value.length
  ],
  () => {
    if (!props.visible) return;

    materialFileSearch.value = '';

    if (props.variant === 'qualification') {
      syncQualificationDraft(props.qualificationValue);
      return;
    }

    syncPersonnelDraft(props.personnelValue);
    personSearch.value = selectedPersonnelPersonLabel.value;
  },
  { immediate: true, deep: true }
);

const modalTitle = computed(() => {
  const action = props.mode === 'create' ? '新增' : '编辑';
  return props.variant === 'qualification' ? `${action}企业资质` : `${action}人员资质`;
});

const submitLabel = computed(() => (props.mode === 'create' ? '保存条目' : '保存修改'));

const submitDisabled = computed(() => {
  if (props.variant === 'qualification') {
    return !qualificationDraft.name.trim() || !qualificationDraft.sourceFileId || !qualificationDraft.expiresAt.trim();
  }

  return (
    !personnelDraft.personId ||
    !personnelDraft.qualificationName.trim() ||
    !personnelDraft.sourceFileId ||
    !personnelDraft.expiresAt.trim()
  );
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (submitDisabled.value) return;

  if (props.variant === 'qualification') {
    emit('submitQualification', {
      ...qualificationDraft,
      name: qualificationDraft.name.trim(),
      category: qualificationDraft.category.trim(),
      subcategory: qualificationDraft.subcategory.trim(),
      level: qualificationDraft.level.trim(),
      issuer: qualificationDraft.issuer.trim(),
      certificateNo: qualificationDraft.certificateNo.trim(),
      issuedAt: qualificationDraft.issuedAt.trim(),
      expiresAt: qualificationDraft.expiresAt.trim(),
      pageRange: qualificationDraft.pageRange.trim(),
      majorScope: qualificationDraft.majorScope.trim(),
      description: qualificationDraft.description.trim()
    });
    return;
  }

  emit('submitPersonnelQualification', {
    ...personnelDraft,
    qualificationName: personnelDraft.qualificationName.trim(),
    level: personnelDraft.level.trim(),
    issuer: personnelDraft.issuer.trim(),
    certificateNo: personnelDraft.certificateNo.trim(),
    issuedAt: personnelDraft.issuedAt.trim(),
    expiresAt: personnelDraft.expiresAt.trim(),
    pageRange: personnelDraft.pageRange.trim(),
    majorScope: personnelDraft.majorScope.trim()
  });
};

</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="editor-modal" @click.stop>
      <div class="modal-header">
        <div class="modal-heading">
          <div class="modal-icon">
            <ShieldCheck v-if="variant === 'qualification'" :size="18" />
            <UserRound v-else :size="18" />
          </div>
          <div>
            <h3>{{ modalTitle }}</h3>
            <p>条目必须关联企业素材库中已有原件文件，当前弹窗不支持上传新文件。</p>
          </div>
        </div>

        <button class="modal-close-btn" @click="handleClose">
          <X :size="18" />
        </button>
      </div>

      <form class="modal-body" @submit.prevent="handleSubmit">
        <template v-if="variant === 'qualification'">
          <div class="form-grid qualification-slim">
            <div class="form-field">
              <span class="form-label">关联素材文件 <span class="required">*</span></span>
              <div class="material-file-picker">
                <div class="search-bar">
                  <input
                    ref="materialFileInputRef"
                    v-model="materialFileSearch"
                    type="text"
                    placeholder="搜索文件名、文件夹名称"
                    class="search-input"
                    autocomplete="off"
                  />
                  <button
                    type="button"
                    class="search-icon-btn"
                    aria-label="聚焦搜索"
                    @click="focusMaterialFileInput"
                  >
                    <Search :size="18" />
                  </button>
                </div>
                <p v-if="selectedQualificationFileLabel" class="file-pick-selected-hint">
                  已选：{{ selectedQualificationFileLabel }}
                </p>
                <p
                  v-if="materialFileSearch.trim() && matchingMaterialFiles.length === 0"
                  class="file-pick-no-match"
                >
                  无匹配文件
                </p>
                <div
                  v-if="showMaterialFilePopover"
                  class="file-pick-popover"
                  role="listbox"
                  aria-label="素材文件"
                  @mousedown.prevent
                >
                  <div class="file-pick-list">
                    <button
                      v-for="file in matchingMaterialFiles"
                      :key="file.id"
                      type="button"
                      class="file-pick-row"
                      :class="{ active: qualificationDraft.sourceFileId === file.id }"
                      role="option"
                      :aria-selected="qualificationDraft.sourceFileId === file.id"
                      @click="selectQualificationSourceFile(file.id)"
                    >
                      {{ file.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <label class="form-field">
              <span class="form-label">资质名称 <span class="required">*</span></span>
              <input
                v-model="qualificationDraft.name"
                type="text"
                class="form-input"
                placeholder="如：网络安全等级保护测评机构服务认证证书"
              />
            </label>

            <label class="form-field">
              <span class="form-label">到期日期 <span class="required">*</span></span>
              <input
                v-model="qualificationDraft.expiresAt"
                type="date"
                class="form-input"
                required
              />
            </label>
          </div>
        </template>

        <template v-else>
          <div class="form-grid qualification-slim">
            <label class="form-field">
              <span class="form-label">姓名 <span class="required">*</span></span>
              <div class="material-file-picker">
                <div class="search-bar">
                  <input
                    ref="personInputRef"
                    v-model="personSearch"
                    type="text"
                    placeholder="搜索姓名、所属单位"
                    class="search-input"
                    autocomplete="off"
                    @input="handlePersonSearchInput"
                  />
                  <button
                    type="button"
                    class="search-icon-btn"
                    aria-label="聚焦人员搜索"
                    @click="focusPersonInput"
                  >
                    <Search :size="18" />
                  </button>
                </div>
                <p v-if="personSearch.trim() && matchingPersons.length === 0" class="file-pick-no-match">
                  无匹配人员
                </p>
                <div
                  v-if="showPersonPopover"
                  class="file-pick-popover"
                  role="listbox"
                  aria-label="人员列表"
                  @mousedown.prevent
                >
                  <div class="file-pick-list">
                    <button
                      v-for="person in matchingPersons"
                      :key="person.id"
                      type="button"
                      class="file-pick-row"
                      :class="{ active: personnelDraft.personId === person.id }"
                      role="option"
                      :aria-selected="personnelDraft.personId === person.id"
                      @click="selectPersonnelPerson(person.id)"
                    >
                      {{ person.name }} · {{ person.organizationName }}
                    </button>
                  </div>
                </div>
              </div>
            </label>

            <div class="form-field">
              <span class="form-label">关联素材文件 <span class="required">*</span></span>
              <div class="material-file-picker">
                <div class="search-bar">
                  <input
                    ref="materialFileInputRef"
                    v-model="materialFileSearch"
                    type="text"
                    placeholder="搜索文件名、文件夹名称"
                    class="search-input"
                    autocomplete="off"
                  />
                  <button
                    type="button"
                    class="search-icon-btn"
                    aria-label="聚焦搜索"
                    @click="focusMaterialFileInput"
                  >
                    <Search :size="18" />
                  </button>
                </div>
                <p v-if="selectedPersonnelFileLabel" class="file-pick-selected-hint">
                  已选：{{ selectedPersonnelFileLabel }}
                </p>
                <p
                  v-if="materialFileSearch.trim() && matchingMaterialFiles.length === 0"
                  class="file-pick-no-match"
                >
                  无匹配文件
                </p>
                <div
                  v-if="showMaterialFilePopover"
                  class="file-pick-popover"
                  role="listbox"
                  aria-label="素材文件"
                  @mousedown.prevent
                >
                  <div class="file-pick-list">
                    <button
                      v-for="file in matchingMaterialFiles"
                      :key="file.id"
                      type="button"
                      class="file-pick-row"
                      :class="{ active: personnelDraft.sourceFileId === file.id }"
                      role="option"
                      :aria-selected="personnelDraft.sourceFileId === file.id"
                      @click="selectPersonnelSourceFile(file.id)"
                    >
                      {{ file.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <label class="form-field">
              <span class="form-label">资质类型 <span class="required">*</span></span>
              <select v-model="personnelDraft.qualificationType" class="form-select">
                <option
                  v-for="option in personnelTypeOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </label>

            <label class="form-field">
              <span class="form-label">资质名称 <span class="required">*</span></span>
              <input
                v-model="personnelDraft.qualificationName"
                type="text"
                class="form-input"
                placeholder="如：一级建造师 / CISP"
              />
            </label>

            <label class="form-field">
              <span class="form-label">有效期 <span class="required">*</span></span>
              <input
                v-model="personnelDraft.expiresAt"
                type="date"
                class="form-input"
                required
              />
            </label>
          </div>
        </template>

        <div class="modal-footer">
          <div class="modal-footer-actions">
            <button type="button" class="btn-cancel" @click="handleClose">取消</button>
            <button type="submit" class="btn-confirm" :disabled="submitDisabled">
              <PencilLine v-if="mode === 'edit'" :size="16" />
              <Save v-else :size="16" />
              {{ submitLabel }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.46);
  padding: 24px;
}

.editor-modal {
  width: min(520px, 100%);
  max-height: min(88vh, 920px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.24);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 18px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.modal-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-heading h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.modal-heading p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #64748b;
}

.modal-close-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
}

/* Search + popover file picker (matches only; list not always visible) */
.material-file-picker {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-file-picker .search-bar {
  display: flex;
  align-items: center;
  height: 48px;
  background: #ffffff;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 0 6px 0 14px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.material-file-picker .search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #374151;
  background: transparent;
}

.material-file-picker .search-input::placeholder {
  color: #9ca3af;
}

.material-file-picker .search-icon-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #3b82f6;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.material-file-picker .search-icon-btn:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

.file-pick-selected-hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #64748b;
  word-break: break-word;
}

.file-pick-no-match {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.file-pick-popover {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: 10;
  border-radius: 10px;
  border: 1px solid #3b82f6;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  background: #ffffff;
  overflow: hidden;
}

.file-pick-list {
  max-height: 200px;
  overflow-y: auto;
  background: #f8fafc;
}

.file-pick-row {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.45;
  color: #0f172a;
  word-break: break-word;
}

.file-pick-row:last-child {
  border-bottom: none;
}

.file-pick-row:hover {
  background: #f1f5f9;
}

.file-pick-row.active {
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.file-pick-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.form-grid {
  display: grid;
  gap: 14px 16px;
}

.two-columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.qualification-slim {
  grid-template-columns: 1fr;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-width {
  margin-top: 14px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.required {
  color: #dc2626;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  color: #0f172a;
  font-size: 13px;
  line-height: 1.5;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-input,
.form-select {
  height: 42px;
  padding: 0 12px;
}

.form-textarea {
  min-height: 96px;
  padding: 10px 12px;
  resize: vertical;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.16);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
}

.modal-footer-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
}

.btn-cancel:hover {
  background: #f8fafc;
}

.btn-confirm {
  border: none;
  background: #2563eb;
  color: #ffffff;
}

.btn-confirm:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-confirm:disabled {
  cursor: not-allowed;
  background: #93c5fd;
}

@media (max-width: 760px) {
  .modal-overlay {
    padding: 12px;
  }

  .editor-modal {
    max-height: 92vh;
  }

  .two-columns {
    grid-template-columns: 1fr;
  }

  .modal-header,
  .modal-body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .modal-heading {
    gap: 10px;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-footer-actions {
    width: 100%;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
