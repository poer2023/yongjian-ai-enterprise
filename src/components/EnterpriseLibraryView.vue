<script setup lang="ts">
import { ref, computed } from 'vue';
import { Database, Building2, Users, FileText, Plus, X, Edit3, Check } from 'lucide-vue-next';

interface LibraryItem {
  id: string;
  name: string;
  type: string;
  region: string;
  editing?: boolean;
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
  editing?: boolean;
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

const totalCount = computed(() => buItems.value.length + compItems.value.length + bnItems.value.length);
</script>

<template>
  <div class="enterprise-library">
    <div class="content-header">
      <div class="header-icon">
        <Database :size="22" />
      </div>
      <div>
        <h1 class="page-title">企业总库</h1>
        <p class="page-subtitle">管理关注的招标单位、竞品企业和标讯，供团队成员在销售策略分析中使用 · 共 {{ totalCount }} 条</p>
      </div>
    </div>

    <div class="config-card">
      <!-- 招标单位 -->
      <div class="lib-section">
        <div class="lib-header">
          <div class="lib-header-left">
            <Building2 :size="16" class="lib-icon" />
            <span class="lib-title">招标单位</span>
            <span class="lib-count">{{ buItems.length }}</span>
          </div>
          <button class="add-btn" @click="buAdding = !buAdding"><Plus :size="14" />录入</button>
        </div>
        <!-- Add form -->
        <div v-if="buAdding" class="add-form">
          <div class="add-form-row">
            <input v-model="buNewName" placeholder="单位名称（必填）" class="add-input main" @keyup.enter="addBu" />
            <input v-model="buNewType" placeholder="类型，如 政府机关" class="add-input" />
            <input v-model="buNewRegion" placeholder="地区，如 上海" class="add-input" />
            <button class="add-confirm" @click="addBu"><Check :size="14" /></button>
            <button class="add-cancel" @click="buAdding = false"><X :size="14" /></button>
          </div>
        </div>
        <!-- Item list -->
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

      <!-- 竞品企业 -->
      <div class="lib-section">
        <div class="lib-header">
          <div class="lib-header-left">
            <Users :size="16" class="lib-icon" />
            <span class="lib-title">竞品企业</span>
            <span class="lib-count">{{ compItems.length }}</span>
          </div>
          <button class="add-btn" @click="compAdding = !compAdding"><Plus :size="14" />录入</button>
        </div>
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

      <!-- 关注标讯 -->
      <div class="lib-section">
        <div class="lib-header">
          <div class="lib-header-left">
            <FileText :size="16" class="lib-icon" />
            <span class="lib-title">关注的标讯</span>
            <span class="lib-count">{{ bnItems.length }}</span>
          </div>
          <button class="add-btn" @click="bnAdding = !bnAdding"><Plus :size="14" />录入</button>
        </div>
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

/* Library sections */
.lib-section { padding-top: 20px; margin-top: 20px; border-top: 1px solid #f1f5f9; }
.lib-section:first-child { padding-top: 0; margin-top: 0; border-top: none; }
.lib-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.lib-header-left { display: flex; align-items: center; gap: 6px; }
.lib-icon { color: #3b82f6; }
.lib-title { font-size: 14px; font-weight: 600; color: #1e293b; }
.lib-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; background: #2563eb; color: white; font-size: 11px; font-weight: 600; border-radius: 9px; }

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
