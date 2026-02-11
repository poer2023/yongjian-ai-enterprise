<script setup lang="ts">
import { ref, computed } from 'vue';
import { Building2, Users, FileText, Search, Plus, Target, AlertCircle, Database } from 'lucide-vue-next';
import { ChecklistSelector } from './shared';

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
  <div class="sales-strategy-config">
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
            <div v-else class="track-results-empty-guide">
              <AlertCircle :size="14" class="track-empty-icon" />
              <span>暂无匹配，可手动录入</span>
            </div>
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
            <div v-else class="track-results-empty-guide">
              <AlertCircle :size="14" class="track-empty-icon" />
              <span>暂无匹配，可手动录入</span>
            </div>
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
            <div v-else class="track-results-empty-guide">
              <AlertCircle :size="14" class="track-empty-icon" />
              <span>暂无匹配，可手动录入</span>
            </div>
          </div>
          <ChecklistSelector :items="bnItems" v-model="selectedBnIds" />
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="save">保存配置</button>
    </div>
  </div>
</template>

<style scoped>
.sales-strategy-config { width: 100%; max-width: 700px; }
.content-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.header-icon { width: 44px; height: 44px; background: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0; }
.page-title { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0; }
.page-subtitle { font-size: 14px; color: #64748b; margin: 4px 0 0; }

.config-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }

/* Track sections */
.track-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.track-section-standalone { }
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
.track-results { margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #e2e8f0; }
.track-results-label { font-size: 11px; color: #3b82f6; font-weight: 600; margin-bottom: 6px; }
.track-results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.track-result-item { display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 8px 10px; padding-right: 28px; background: #f0f7ff; border: 1px dashed #93c5fd; border-radius: 8px; cursor: pointer; transition: all 0.15s; text-align: left; position: relative; }
.track-result-item:hover { background: #dbeafe; border-color: #3b82f6; border-style: solid; }
.track-result-add { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); color: #3b82f6; }
.track-result-name { font-size: 12px; font-weight: 500; color: #1e40af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 16px; }
.track-result-desc { font-size: 10px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track-results-empty { text-align: center; padding: 10px; color: #94a3b8; font-size: 12px; }

.track-results-empty-guide {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1e40af;
  font-size: 12px;
  line-height: 1.5;
}

.track-empty-icon {
  color: #3b82f6;
  flex-shrink: 0;
}

/* Actions */
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
.form-actions .save { padding: 12px 24px; background: #3b82f6; border: none; border-radius: 8px; color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.form-actions .save:hover { background: #2563eb; }
</style>

<!-- Unscoped styles to override child component ChecklistSelector -->
<style>
.sales-strategy-config .checklist-item {
  border-color: #3b82f6;
  background: #eff6ff;
}

.sales-strategy-config .checklist-remove {
  opacity: 1;
  color: #3b82f6;
}

.sales-strategy-config .checklist-remove:hover {
  background: #fee2e2;
  color: #ef4444;
}
</style>
