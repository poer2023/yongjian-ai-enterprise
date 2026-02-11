<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, X, Edit3, Trash2, Check, ChevronDown, ChevronUp, Building2, Users, FileText, Search } from 'lucide-vue-next';
import { ChecklistSelector } from './shared';

const router = useRouter();

// Active sub-tab within subscription editor
const activeSubTab = ref('push-config');

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
}

const policies = ref<Policy[]>([
  { id: '1', name: '安全业务组', keywords: ['网络安全', '渗透测试', '安全运维'], regions: ['全国', '北京', '上海'], types: ['服务类'], budgetMin: '30', budgetMax: '200', memberCount: 3, members: ['1', '2', '3'] },
  { id: '2', name: '等保测评组', keywords: ['等保测评', '等级保护', '信息安全'], regions: ['全国'], types: ['服务类'], budgetMin: '20', budgetMax: '100', memberCount: 2, members: ['4', '5'] },
]);

const teamMembers = ref([
  { id: '1', name: '创建者', avatar: '创', email: 'creator@company.com', isCreator: true },
  { id: '2', name: 'sinder', avatar: 's', email: 'sinder@company.com' },
  { id: '3', name: '包子', avatar: '包', email: 'baozi@company.com' },
  { id: '4', name: '亚光', avatar: '亚', email: '' },
  { id: '5', name: '朱双林', avatar: '朱', email: 'zsl@company.com' },
  { id: '6', name: '子龙', avatar: '子', email: '' },
]);

const allRegions = ['全国', '北京', '上海', '天津', '重庆', '江苏', '浙江', '广东', '山东', '四川', '湖北', '湖南', '河南', '河北', '福建', '安徽', '江西', '陕西', '山西', '辽宁', '吉林', '黑龙江', '云南', '贵州', '甘肃', '海南', '青海', '内蒙古', '广西', '西藏', '宁夏', '新疆'];
const typeOptions = ['货物类', '服务类', '工程类'];
const PAGE_SIZE = 5;

const showEditor = ref(false);
const editingPolicy = ref<Policy | null>(null);
const regionExpanded = ref(false);
const memberPage = ref(1);

// Form state
const policyName = ref('');
const policyKeywords = ref<string[]>([]);
const policyNewKeyword = ref('');
const policyRegions = ref<string[]>([]);
const policyTypes = ref<string[]>([]);
const policyBudgetMin = ref('');
const policyBudgetMax = ref('');
const selectedMembers = ref<string[]>([]);

const selectedMemberCount = computed(() => selectedMembers.value.length);
const totalPages = computed(() => Math.ceil(teamMembers.value.length / PAGE_SIZE));
const pagedMembers = computed(() => {
  const start = (memberPage.value - 1) * PAGE_SIZE;
  return teamMembers.value.slice(start, start + PAGE_SIZE);
});

const handleCreate = () => {
  editingPolicy.value = null;
  policyName.value = '';
  policyKeywords.value = [];
  policyRegions.value = [];
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
  const data = { name: policyName.value, keywords: [...policyKeywords.value], regions: [...policyRegions.value], types: [...policyTypes.value], budgetMin: policyBudgetMin.value, budgetMax: policyBudgetMax.value, memberCount: selectedMembers.value.length, members: [...selectedMembers.value] };
  if (editingPolicy.value) {
    const idx = policies.value.findIndex(p => p.id === editingPolicy.value!.id);
    if (idx !== -1) policies.value[idx] = { ...editingPolicy.value, ...data };
  } else {
    policies.value.push({ id: Date.now().toString(), ...data });
  }
  showEditor.value = false;
};

const addKeyword = () => { const k = policyNewKeyword.value.trim(); if (k && !policyKeywords.value.includes(k)) { policyKeywords.value.push(k); policyNewKeyword.value = ''; } };
const removeKeyword = (k: string) => { policyKeywords.value = policyKeywords.value.filter(x => x !== k); };
const toggleRegion = (r: string) => { policyRegions.value.includes(r) ? policyRegions.value = policyRegions.value.filter(x => x !== r) : policyRegions.value.push(r); };
const toggleType = (t: string) => { policyTypes.value.includes(t) ? policyTypes.value = policyTypes.value.filter(x => x !== t) : policyTypes.value.push(t); };
const toggleMember = (id: string) => { selectedMembers.value.includes(id) ? selectedMembers.value = selectedMembers.value.filter(x => x !== id) : selectedMembers.value.push(id); };

