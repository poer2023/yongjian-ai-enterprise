<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, X, Check, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import { RegionSelector } from './shared';

interface Policy {
  id: string;
  name: string;
  keywords: string[];
  regions: string[];
  types: string[];
  budgetMin: string;
  budgetMax: string;
  memberCount: number;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

const policies = ref<Policy[]>([
  {
    id: '1',
    name: '安全业务组',
    keywords: ['网络安全', '渗透测试', '安全运维'],
    regions: ['全国', '北京', '上海'],
    types: ['服务类'],
    budgetMin: '30',
    budgetMax: '200',
    memberCount: 3,
    members: ['1', '2', '3'],
    createdAt: '2026/03/28 11:55',
    updatedAt: '2026/04/14 11:09',
  },
  {
    id: '2',
    name: '等保测评组',
    keywords: ['等保测评', '等级保护', '信息安全'],
    regions: ['全国'],
    types: ['服务类'],
    budgetMin: '20',
    budgetMax: '100',
    memberCount: 2,
    members: ['4', '5'],
    createdAt: '2026/03/30 09:20',
    updatedAt: '2026/04/16 15:32',
  },
]);

const teamMembers = ref([
  { id: '1', name: '创建者', avatar: '创', email: 'creator@company.com', isCreator: true },
  { id: '2', name: 'sinder', avatar: 's', email: 'sinder@company.com' },
  { id: '3', name: '包子', avatar: '包', email: 'baozi@company.com' },
  { id: '4', name: '亚光', avatar: '亚', email: '' },
  { id: '5', name: '朱双林', avatar: '朱', email: 'zsl@company.com' },
  { id: '6', name: '子龙', avatar: '子', email: '' },
]);

const typeOptions = ['货物类', '服务类', '工程类'];
const MEMBER_PAGE_SIZE = 5;
const POLICY_PAGE_SIZE = 10;

const showEditor = ref(false);
const editingPolicy = ref<Policy | null>(null);
const memberPage = ref(1);
const policyPage = ref(1);
const searchKeyword = ref('');

// Form state
const policyName = ref('');
const policyKeywords = ref<string[]>([]);
const policyNewKeyword = ref('');
const policyRegions = ref<string[]>([]);
const policyTypes = ref<string[]>([]);
const policyBudgetMin = ref('');
const policyBudgetMax = ref('');
const selectedMembers = ref<string[]>([]);

const filteredPolicies = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) return policies.value;

  return policies.value.filter((policy) => {
    const searchable = [
      policy.name,
      policy.keywords.join(' '),
      policy.regions.join(' '),
    ].join(' ').toLowerCase();

    return searchable.includes(keyword);
  });
});

const policyTotalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredPolicies.value.length / POLICY_PAGE_SIZE));
});

const currentPolicyPage = computed(() => {
  return Math.min(policyPage.value, policyTotalPages.value);
});

const pagedPolicies = computed(() => {
  const start = (currentPolicyPage.value - 1) * POLICY_PAGE_SIZE;
  return filteredPolicies.value.slice(start, start + POLICY_PAGE_SIZE);
});

const selectedMemberCount = computed(() => selectedMembers.value.length);
const totalPages = computed(() => Math.ceil(teamMembers.value.length / MEMBER_PAGE_SIZE));
const pagedMembers = computed(() => {
  const start = (memberPage.value - 1) * MEMBER_PAGE_SIZE;
  return teamMembers.value.slice(start, start + MEMBER_PAGE_SIZE);
});

const formatNow = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  const hours = `${now.getHours()}`.padStart(2, '0');
  const minutes = `${now.getMinutes()}`.padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const handleCreate = () => {
  editingPolicy.value = null;
  policyName.value = '';
  policyKeywords.value = [];
  policyRegions.value = ['全国'];
  policyTypes.value = [];
  policyBudgetMin.value = '';
  policyBudgetMax.value = '';
  selectedMembers.value = [];
  memberPage.value = 1;
  showEditor.value = true;
};

