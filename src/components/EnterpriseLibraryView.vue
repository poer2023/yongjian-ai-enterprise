<script setup lang="ts">
import { ref, computed } from 'vue';
import { Database, Building2, Users, FileText, Plus, X, Check } from 'lucide-vue-next';

const activeTab = ref<'bidding-units' | 'competitors' | 'bid-notices'>('bidding-units');

const tabs = [
  { id: 'bidding-units' as const, label: '招标单位', icon: Building2 },
  { id: 'competitors' as const, label: '竞品企业', icon: Users },
  { id: 'bid-notices' as const, label: '关注标讯', icon: FileText },
];

interface LibraryItem {
  id: string;
  name: string;
  type: string;
  region: string;
}

// ===== Bidding Units =====
const buItems = ref<LibraryItem[]>([
  { id: 'bu1', name: '上海市大数据中心', type: '事业单位', region: '上海' },
  { id: 'bu2', name: '浦东新区政务服务中心', type: '政府机关', region: '上海' },
  { id: 'bu3', name: '中国工商银行上海分行', type: '金融机构', region: '上海' },
  { id: 'bu4', name: '复旦大学信息化办公室', type: '教育机构', region: '上海' },
]);
const buAdding = ref(false);
const buNewName = ref('');
const buNewType = ref('');
const buNewRegion = ref('');
const addBu = () => {
  if (!buNewName.value.trim()) return;
  buItems.value.push({ id: `bu${Date.now()}`, name: buNewName.value.trim(), type: buNewType.value.trim() || '未分类', region: buNewRegion.value.trim() || '未指定' });
  buNewName.value = ''; buNewType.value = ''; buNewRegion.value = ''; buAdding.value = false;
};
const removeBu = (id: string) => { buItems.value = buItems.value.filter(i => i.id !== id); };

// ===== Competitors =====
const compItems = ref<LibraryItem[]>([
  { id: 'c1', name: '华安信息技术有限公司', type: '网络安全', region: '北京' },
  { id: 'c2', name: '中科安全科技股份', type: '网络安全', region: '北京' },
  { id: 'c3', name: '启明星辰科技', type: '网络安全', region: '北京' },
  { id: 'c4', name: '绿盟科技集团', type: '网络安全', region: '北京' },
  { id: 'c5', name: '奇安信科技集团', type: '网络安全', region: '北京' },
]);
const compAdding = ref(false);
const compNewName = ref('');
const compNewType = ref('');
const compNewRegion = ref('');
const addComp = () => {
  if (!compNewName.value.trim()) return;
  compItems.value.push({ id: `c${Date.now()}`, name: compNewName.value.trim(), type: compNewType.value.trim() || '未分类', region: compNewRegion.value.trim() || '未指定' });
  compNewName.value = ''; compNewType.value = ''; compNewRegion.value = ''; compAdding.value = false;
};
const removeComp = (id: string) => { compItems.value = compItems.value.filter(i => i.id !== id); };

// ===== Bid Notices =====
interface BidNoticeItem {
  id: string;
  name: string;
  client: string;
  budget: string;
}
const bnItems = ref<BidNoticeItem[]>([
  { id: 'bn1', name: '某证券公司网络安全态势感知平台', client: '上海证券交易所', budget: '280万' },
  { id: 'bn2', name: '某省交通厅网络安全等保测评', client: '浙江省交通厅', budget: '220万' },
]);
const bnAdding = ref(false);
const bnNewName = ref('');
const bnNewClient = ref('');
const bnNewBudget = ref('');
const addBn = () => {
  if (!bnNewName.value.trim()) return;
  bnItems.value.push({ id: `bn${Date.now()}`, name: bnNewName.value.trim(), client: bnNewClient.value.trim() || '未指定', budget: bnNewBudget.value.trim() || '未知' });
  bnNewName.value = ''; bnNewClient.value = ''; bnNewBudget.value = ''; bnAdding.value = false;
};
const removeBn = (id: string) => { bnItems.value = bnItems.value.filter(i => i.id !== id); };

const tabCounts = computed(() => ({
  'bidding-units': buItems.value.length,
  'competitors': compItems.value.length,
  'bid-notices': bnItems.value.length,
}));

const currentAdding = computed(() => {
  if (activeTab.value === 'bidding-units') return buAdding.value;
  if (activeTab.value === 'competitors') return compAdding.value;
  return bnAdding.value;
});

const toggleAdding = () => {
  if (activeTab.value === 'bidding-units') buAdding.value = !buAdding.value;
  else if (activeTab.value === 'competitors') compAdding.value = !compAdding.value;
  else bnAdding.value = !bnAdding.value;
};
</script>