// ===== Bidding Units =====
const buSearch = ref('');
const buItems = ref([
  { id: 'bu1', name: '上海市大数据中心', desc: '事业单位 · 上海' },
  { id: 'bu2', name: '浦东新区政务服务中心', desc: '政府机关 · 上海' },
  { id: 'bu3', name: '中国工商银行上海分行', desc: '金融机构 · 上海' },
  { id: 'bu4', name: '复旦大学信息化办公室', desc: '教育机构 · 上海' },
]);
const extraBuItems = [
  { id: 'bux1', name: '杭州市数据资源管理局', desc: '政府机关 · 浙江' },
  { id: 'bux2', name: '南京大学', desc: '教育机构 · 江苏' },
  { id: 'bux3', name: '中国农业银行上海分行', desc: '金融机构 · 上海' },
  { id: 'bux4', name: '上海市交通委员会', desc: '政府机关 · 上海' },
];
const selectedBuIds = ref<string[]>(['bu1', 'bu2', 'bu3', 'bu4']);
const buSearchResults = computed(() => {
  if (!buSearch.value.trim()) return [];
  const q = buSearch.value.toLowerCase();
  const existingIds = new Set(buItems.value.map(i => i.id));
  return extraBuItems.filter(i => !existingIds.has(i.id) && (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)));
});
const addBu = (item: { id: string; name: string; desc: string }) => { buItems.value.push(item); selectedBuIds.value.push(item.id); buSearch.value = ''; };

// ===== Competitors =====
const compSearch = ref('');
const compItems = ref([
  { id: 'c1', name: '华安信息技术有限公司', desc: '网络安全 · 北京' },
  { id: 'c2', name: '中科安全科技股份', desc: '网络安全 · 北京' },
  { id: 'c3', name: '启明星辰科技', desc: '网络安全 · 北京' },
  { id: 'c4', name: '绿盟科技集团', desc: '网络安全 · 北京' },
  { id: 'c5', name: '奇安信科技集团', desc: '网络安全 · 北京' },
]);
const extraCompItems = [
  { id: 'cx1', name: '知道创宇科技', desc: '网络安全 · 北京' },
  { id: 'cx2', name: '长亭科技有限公司', desc: '网络安全 · 北京' },
  { id: 'cx3', name: '微步在线科技', desc: '威胁情报 · 北京' },
  { id: 'cx4', name: '安天科技集团', desc: '网络安全 · 黑龙江' },
];
const selectedCompIds = ref<string[]>(['c1', 'c2', 'c3', 'c4', 'c5']);
const compSearchResults = computed(() => {
  if (!compSearch.value.trim()) return [];
  const q = compSearch.value.toLowerCase();
  const existingIds = new Set(compItems.value.map(i => i.id));
  return extraCompItems.filter(i => !existingIds.has(i.id) && (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)));
});
const addComp = (item: { id: string; name: string; desc: string }) => { compItems.value.push(item); selectedCompIds.value.push(item.id); compSearch.value = ''; };

// ===== Bid Notices =====
const bnSearch = ref('');
const bnItems = ref([
  { id: 'bn1', name: '某证券公司网络安全态势感知平台', desc: '上海证券交易所 · 280万 · 2026-02-01' },
]);
const extraBnItems = [
  { id: 'bnx1', name: '某省交通厅网络安全等保测评', desc: '浙江省交通厅 · 220万 · 2026-03-15' },
  { id: 'bnx2', name: '某高校校园网安全加固项目', desc: '华东师范大学 · 85万 · 2026-03-20' },
  { id: 'bnx3', name: '某银行数据中心安全评估', desc: '兴业银行上海分行 · 160万 · 2026-04-01' },
];
const selectedBnIds = ref<string[]>(['bn1']);
const bnSearchResults = computed(() => {
  if (!bnSearch.value.trim()) return [];
  const q = bnSearch.value.toLowerCase();
  const existingIds = new Set(bnItems.value.map(i => i.id));
  return extraBnItems.filter(i => !existingIds.has(i.id) && (i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)));
});
const addBn = (item: { id: string; name: string; desc: string }) => { bnItems.value.push(item); selectedBnIds.value.push(item.id); bnSearch.value = ''; };
</script>