const handleEdit = (policy: Policy) => {
  editingPolicy.value = policy;
  policyName.value = policy.name;
  policyKeywords.value = [...policy.keywords];
  policyRegions.value = [...policy.regions];
  policyTypes.value = [...policy.types];
  policyBudgetMin.value = policy.budgetMin;
  policyBudgetMax.value = policy.budgetMax;
  selectedMembers.value = [...policy.members];
  memberPage.value = 1;
  showEditor.value = true;
};

const handleDelete = (id: string) => { policies.value = policies.value.filter(p => p.id !== id); };

const handleSave = () => {
  const now = formatNow();
  const data = {
    name: policyName.value,
    keywords: [...policyKeywords.value],
    regions: [...policyRegions.value],
    types: [...policyTypes.value],
    budgetMin: policyBudgetMin.value,
    budgetMax: policyBudgetMax.value,
    memberCount: selectedMembers.value.length,
    members: [...selectedMembers.value],
    updatedAt: now,
  };
  if (editingPolicy.value) {
    const idx = policies.value.findIndex(p => p.id === editingPolicy.value!.id);
    if (idx !== -1) policies.value[idx] = { ...editingPolicy.value, ...data };
  } else {
    policies.value.push({ id: Date.now().toString(), createdAt: now, ...data });
  }
  showEditor.value = false;
};

const addKeyword = () => { const k = policyNewKeyword.value.trim(); if (k && !policyKeywords.value.includes(k)) { policyKeywords.value.push(k); policyNewKeyword.value = ''; } };
const removeKeyword = (k: string) => { policyKeywords.value = policyKeywords.value.filter(x => x !== k); };
const toggleType = (t: string) => { policyTypes.value.includes(t) ? policyTypes.value = policyTypes.value.filter(x => x !== t) : policyTypes.value.push(t); };
const toggleMember = (id: string) => { selectedMembers.value.includes(id) ? selectedMembers.value = selectedMembers.value.filter(x => x !== id) : selectedMembers.value.push(id); };
const goToPolicyPage = (page: number) => {
  policyPage.value = Math.min(Math.max(page, 1), policyTotalPages.value);
};
</script>