<template>
  <div class="enterprise-library">
    <div class="content-header">
      <div class="header-icon">
        <Database :size="22" />
      </div>
      <div>
        <h1 class="page-title">企业总库</h1>
        <p class="page-subtitle">管理关注的招标单位、竞品企业和标讯，供团队成员在销售策略分析中使用</p>
      </div>
    </div>

    <div class="config-card">
      <!-- Tabs -->
      <div class="lib-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['lib-tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" :size="15" />
          <span>{{ tab.label }}</span>
          <span class="tab-count">{{ tabCounts[tab.id] }}</span>
        </button>
      </div>

      <!-- Tab toolbar -->
      <div class="tab-toolbar">
        <span class="toolbar-hint">共 {{ tabCounts[activeTab] }} 条记录</span>
        <button class="add-btn" @click="toggleAdding"><Plus :size="14" />录入</button>
      </div>

      <!-- Tab: 招标单位 -->
      <div v-if="activeTab === 'bidding-units'">
        <div v-if="buAdding" class="add-form">
          <div class="add-form-row">
            <input v-model="buNewName" placeholder="单位名称（必填）" class="add-input main" @keyup.enter="addBu" />
            <input v-model="buNewType" placeholder="类型，如 政府机关" class="add-input" />
            <input v-model="buNewRegion" placeholder="地区，如 上海" class="add-input" />
            <button class="add-confirm" @click="addBu"><Check :size="14" /></button>
            <button class="add-cancel" @click="buAdding = false"><X :size="14" /></button>
          </div>
        </div>
        <div class="item-list">
          <div v-for="item in buItems" :key="item.id" class="item-row">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-tag">{{ item.type }}</span>
              <span class="item-tag region">{{ item.region }}</span>
            </div>
            <button class="item-remove" @click="removeBu(item.id)"><X :size="14" /></button>
          </div>
          <div v-if="buItems.length === 0" class="item-empty">暂无数据，点击「录入」添加招标单位</div>
        </div>
      </div>

      <!-- Tab: 竞品企业 -->
      <div v-else-if="activeTab === 'competitors'">
        <div v-if="compAdding" class="add-form">
          <div class="add-form-row">
            <input v-model="compNewName" placeholder="企业名称（必填）" class="add-input main" @keyup.enter="addComp" />
            <input v-model="compNewType" placeholder="行业，如 网络安全" class="add-input" />
            <input v-model="compNewRegion" placeholder="地区，如 北京" class="add-input" />
            <button class="add-confirm" @click="addComp"><Check :size="14" /></button>
            <button class="add-cancel" @click="compAdding = false"><X :size="14" /></button>
          </div>
        </div>
        <div class="item-list">
          <div v-for="item in compItems" :key="item.id" class="item-row">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-tag">{{ item.type }}</span>
              <span class="item-tag region">{{ item.region }}</span>
            </div>
            <button class="item-remove" @click="removeComp(item.id)"><X :size="14" /></button>
          </div>
          <div v-if="compItems.length === 0" class="item-empty">暂无数据，点击「录入」添加竞品企业</div>
        </div>
      </div>

      <!-- Tab: 关注标讯 -->
      <div v-else>
        <div v-if="bnAdding" class="add-form">
          <div class="add-form-row">
            <input v-model="bnNewName" placeholder="项目名称（必填）" class="add-input main" @keyup.enter="addBn" />
            <input v-model="bnNewClient" placeholder="招标单位" class="add-input" />
            <input v-model="bnNewBudget" placeholder="预算，如 200万" class="add-input short" />
            <button class="add-confirm" @click="addBn"><Check :size="14" /></button>
            <button class="add-cancel" @click="bnAdding = false"><X :size="14" /></button>
          </div>
        </div>
        <div class="item-list">
          <div v-for="item in bnItems" :key="item.id" class="item-row">
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-tag">{{ item.client }}</span>
              <span class="item-tag budget">{{ item.budget }}</span>
            </div>
            <button class="item-remove" @click="removeBn(item.id)"><X :size="14" /></button>
          </div>
          <div v-if="bnItems.length === 0" class="item-empty">暂无数据，点击「录入」添加标讯</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.enterprise-library { width: 100%; max-width: 700px; }
.content-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.header-icon { width: 44px; height: 44px; background: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0; }
.page-title { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0; }
.page-subtitle { font-size: 14px; color: #64748b; margin: 4px 0 0; }

.config-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }

/* Tabs */
.lib-tabs { display: flex; gap: 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px; }
.lib-tab { display: flex; align-items: center; gap: 6px; padding: 10px 18px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.lib-tab:hover { color: #334155; background: #f8fafc; }
.lib-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }
.lib-tab svg { flex-shrink: 0; }
.tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 600; border-radius: 9px; }
.lib-tab.active .tab-count { background: #dbeafe; color: #3b82f6; }

/* Toolbar */
.tab-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.toolbar-hint { font-size: 12px; color: #94a3b8; }

.add-btn { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; background: white; border: 1px dashed #93c5fd; border-radius: 6px; color: #3b82f6; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.add-btn:hover { background: #eff6ff; border-style: solid; }

/* Add form */
.add-form { margin-bottom: 12px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
.add-form-row { display: flex; align-items: center; gap: 8px; }
.add-input { padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; color: #1e293b; outline: none; background: white; flex: 1; min-width: 0; }
.add-input.main { flex: 2; }
.add-input.short { flex: 0.7; }
.add-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
.add-input::placeholder { color: #c0c9d4; }
.add-confirm { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; flex-shrink: 0; }
.add-confirm:hover { background: #2563eb; }
.add-cancel { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: white; color: #94a3b8; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; flex-shrink: 0; }
.add-cancel:hover { color: #ef4444; border-color: #fca5a5; background: #fef2f2; }

/* Item list */
.item-list { display: flex; flex-direction: column; gap: 6px; }
.item-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; transition: all 0.15s; }
.item-row:hover { border-color: #cbd5e1; }
.item-info { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.item-name { font-size: 13px; font-weight: 500; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-tag { font-size: 11px; padding: 2px 8px; background: #f1f5f9; color: #64748b; border-radius: 4px; white-space: nowrap; flex-shrink: 0; }
.item-tag.region { background: #eff6ff; color: #3b82f6; }
.item-tag.budget { background: #fef3c7; color: #b45309; }
.item-remove { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: #cbd5e1; border-radius: 6px; cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
.item-remove:hover { color: #ef4444; background: #fef2f2; }
.item-empty { text-align: center; padding: 20px; color: #94a3b8; font-size: 13px; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 8px; }
</style>