<template>
  <div class="bid-subscription">
    <div class="content-header">
      <h1 class="page-title">标讯订阅</h1>
      <p class="page-subtitle">每个策略组可独立配置关键词/地区，AI智能匹配推送给对应成员</p>
    </div>

    <!-- List View -->
    <div v-if="!showEditor" class="subscription-form">
      <div class="config-card">
        <div class="card-header">
          <div class="card-title-group">
            <h3 class="card-title">策略组</h3>
            <span class="card-subtitle">每个策略组可独立配置监控条件和推送成员</span>
          </div>
          <button class="create-btn" @click="handleCreate"><Plus :size="14" />新建</button>
        </div>
        <div class="policy-list">
          <div v-for="policy in policies" :key="policy.id" class="policy-item">
            <div class="policy-info">
              <div class="policy-name">{{ policy.name }}</div>
              <div class="policy-tags">
                <span class="tag" v-for="k in policy.keywords.slice(0, 3)" :key="k">{{ k }}</span>
                <span class="tag region" v-for="r in policy.regions.slice(0, 2)" :key="r">{{ r }}</span>
              </div>
            </div>
            <div class="policy-actions">
              <span class="member-count">{{ policy.memberCount }} 人</span>
              <button class="action-btn edit" @click="handleEdit(policy)"><Edit3 :size="14" /></button>
              <button class="action-btn delete" @click="handleDelete(policy.id)"><Trash2 :size="14" /></button>
            </div>
          </div>
          <div v-if="policies.length === 0" class="empty">暂无策略组，点击上方按钮新建</div>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div v-else class="policy-editor">
      <div class="editor-header"><h2>{{ editingPolicy ? '编辑策略组' : '新建策略组' }}</h2></div>

      <!-- Sub tabs -->
      <div class="sub-tabs">
        <button :class="['sub-tab', { active: activeSubTab === 'push-config' }]" @click="activeSubTab = 'push-config'">
          <Search :size="14" />
          <span>推送配置</span>
        </button>
        <button :class="['sub-tab', { active: activeSubTab === 'sales-strategy' }]" @click="activeSubTab = 'sales-strategy'">
          <Building2 :size="14" />
          <span>销售策略</span>
        </button>
      </div>

      <!-- Tab: 推送配置 (监控配置 + 推送成员) -->
      <div v-if="activeSubTab === 'push-config'" class="config-card">
        <div class="form-row">
          <label>策略名称</label>
          <div class="input-wrap"><input v-model="policyName" maxlength="15" placeholder="输入策略名称" /><span class="count">{{ policyName.length }}/15</span></div>
        </div>

        <div class="section-title">监控配置</div>
        <div class="config-row">
          <label>监控关键词</label>
          <div class="config-content">
            <div class="keyword-inline">
              <span v-for="k in policyKeywords" :key="k" class="keyword-tag">{{ k }}<X :size="12" @click="removeKeyword(k)" /></span>
              <div class="keyword-add"><input v-model="policyNewKeyword" placeholder="添加" @keyup.enter="addKeyword" /><button @click="addKeyword"><Plus :size="14" /></button></div>
            </div>
          </div>
        </div>
        <div class="config-row">
          <label>监控地区</label>
          <div class="config-content">
            <div class="option-btns">
              <template v-if="!regionExpanded">
                <button v-for="r in (policyRegions.length > 0 ? policyRegions : ['全国'])" :key="r" class="active" @click="toggleRegion(r)">{{ r }}</button>
                <button class="expand" @click="regionExpanded = true"><ChevronDown :size="14" /></button>
              </template>
              <template v-else>
                <button v-for="r in allRegions" :key="r" :class="{ active: policyRegions.includes(r) }" @click="toggleRegion(r)">{{ r }}</button>
                <button class="expand" @click="regionExpanded = false"><ChevronUp :size="14" /></button>
              </template>
            </div>
          </div>
        </div>
        <div class="config-row">
          <label>项目类型</label>
          <div class="config-content">
            <div class="option-btns">
              <button v-for="t in typeOptions" :key="t" :class="{ active: policyTypes.includes(t) }" @click="toggleType(t)">{{ t }}</button>
            </div>
          </div>
        </div>
        <div class="config-row">
          <label>预算范围</label>
          <div class="config-content">
            <div class="budget-row"><input v-model="policyBudgetMin" placeholder="最低" /><span>-</span><input v-model="policyBudgetMax" placeholder="最高" /><span>万元</span></div>
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

      <!-- Tab: 销售策略 (招标单位 + 竞品企业 + 关注标讯) -->
      <div v-else-if="activeSubTab === 'sales-strategy'" class="config-card">
        <!-- 招标单位 -->
        <div class="track-section-standalone">
          <div class="track-header">
            <div class="track-header-left">
              <Building2 :size="16" class="track-icon" />
              <span class="track-title">关注的招标单位</span>
              <span class="track-tag">选填</span>
              <span v-if="selectedBuIds.length" class="track-count">{{ selectedBuIds.length }}</span>
            </div>
            <div class="track-search">
              <Search :size="12" />
              <input type="text" v-model="buSearch" placeholder="搜索招标单位..." class="track-search-input" />
            </div>
          </div>
          <div class="track-body">
            <div v-if="buSearch.trim()" class="track-results">
              <div class="track-results-label">搜索结果</div>
              <div v-if="buSearchResults.length" class="track-results-grid">
                <button v-for="item in buSearchResults" :key="item.id" class="track-result-item" @click="addBu(item)">
                  <Plus :size="11" class="track-result-add" />
                  <span class="track-result-name">{{ item.name }}</span>
                  <span class="track-result-desc">{{ item.desc }}</span>
                </button>
              </div>
              <div v-else class="track-results-empty">暂无匹配结果</div>
            </div>
            <ChecklistSelector :items="buItems" v-model="selectedBuIds" />
          </div>
        </div>

        <!-- 竞品企业 -->
        <div class="track-section">
          <div class="track-header">
            <div class="track-header-left">
              <Users :size="16" class="track-icon" />
              <span class="track-title">竞品企业</span>
              <span class="track-tag">选填</span>
              <span v-if="selectedCompIds.length" class="track-count">{{ selectedCompIds.length }}</span>
            </div>
            <div class="track-search">
              <Search :size="12" />
              <input type="text" v-model="compSearch" placeholder="搜索竞品企业..." class="track-search-input" />
            </div>
          </div>
          <div class="track-body">
            <div v-if="compSearch.trim()" class="track-results">
              <div class="track-results-label">搜索结果</div>
              <div v-if="compSearchResults.length" class="track-results-grid">
                <button v-for="item in compSearchResults" :key="item.id" class="track-result-item" @click="addComp(item)">
                  <Plus :size="11" class="track-result-add" />
                  <span class="track-result-name">{{ item.name }}</span>
                  <span class="track-result-desc">{{ item.desc }}</span>
                </button>
              </div>
              <div v-else class="track-results-empty">暂无匹配结果</div>
            </div>
            <ChecklistSelector :items="compItems" v-model="selectedCompIds" />
          </div>
        </div>

        <!-- 关注标讯 -->
        <div class="track-section">
          <div class="track-header">
            <div class="track-header-left">
              <FileText :size="16" class="track-icon" />
              <span class="track-title">关注的标讯</span>
              <span class="track-tag">选填</span>
              <span v-if="selectedBnIds.length" class="track-count">{{ selectedBnIds.length }}</span>
            </div>
            <div class="track-search">
              <Search :size="12" />
              <input type="text" v-model="bnSearch" placeholder="搜索标讯..." class="track-search-input" />
            </div>
          </div>
          <div class="track-body">
            <div v-if="bnSearch.trim()" class="track-results">
              <div class="track-results-label">搜索结果</div>
              <div v-if="bnSearchResults.length" class="track-results-grid">
                <button v-for="item in bnSearchResults" :key="item.id" class="track-result-item" @click="addBn(item)">
                  <Plus :size="11" class="track-result-add" />
                  <span class="track-result-name">{{ item.name }}</span>
                  <span class="track-result-desc">{{ item.desc }}</span>
                </button>
              </div>
              <div v-else class="track-results-empty">暂无匹配结果</div>
            </div>
            <ChecklistSelector :items="bnItems" v-model="selectedBnIds" />
          </div>
        </div>
      </div>

      <div class="form-actions"><button class="cancel" @click="showEditor = false">取消</button><button class="save" @click="handleSave">保存策略</button></div>
    </div>
  </div>