<template>
  <div class="bid-subscription">
    <!-- List View -->
    <div v-if="!showEditor" class="subscription-form">
      <div class="list-header">
        <h3 class="list-title">策略组</h3>
        <div class="list-header-actions">
          <div class="search-input-wrapper">
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="搜索策略组名称"
            />
            <button class="search-button" type="button" aria-label="搜索">
              <Search :size="16" />
            </button>
          </div>
          <button class="create-btn" @click="handleCreate">新建</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="policy-table">
          <thead>
            <tr>
              <th>策略组名称</th>
              <th>标讯关键词</th>
              <th>推送成员</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="policy in pagedPolicies" :key="policy.id">
              <td class="name-cell">
                <button class="name-link" @click="handleEdit(policy)">{{ policy.name }}</button>
              </td>
              <td class="keywords-cell">{{ policy.keywords.join('、') }}</td>
              <td class="member-count-cell">{{ policy.memberCount }} 人</td>
              <td class="action-cell">
                <button class="table-action edit-link" @click="handleEdit(policy)">编辑</button>
                <button class="table-action delete-link" @click="handleDelete(policy.id)">删除</button>
              </td>
            </tr>
            <tr v-if="!pagedPolicies.length">
              <td colspan="4" class="empty-cell">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-pagination">
        <button class="page-btn" :disabled="currentPolicyPage <= 1" @click="goToPolicyPage(1)">
          <ChevronsLeft :size="14" />
        </button>
        <button class="page-btn" :disabled="currentPolicyPage <= 1" @click="goToPolicyPage(currentPolicyPage - 1)">
          <ChevronLeft :size="14" />
        </button>
        <button class="page-number active">{{ currentPolicyPage }}</button>
        <button class="page-btn" :disabled="currentPolicyPage >= policyTotalPages" @click="goToPolicyPage(currentPolicyPage + 1)">
          <ChevronRight :size="14" />
        </button>
        <button class="page-btn" :disabled="currentPolicyPage >= policyTotalPages" @click="goToPolicyPage(policyTotalPages)">
          <ChevronsRight :size="14" />
        </button>
      </div>
    </div>

    <!-- Editor -->
    <div v-else class="policy-editor">
      <div class="editor-header"><h2>{{ editingPolicy ? '编辑策略组' : '新建策略组' }}</h2></div>

      <div class="config-card">
        <div class="form-row">
          <label>策略名称</label>
          <div class="input-wrap"><input v-model="policyName" maxlength="15" placeholder="输入策略名称" /><span class="count">{{ policyName.length }}/15</span></div>
        </div>

        <div class="section-title">监控配置</div>
        <div class="config-row no-divider">
          <label>标讯关键词</label>
          <div class="config-content">
            <div class="keyword-config">
              <div class="declare-add top">
                <input
                  v-model="policyNewKeyword"
                  placeholder="添加标讯关键词"
                  @keyup.enter="addKeyword"
                />
                <button @click="addKeyword">
                  <Plus :size="14" />
                </button>
              </div>
              <div class="declare-subtitle">已添加</div>
              <div class="declare-tag-list">
                <span v-if="policyKeywords.length === 0" class="declare-empty">暂未添加</span>
                <span v-for="item in policyKeywords" :key="item" class="declare-tag">
                  {{ item }}
                  <X :size="12" @click="removeKeyword(item)" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="config-row no-divider">
          <label>监控地区</label>
          <div class="config-content keyword-config">
            <RegionSelector
              v-model="policyRegions"
              national-label="全国范围"
              national-desc="监控全国各地区招投标动态"
              regional-label="指定地区"
              regional-desc="选择特定省市进行重点监控"
              selector-label="选择监控地区"
            />
          </div>
        </div>

        <!-- 推送成员 -->
        <div class="members-section">
          <div class="members-header"><span>推送成员</span><span class="hint">至少选择1人</span></div>
          <div class="members-table">
            <div class="table-header"><span class="col-name">成员姓名</span><span class="col-email">邮箱</span><span class="col-check">选择</span></div>
            <div v-for="m in pagedMembers" :key="m.id" class="member-row" @click="toggleMember(m.id)">
              <div class="col-name"><div class="avatar">{{ m.avatar }}</div><span>{{ m.name }}</span></div>
              <span class="col-email">{{ m.email || '未填写' }}</span>
              <div class="col-check"><div class="checkbox" :class="{ checked: selectedMembers.includes(m.id) }"><Check v-if="selectedMembers.includes(m.id)" :size="12" /></div></div>
            </div>
          </div>
          <div class="members-footer">
            <span>已选 {{ selectedMemberCount }} 人</span>
            <div v-if="totalPages > 1" class="pagination">
              <button :disabled="memberPage <= 1" @click="memberPage--">&lt;</button>
              <span>{{ memberPage }} / {{ totalPages }}</span>
              <button :disabled="memberPage >= totalPages" @click="memberPage++">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions"><button class="cancel" @click="showEditor = false">取消</button><button class="save" @click="handleSave">保存策略</button></div>
    </div>
  </div>
</template>

