<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, X, Edit3, Trash2, Check, ChevronDown, ChevronUp, Bell, Mail } from 'lucide-vue-next';

interface Policy {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  regions: string[];
  types: string[];
  budgetMin: string;
  budgetMax: string;
  pushTimes: string[];
  pushToApp: boolean;
  pushToEmail: boolean;
  memberCount: number;
  members: string[];
}

const policies = ref<Policy[]>([
  { id: '1', name: '安全业务组', description: '网络安全相关项目推送', keywords: ['网络安全', '渗透测试', '安全运维'], regions: ['全国', '北京', '上海'], types: ['服务类'], budgetMin: '30', budgetMax: '200', pushTimes: ['09:00'], pushToApp: true, pushToEmail: true, memberCount: 3, members: ['1', '2', '3'] },
  { id: '2', name: '等保测评组', description: '等保测评项目专属推送', keywords: ['等保测评', '等级保护', '信息安全'], regions: ['全国'], types: ['服务类'], budgetMin: '20', budgetMax: '100', pushTimes: ['09:00', '18:00'], pushToApp: true, pushToEmail: false, memberCount: 2, members: ['4', '5'] },
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
const timeOptions = ['09:00', '12:00', '18:00'];

const showEditor = ref(false);
const editingPolicy = ref<Policy | null>(null);
const regionExpanded = ref(false);

// Form state
const policyName = ref('');
const policyDesc = ref('');
const policyKeywords = ref<string[]>([]);
const policyNewKeyword = ref('');
const policyRegions = ref<string[]>([]);
const policyTypes = ref<string[]>([]);
const policyBudgetMin = ref('');
const policyBudgetMax = ref('');
const policyPushTimes = ref<string[]>([]);
const policyPushToApp = ref(true);
const policyPushToEmail = ref(false);
const selectedMembers = ref<string[]>([]);

const selectedMemberCount = computed(() => selectedMembers.value.length);

const handleCreate = () => {
  editingPolicy.value = null;
  policyName.value = '';
  policyDesc.value = '';
  policyKeywords.value = [];
  policyRegions.value = [];
  policyTypes.value = [];
  policyBudgetMin.value = '';
  policyBudgetMax.value = '';
  policyPushTimes.value = [];
  policyPushToApp.value = true;
  policyPushToEmail.value = false;
  selectedMembers.value = [];
  showEditor.value = true;
};

const handleEdit = (policy: Policy) => {
  editingPolicy.value = policy;
  policyName.value = policy.name;
  policyDesc.value = policy.description;
  policyKeywords.value = [...policy.keywords];
  policyRegions.value = [...policy.regions];
  policyTypes.value = [...policy.types];
  policyBudgetMin.value = policy.budgetMin;
  policyBudgetMax.value = policy.budgetMax;
  policyPushTimes.value = [...policy.pushTimes];
  policyPushToApp.value = policy.pushToApp;
  policyPushToEmail.value = policy.pushToEmail;
  selectedMembers.value = [...policy.members];
  showEditor.value = true;
};

const handleDelete = (id: string) => { policies.value = policies.value.filter(p => p.id !== id); };

const handleSave = () => {
  const data = { name: policyName.value, description: policyDesc.value, keywords: [...policyKeywords.value], regions: [...policyRegions.value], types: [...policyTypes.value], budgetMin: policyBudgetMin.value, budgetMax: policyBudgetMax.value, pushTimes: [...policyPushTimes.value], pushToApp: policyPushToApp.value, pushToEmail: policyPushToEmail.value, memberCount: selectedMembers.value.length, members: [...selectedMembers.value] };
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
const toggleTime = (t: string) => { policyPushTimes.value.includes(t) ? policyPushTimes.value = policyPushTimes.value.filter(x => x !== t) : policyPushTimes.value.push(t); };
const toggleMember = (id: string) => { selectedMembers.value.includes(id) ? selectedMembers.value = selectedMembers.value.filter(x => x !== id) : selectedMembers.value.push(id); };
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
              <div class="policy-desc">{{ policy.description }}</div>
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
      <div class="config-card">
        <div class="form-row">
          <label>策略名称</label>
          <div class="input-wrap"><input v-model="policyName" maxlength="15" placeholder="输入策略名称" /><span class="count">{{ policyName.length }}/15</span></div>
        </div>
        <div class="form-row">
          <label>策略简介</label>
          <div class="input-wrap"><input v-model="policyDesc" maxlength="30" placeholder="输入策略简介" /><span class="count">{{ policyDesc.length }}/30</span></div>
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
        <div class="config-row">
          <label>推送时间</label>
          <div class="config-content">
            <div class="option-btns">
              <button v-for="t in timeOptions" :key="t" :class="{ active: policyPushTimes.includes(t) }" @click="toggleTime(t)">每日{{ t }}</button>
            </div>
          </div>
        </div>
        <div class="members-section">
          <div class="members-header"><span>推送成员</span><span class="hint">至少选择1人</span></div>
          <div class="members-table">
            <div class="table-header"><span class="col-name">成员姓名</span><span class="col-email">邮箱</span><span class="col-check">选择</span></div>
            <div v-for="m in teamMembers" :key="m.id" class="member-row" @click="toggleMember(m.id)">
              <div class="col-name"><div class="avatar">{{ m.avatar }}</div><span>{{ m.name }}</span></div>
              <span class="col-email">{{ m.email || '未填写' }}</span>
              <div class="col-check"><div class="checkbox" :class="{ checked: selectedMembers.includes(m.id) }"><Check v-if="selectedMembers.includes(m.id)" :size="12" /></div></div>
            </div>
          </div>
          <div class="members-footer">已选 {{ selectedMemberCount }} 人</div>
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
.members-footer { margin-top: 12px; font-size: 13px; color: #64748b; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
.form-actions .cancel { padding: 12px 24px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; font-size: 14px; cursor: pointer; }
.form-actions .save { padding: 12px 24px; background: #3b82f6; border: none; border-radius: 8px; color: white; font-size: 14px; font-weight: 500; cursor: pointer; }
</style>
