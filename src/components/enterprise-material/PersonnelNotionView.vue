<script setup lang="ts">
import { computed, ref } from 'vue';
import { Search, X } from 'lucide-vue-next';
import type { Person, PersonQualification } from './types';

const props = defineProps<{
  persons: Person[];
  activePersonId?: string | null;
}>();

const emit = defineEmits<{
  openDetail: [person: Person];
}>();

type QualType = PersonQualification['qualificationType'] | '';
type StatusType = PersonQualification['status'] | '';

// Filter state — each dimension is independent
const filterName = ref('');
const filterQualType = ref<QualType>('');
const filterStatus = ref<StatusType>('');

// Flatten: one row per person × qualification
interface FlatRow {
  person: Person;
  qual: PersonQualification;
  rowKey: string;
}

const allRows = computed<FlatRow[]>(() => {
  const rows: FlatRow[] = [];
  for (const person of props.persons) {
    for (const qual of person.qualifications) {
      rows.push({ person, qual, rowKey: `${person.id}__${qual.id}` });
    }
  }
  return rows;
});

// Collect available qual types from actual data
const availableQualTypes = computed<PersonQualification['qualificationType'][]>(() => {
  const order: PersonQualification['qualificationType'][] = ['执业资格', '注册证', '职称', '认证', '其他'];
  const present = new Set(allRows.value.map((r) => r.qual.qualificationType));
  return order.filter((t) => present.has(t));
});

const hasActiveFilter = computed(
  () => filterName.value.trim() !== '' || filterQualType.value !== '' || filterStatus.value !== ''
);

const filteredRows = computed<FlatRow[]>(() => {
  const name = filterName.value.trim().toLowerCase();
  return allRows.value.filter((r) => {
    if (name && !r.person.name.toLowerCase().includes(name)) return false;
    if (filterQualType.value && r.qual.qualificationType !== filterQualType.value) return false;
    if (filterStatus.value && r.qual.status !== filterStatus.value) return false;
    return true;
  });
});

const clearFilters = () => {
  filterName.value = '';
  filterQualType.value = '';
  filterStatus.value = '';
};

const statusLabel = (q: PersonQualification) => {
  if (q.status === 'expired') return '已过期';
  if (q.status === 'suspended') return '暂停';
  return '有效';
};

const statusClass = (q: PersonQualification) => {
  if (q.status === 'expired') return 'status-expired';
  if (q.status === 'suspended') return 'status-suspended';
  return 'status-valid';
};

const expiryDisplay = (q: PersonQualification) => {
  if (!q.expiresAt) return '长期';
  return q.expiresAt;
};

const qualNameDisplay = (q: PersonQualification) =>
  q.level ? `${q.qualificationName}（${q.level}）` : q.qualificationName;
</script>

<template>
  <div class="personnel-wrap">
    <!-- Multi-dimensional filter bar -->
    <div class="filter-bar">
      <!-- Name search -->
      <div class="filter-input-wrap">
        <Search class="filter-input-icon" :size="13" />
        <input
          v-model="filterName"
          type="text"
          class="filter-input"
          placeholder="搜索姓名…"
        />
      </div>

      <!-- Qualification type -->
      <select v-model="filterQualType" class="filter-select">
        <option value="">全部类型</option>
        <option v-for="t in availableQualTypes" :key="t" :value="t">{{ t }}</option>
      </select>

      <!-- Status -->
      <select v-model="filterStatus" class="filter-select">
        <option value="">全部状态</option>
        <option value="valid">有效</option>
        <option value="expired">已过期</option>
        <option value="suspended">暂停</option>
      </select>

      <!-- Clear button — only when a filter is active -->
      <button
        v-if="hasActiveFilter"
        type="button"
        class="filter-clear"
        @click="clearFilters"
      >
        <X :size="12" />
        <span>清除</span>
      </button>

      <span class="filter-count">{{ filteredRows.length }} 条</span>
    </div>

    <!-- Flat table (reuse qualification table structure) -->
    <div class="table-wrap">
      <table class="matter-table" role="grid">
        <colgroup>
          <col class="col-idx">
          <col class="col-name">
          <col class="col-type">
          <col class="col-qual-name">
          <col class="col-expiry">
          <col class="col-status">
          <col class="col-act">
        </colgroup>
        <thead>
          <tr>
            <th class="col-idx" scope="col">#</th>
            <th scope="col">姓名</th>
            <th scope="col">资质类型</th>
            <th scope="col">资质名称</th>
            <th scope="col">有效期至</th>
            <th class="col-status" scope="col">状态</th>
            <th class="col-act" scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in filteredRows"
            :key="row.rowKey"
            class="matter-row"
            :class="{ active: row.person.id === activePersonId }"
            :data-person-id="row.person.id"
          >
            <td class="cell-num">{{ idx + 1 }}</td>
            <td class="cell-name cell-name-nowrap">{{ row.person.name }}</td>
            <td>
              <span class="type-tag">{{ row.qual.qualificationType }}</span>
            </td>
            <td class="cell-muted cell-qual-name" :title="qualNameDisplay(row.qual)">
              {{ qualNameDisplay(row.qual) }}
            </td>
            <td class="cell-muted cell-expiry">{{ expiryDisplay(row.qual) }}</td>
            <td class="cell-status">
              <span class="status-tag" :class="statusClass(row.qual)">
                {{ statusLabel(row.qual) }}
              </span>
            </td>
            <td class="cell-act">
              <button
                type="button"
                class="row-link"
                @click="emit('openDetail', row.person)"
              >
                人员详情
              </button>
            </td>
          </tr>

          <tr v-if="filteredRows.length === 0">
            <td colspan="7" class="empty-cell">暂无符合条件的资质记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.personnel-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Name search input */
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
  width: 130px;
  outline: none;
  transition: border-color 0.12s ease;
}

.filter-input::placeholder {
  color: #94a3b8;
}

.filter-input:focus {
  border-color: #93c5fd;
}

/* Dropdowns */
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

.filter-select:focus {
  border-color: #93c5fd;
}

/* Clear button */
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
  color: #94a3b8;
  white-space: nowrap;
  margin-left: auto;
}

/* Table (aligned with GroupedMaterialList) */
.table-wrap {
  overflow-x: auto;
}

.matter-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 1.45;
  color: #0f172a;
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

.col-idx { width: 36px; }
.col-name { width: 72px; }
.col-type { width: 88px; }
.col-qual-name { width: auto; }
.col-expiry { width: 72px; }
.col-status { width: 72px; }
.col-act { width: 88px; text-align: right; }

.cell-num {
  color: #9b9a97;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.cell-name {
  font-weight: 500;
  color: #0f172a;
}

.cell-name-nowrap,
.cell-expiry,
.cell-act {
  white-space: nowrap;
}

.cell-qual-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-muted {
  color: #475569;
}

.cell-status {
  white-space: nowrap;
}

.cell-act {
  text-align: right;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 1px 6px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.status-valid {
  color: #166534;
  background: #dcfce7;
}

.status-expired {
  color: #b91c1c;
  background: #fee2e2;
}

.status-suspended {
  color: #9a3412;
  background: #ffedd5;
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
  white-space: nowrap;
}

.row-link:hover {
  color: #1d4ed8;
}

.empty-cell {
  text-align: center;
  padding: 32px;
  color: #94a3b8;
  font-size: 13px;
}
</style>