<style scoped>
.bid-subscription { width: 100%; max-width: none; }
.subscription-form, .policy-editor { width: 100%; }
.policy-editor {
  max-width: 820px;
  margin: 0 auto;
}
.config-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 34px;
}
.list-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #111111;
}
.list-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}
.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 242px;
  height: 32px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
}
.search-input {
  flex: 1;
  height: 100%;
  padding: 0 12px;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111827;
  background: transparent;
}
.search-input::placeholder {
  color: #b8b8b8;
}
.search-button {
  width: 32px;
  height: 100%;
  border: none;
  border-left: 1px solid #e6e6e6;
  background: #fff;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.create-btn {
  height: 36px;
  padding: 0 22px;
  border: none;
  border-radius: 8px;
  background: #2f6cf6;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.table-wrapper {
  overflow: hidden;
  border: 1px solid #e6eaf0;
  border-radius: 10px;
  background: #fff;
}
.policy-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.policy-table th:nth-child(1),
.policy-table td:nth-child(1) {
  width: 31%;
}
.policy-table th:nth-child(2),
.policy-table td:nth-child(2) {
  width: 38%;
}
.policy-table th:nth-child(3),
.policy-table td:nth-child(3) {
  width: 15%;
}
.policy-table th:nth-child(4),
.policy-table td:nth-child(4) {
  width: 16%;
}
.policy-table th,
.policy-table td {
  height: 40px;
  padding: 0 16px;
  border-right: 1px solid #edf0f5;
  border-bottom: 1px solid #edf0f5;
  font-size: 14px;
  color: #222222;
  text-align: center;
  vertical-align: middle;
}
.policy-table th {
  background: #fff;
  color: #111111;
  font-weight: 600;
}
.policy-table th:first-child,
.policy-table td:first-child {
  text-align: left;
}
.policy-table th:nth-child(2),
.policy-table td:nth-child(2) {
  text-align: left;
}
.policy-table th:last-child,
.policy-table td:last-child {
  border-right: none;
}
.policy-table tbody tr:last-child td {
  border-bottom: none;
}
.name-cell {
  white-space: nowrap;
}
.keywords-cell {
  min-width: 0;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.name-link {
  padding: 0;
  border: none;
  background: none;
  color: #2f6cf6;
  font-size: 14px;
  cursor: pointer;
}
.member-count-cell {
  color: #222222;
}
.action-cell {
  white-space: nowrap;
}
.table-action {
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.edit-link {
  color: #2f6cf6;
  margin-right: 28px;
}
.delete-link {
  color: #8c8c8c;
}
.empty-cell {
  padding: 28px 0;
  color: #94a3b8;
  text-align: center !important;
}
.table-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 48px;
}
.page-btn,
.page-number {
  width: 30px;
  height: 32px;
  margin-left: -1px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:first-child {
  margin-left: 0;
  border-radius: 6px 0 0 6px;
}
.page-btn:last-child {
  border-radius: 0 6px 6px 0;
}
.page-btn {
  cursor: pointer;
}
.page-number {
  cursor: default;
}
.page-number.active {
  position: relative;
  z-index: 1;
  border-color: #3b82f6;
  background: #3b82f6;
  color: #fff;
}
.page-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}
.editor-header { margin-bottom: 24px; }
.editor-header h2 { font-size: 18px; font-weight: 600; margin: 0; }
.form-row { margin-bottom: 16px; }
.form-row label { display: block; font-size: 14px; font-weight: 500; color: #475569; margin-bottom: 8px; }
.input-wrap { position: relative; }
.input-wrap input { width: 100%; padding: 12px 60px 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; }
.input-wrap .count { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #94a3b8; }
.section-title { font-size: 14px; font-weight: 600; color: #1e293b; margin: 20px 0 16px; padding-top: 0; border-top: none; }
.config-row { display: flex; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
.config-row.no-divider { border-bottom: none; }
.config-row label { width: 90px; font-size: 13px; font-weight: 500; color: #64748b; padding-top: 6px; }
.config-content { flex: 1; }
.keyword-config { display: flex; flex-direction: column; gap: 8px; }
.option-btns { display: flex; flex-wrap: wrap; gap: 8px; }
.option-btns button { padding: 6px 14px; border: 1px solid #e2e8f0; border-radius: 6px; background: white; color: #475569; font-size: 13px; cursor: pointer; }
.option-btns button.active { border-color: #3b82f6; background: #3b82f6; color: white; }
.option-btns button.expand { width: 32px; padding: 6px; border-style: dashed; color: #94a3b8; }
.budget-row { display: flex; align-items: center; gap: 8px; }
.budget-row input { width: 80px; padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; outline: none; }
.budget-row span { color: #94a3b8; font-size: 13px; }
.channel-list { display: flex; flex-direction: column; gap: 12px; }
.channel { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; min-width: 280px; }
.channel span { flex: 1; font-size: 13px; color: #475569; white-space: nowrap; }
.channel svg { color: #3b82f6; flex-shrink: 0; }
.toggle { width: 40px; height: 22px; background: #e2e8f0; border-radius: 11px; position: relative; cursor: pointer; }
.toggle.active { background: #3b82f6; }
.toggle .knob { width: 18px; height: 18px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s; }
.toggle.active .knob { transform: translateX(18px); }
.members-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.members-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 14px; font-weight: 500; color: #475569; }
.members-header .hint { font-size: 12px; color: #94a3b8; font-weight: 400; }
.members-table { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.table-header { display: flex; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 500; color: #64748b; }
.member-row { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.member-row:last-child { border-bottom: none; }
.member-row:hover { background: #f8fafc; }
.col-name { flex: 1; display: flex; align-items: center; gap: 10px; }
.col-email { flex: 1; font-size: 13px; color: #64748b; }
.col-check { width: 60px; display: flex; justify-content: center; }
.avatar { width: 32px; height: 32px; border-radius: 6px; background: #dbeafe; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
.checkbox { width: 20px; height: 20px; border: 2px solid #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.checkbox.checked { background: #3b82f6; border-color: #3b82f6; color: white; }
.members-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 13px; color: #64748b; }
.pagination { display: flex; align-items: center; gap: 8px; }
.pagination button { width: 28px; height: 28px; border: 1px solid #e2e8f0; border-radius: 6px; background: white; color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pagination button:disabled { color: #cbd5e1; cursor: not-allowed; }
.pagination span { font-size: 12px; color: #64748b; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
.form-actions .cancel { padding: 12px 24px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; font-size: 14px; cursor: pointer; }
.form-actions .save { padding: 12px 24px; background: #3b82f6; border: none; border-radius: 8px; color: white; font-size: 14px; font-weight: 500; cursor: pointer; }

/* Declarative strategy */
.declare-section { margin-top: 4px; }
.declare-row { display: flex; align-items: flex-start; gap: 12px; margin-top: 10px; }
.declare-row label { width: 110px; flex-shrink: 0; font-size: 13px; color: #64748b; padding-top: 7px; }
.declare-content { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.declare-subtitle { font-size: 12px; color: #475569; font-weight: 600; }
.declare-empty { font-size: 12px; color: #94a3b8; }
.declare-tag-list { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; border: none; background: transparent; min-height: auto; }
.declare-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; background: #e8f0ff; color: #1e40af; font-size: 12px; font-weight: 500; border: 1px solid #bfdbfe; }
.declare-tag svg { cursor: pointer; opacity: 0.75; }
.declare-tag svg:hover { opacity: 1; }
.declare-add { display: inline-flex; align-items: center; gap: 6px; }
.declare-add.top { width: 100%; }
.declare-add input { width: 100%; height: 34px; padding: 0 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; color: #1e293b; outline: none; background: white; }
.declare-add input:focus { border-color: #60a5fa; }
.declare-add button { width: 34px; height: 34px; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #3b82f6; color: white; cursor: pointer; flex-shrink: 0; }
.declare-add button:hover { background: #2563eb; }

/* Standalone sections (no top border) */
.track-section-standalone { }
.members-section-standalone { }

@media (max-width: 900px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  .list-header-actions {
    flex-direction: column;
    align-items: stretch;
    margin-left: 0;
  }
  .search-input-wrapper {
    width: 100%;
  }
  .create-btn {
    justify-content: center;
  }
  .table-wrapper {
    overflow-x: auto;
  }
  .policy-table {
    min-width: 720px;
  }
  .declare-row { flex-direction: column; gap: 6px; }
  .declare-row label { width: auto; padding-top: 0; }
  .declare-add { width: 100%; }
  .declare-add input { width: 100%; }
}
</style>