</template>

<style scoped>
.bid-subscription { width: 100%; max-width: 700px; }
.content-header { margin-bottom: 24px; }
.page-title { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0; }
.page-subtitle { font-size: 14px; color: #64748b; margin: 4px 0 0; }
.subscription-form, .policy-editor { width: 100%; }
.config-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.card-title-group { display: flex; flex-direction: column; gap: 2px; }
.card-title { font-size: 15px; font-weight: 600; color: #1e293b; margin: 0; }
.card-subtitle { font-size: 12px; color: #94a3b8; }
.create-btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; background: #3b82f6; border: none; border-radius: 6px; color: white; font-size: 13px; font-weight: 500; cursor: pointer; }
.policy-list { display: flex; flex-direction: column; gap: 8px; }
.policy-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
.policy-info { flex: 1; }
.policy-name { font-size: 14px; font-weight: 600; color: #1e293b; }
.policy-desc { font-size: 12px; color: #64748b; margin: 2px 0 8px; }
.policy-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { padding: 2px 8px; background: #eff6ff; color: #3b82f6; border-radius: 4px; font-size: 11px; }
.tag.region { background: #f0fdf4; color: #16a34a; }
.policy-actions { display: flex; align-items: center; gap: 10px; }
.member-count { font-size: 12px; color: #3b82f6; background: #dbeafe; padding: 3px 8px; border-radius: 4px; }
.action-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid #e2e8f0; background: white; cursor: pointer; }
.action-btn.edit { color: #64748b; }
.action-btn.delete { color: #ef4444; }
.empty { padding: 32px; text-align: center; color: #94a3b8; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 8px; }
.editor-header { margin-bottom: 24px; }
.editor-header h2 { font-size: 18px; font-weight: 600; margin: 0; }
.form-row { margin-bottom: 16px; }
.form-row label { display: block; font-size: 14px; font-weight: 500; color: #475569; margin-bottom: 8px; }
.input-wrap { position: relative; }
.input-wrap input { width: 100%; padding: 12px 60px 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; }
.input-wrap .count { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #94a3b8; }
.section-title { font-size: 14px; font-weight: 600; color: #1e293b; margin: 20px 0 16px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.config-row { display: flex; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
.config-row label { width: 90px; font-size: 13px; font-weight: 500; color: #64748b; padding-top: 6px; }
.config-content { flex: 1; }
.keyword-inline { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.keyword-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #dbeafe; color: #3b82f6; border-radius: 4px; font-size: 12px; }
.keyword-tag svg { cursor: pointer; opacity: 0.7; }
.keyword-add { display: flex; gap: 6px; }
.keyword-add input { width: 100px; padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; outline: none; }
.keyword-add button { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; }
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

/* Track sections (bidding units, competitors, bid notices) */
.track-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.track-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.track-header-left { display: flex; align-items: center; gap: 6px; }
.track-icon { color: #3b82f6; }
.track-title { font-size: 14px; font-weight: 600; color: #1e293b; }
.track-tag { font-size: 11px; color: #94a3b8; background: #f1f5f9; padding: 1px 6px; border-radius: 4px; }
.track-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; background: #2563eb; color: white; font-size: 11px; font-weight: 600; border-radius: 9px; }
.track-search { display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; transition: all 0.2s; min-width: 160px; }
.track-search:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
.track-search svg { color: #94a3b8; flex-shrink: 0; }
.track-search-input { flex: 1; border: none; background: transparent; font-size: 12px; color: #1e293b; outline: none; min-width: 0; }
.track-search-input::placeholder { color: #c0c9d4; }
.track-body { }
.track-results { margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #e2e8f0; }
.track-results-label { font-size: 11px; color: #3b82f6; font-weight: 600; margin-bottom: 6px; }
.track-results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.track-result-item { display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 8px 10px; padding-right: 28px; background: #f0f7ff; border: 1px dashed #93c5fd; border-radius: 8px; cursor: pointer; transition: all 0.15s; text-align: left; position: relative; }
.track-result-item:hover { background: #dbeafe; border-color: #3b82f6; border-style: solid; }
.track-result-add { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); color: #3b82f6; }
.track-result-name { font-size: 12px; font-weight: 500; color: #1e40af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 16px; }
.track-result-desc { font-size: 10px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track-results-empty { text-align: center; padding: 10px; color: #94a3b8; font-size: 12px; }

/* Sub tabs */
.sub-tabs { display: flex; gap: 0; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
.sub-tab { display: flex; align-items: center; gap: 6px; padding: 10px 16px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.sub-tab:hover { color: #334155; background: #f8fafc; }
.sub-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }
.sub-tab svg { flex-shrink: 0; }
.sub-tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; background: #dbeafe; color: #3b82f6; font-size: 11px; font-weight: 600; border-radius: 9px; }
.sub-tab.active .sub-tab-count { background: #3b82f6; color: white; }

/* Standalone sections (no top border) */
.track-section-standalone { }
.members-section-standalone { }
</style>

<!-- Unscoped styles to override child component ChecklistSelector -->
<style>
.bid-subscription .policy-editor .checklist-item {
  border-color: #3b82f6;
  background: #eff6ff;
}

.bid-subscription .policy-editor .checklist-remove {
  opacity: 1;
  color: #3b82f6;
}

.bid-subscription .policy-editor .checklist-remove:hover {
  background: #fee2e2;
  color: #ef4444;
}
</style>
