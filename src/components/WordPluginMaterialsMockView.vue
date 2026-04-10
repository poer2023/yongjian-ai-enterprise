<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronLeft, Package, Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const mockSectionTitle = '2.10 业绩案例证明文件';
type MaterialItem = {
  name: string;
  subtype: string;
  icon: string;
  status?: 'recommended' | 'high' | 'new';
};
type MaterialGroup = {
  key: string;
  label: string;
  count: number;
  items: MaterialItem[];
};
type HistoryBid = {
  id: string;
  title: string;
  updatedAt: string;
};

const pluginView = ref<'home' | 'materials'>('home');
const selectedBidId = ref<string | null>(null);
const materialSearch = ref('');
const isLoggedIn = ref(true);
const showAccountMenu = ref(false);
const materialsMode = ref<'recommended' | 'all' | 'history'>('history');
const selectedMaterialName = ref('');
const showImagePicker = ref(false);
const insertedMaterials = ref<Record<string, number>>({});
const selectedImageIds = ref<number[]>([]);
const pickerImages = computed(() => Array.from({ length: 12 }, (_, idx) => idx + 1));

/** Top-level pane after selecting a bid */
const primaryShellTab = ref<'writing' | 'materials'>('writing');
const writingAssistInfo = ref('');

const runSmartWriting = () => {
  // no-op for mock action
};

const materialGroups = computed<MaterialGroup[]>(() => [
  {
    key: 'enterprise-cert',
    label: '企业资质',
    count: 4,
    items: [
      { name: '营业执照副本', subtype: '基础资质', icon: '📄', status: 'recommended' },
      { name: '网络安全等级测评机构服务认证证书', subtype: '行业资质', icon: '🛡️', status: 'high' },
      { name: 'ISO9001质量管理体系认证', subtype: '质量体系', icon: '✅', status: 'recommended' },
      { name: 'ISO27001信息安全管理体系认证', subtype: '安全体系', icon: '🔐', status: 'new' },
    ],
  },
  {
    key: 'person-cert',
    label: '人员资质',
    count: 3,
    items: [
      { name: '项目经理-高级测评师证书', subtype: '核心岗位', icon: '👤', status: 'high' },
      { name: '技术负责人-CISSP证书', subtype: '核心岗位', icon: '👤', status: 'recommended' },
      { name: '测评工程师-CISP证书', subtype: '团队成员', icon: '👤' },
    ],
  },
  {
    key: 'id-copy',
    label: '身份证复印件',
    count: 2,
    items: [
      { name: '法人身份证复印件（正反面）', subtype: '签章材料', icon: '🪪', status: 'recommended' },
      { name: '授权代理人身份证复印件（正反面）', subtype: '签章材料', icon: '🪪' },
    ],
  },
  {
    key: 'cases',
    label: '业绩案例',
    count: 3,
    items: [
      { name: '某银行核心系统等保测评项目', subtype: '金融行业', icon: '📁', status: 'high' },
      { name: '某保险公司等保测评项目', subtype: '保险行业', icon: '📁', status: 'recommended' },
      { name: '某政务云平台安全评测项目', subtype: '政务行业', icon: '📁' },
    ],
  },
]);

const historyBids = computed<HistoryBid[]>(() => [
  { id: 'h1', title: 'xx银行等保测评服务项目投标文件', updatedAt: '今天 14:36' },
  { id: 'h2', title: '信息系统安全等级保护测评服务项目投标文件', updatedAt: '今天 10:12' },
  { id: 'h3', title: '网络安全服务采购项目投标文件', updatedAt: '昨天 21:05' },
]);

const selectedBid = computed(() => historyBids.value.find((item) => item.id === selectedBidId.value) ?? null);

const historyBidMaterials = computed<MaterialItem[]>(() =>
  historyBids.value.map((bid) => ({
    name: bid.title,
    subtype: `历史标书 · ${bid.updatedAt}`,
    icon: '🗂️',
    status: 'recommended' as const,
  })),
);

const allMaterials = computed(() => materialGroups.value.flatMap((group) => group.items));

const filteredMaterials = computed(() => {
  const source = materialsMode.value === 'history'
    ? historyBidMaterials.value
    : materialsMode.value === 'recommended'
      ? allMaterials.value.filter((item) => item.status === 'recommended' || item.status === 'high')
      : [];
  const keyword = materialSearch.value.trim().toLowerCase();
  if (!keyword) return source;
  return source.filter((item) => `${item.name} ${item.subtype}`.toLowerCase().includes(keyword));
});

const openBidMaterials = (bidId: string) => {
  selectedBidId.value = bidId;
  pluginView.value = 'materials';
  primaryShellTab.value = 'writing';
  materialsMode.value = 'history';
};

const backToPluginHome = () => {
  selectedBidId.value = null;
  pluginView.value = 'home';
  materialSearch.value = '';
  showAccountMenu.value = false;
};

const openImagePicker = (materialName: string) => {
  selectedMaterialName.value = materialName;
  selectedImageIds.value = [];
  showImagePicker.value = true;
};

const closeImagePicker = () => {
  showImagePicker.value = false;
};

const toggleImageSelection = (id: number) => {
  const next = new Set(selectedImageIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedImageIds.value = Array.from(next);
};

const insertWholeMaterial = (materialName: string) => {
  insertedMaterials.value = { ...insertedMaterials.value, [materialName]: -1 };
};

const insertSelectedImages = () => {
  if (!selectedMaterialName.value || selectedImageIds.value.length === 0) return;
  insertedMaterials.value = {
    ...insertedMaterials.value,
    [selectedMaterialName.value]: selectedImageIds.value.length,
  };
  showImagePicker.value = false;
};

const toggleSelectAllImages = () => {
  if (selectedImageIds.value.length === pickerImages.value.length) {
    selectedImageIds.value = [];
    return;
  }
  selectedImageIds.value = [...pickerImages.value];
};

const getInsertLabel = (materialName: string) => {
  const count = insertedMaterials.value[materialName];
  if (count === -1) return '已插入';
  if (typeof count === 'number' && count > 0) return `已插入(${count})`;
  return '插入';
};

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value;
};

const handleLogout = () => {
  isLoggedIn.value = false;
  showAccountMenu.value = false;
  pluginView.value = 'home';
};

const handleLogin = () => {
  isLoggedIn.value = true;
  showAccountMenu.value = false;
  pluginView.value = 'home';
};

const backToResult = () => {
  router.push({ name: 'bid-doc-plugin-result' });
};
</script>

<template>
  <div class="plugin-mock-page">
    <section class="mock-main">
      <div class="mock-topbar">
        <button class="back-btn" @click="backToResult">
          <ChevronLeft :size="16" />
          返回结果页
        </button>
        <span class="mock-note">仅演示 Microsoft Word 中的插件效果</span>
      </div>

      <div class="workspace-shell">
        <section class="word-workspace">
          <header class="word-titlebar">
            <div class="titlebar-left">
              <span class="dot blue"></span>
              <span class="dot gray"></span>
              <span class="dot gray"></span>
              <span class="doc-name">文档2 - Word</span>
            </div>
            <div class="titlebar-search">搜索</div>
            <div class="titlebar-right">
              <span class="title-chip">评论</span>
              <span class="title-chip primary">共享</span>
            </div>
          </header>

          <header class="word-menu">
            <div class="ribbon-tabs">
              <span>文件</span>
              <span class="active">开始</span>
              <span>插入</span>
              <span>绘图</span>
              <span>设计</span>
              <span>布局</span>
              <span>引用</span>
              <span>审阅</span>
              <span>视图</span>
            </div>
          </header>

          <div class="ribbon-toolbar">
            <div class="toolbar-group">
              <span class="toolbar-btn">粘贴</span>
              <span class="toolbar-btn">格式刷</span>
            </div>
            <div class="toolbar-group">
              <span class="toolbar-field wide">微软雅黑</span>
              <span class="toolbar-field">11</span>
              <span class="toolbar-btn">B</span>
              <span class="toolbar-btn">I</span>
              <span class="toolbar-btn">U</span>
              <span class="toolbar-btn">A</span>
            </div>
            <div class="toolbar-group">
              <span class="toolbar-btn">左对齐</span>
              <span class="toolbar-btn">居中</span>
              <span class="toolbar-btn">项目符号</span>
              <span class="toolbar-btn">编号</span>
            </div>
            <div class="toolbar-group">
              <span class="toolbar-btn wide">标题 1</span>
              <span class="toolbar-btn wide">正文</span>
              <span class="toolbar-btn wide">标题 2</span>
            </div>
            <div class="toolbar-group">
              <span class="toolbar-btn">查找</span>
              <span class="toolbar-btn">替换</span>
            </div>
          </div>

          <div class="word-ruler">
            <span v-for="i in 14" :key="i">{{ i }}</span>
          </div>

          <div class="word-editor-body">
            <div class="word-canvas-wrap">
              <div class="word-canvas">
                <div class="doc-content">
                  <p>一、项目概况</p>
                  <p>本文件为 AI 自动生成的标书初稿内容示意，实际内容可在插件中按推荐素材继续完善。</p>
                  <p>二、商务响应</p>
                  <p>已完成基础条款应答，建议按右侧推荐素材一键插入资质、业绩与团队信息。</p>
                  <p>三、技术方案</p>
                  <p>可结合历史标书与企业素材库内容进行补强，并在 Word 内完成最终排版与导出。</p>
                </div>
              </div>
            </div>

            <aside class="plugin-mock-shell">
              <header v-if="isLoggedIn && pluginView !== 'home'" class="plugin-mock-header materials-header">
                <button class="header-back-btn" @click="backToPluginHome">
                  <ChevronLeft :size="14" />
                  所有标书
                </button>
                <p class="materials-title">{{ selectedBid ? selectedBid.title : mockSectionTitle }}</p>
              </header>
              <header v-else class="plugin-mock-header plugin-shell-brand">
                <Package :size="16" />
                <div>
                  <h1>涌见AI标书助手</h1>
                  <p>{{ isLoggedIn ? '历史标书与智能写作' : '登录后可使用素材库与云端同步' }}</p>
                </div>
                <div v-if="isLoggedIn" class="account-entry">
                  <button class="avatar-btn" @click="toggleAccountMenu">账号</button>
                  <div v-if="showAccountMenu" class="account-menu">
                    <button @click="handleLogout">退出登录</button>
                  </div>
                </div>
                <span v-else class="shell-guest-badge">未登录</span>
              </header>

              <div v-if="!isLoggedIn" class="plugin-login-panel">
                <h3>涌见AI</h3>
                <p>扫码登录涌见AI</p>
                <div class="login-qr" aria-label="二维码 mock">
                  <span class="qr-finder tl"></span>
                  <span class="qr-finder tr"></span>
                  <span class="qr-finder bl"></span>
                  <span class="qr-noise"></span>
                </div>
                <button class="test-login-btn" @click="handleLogin">测试登录</button>
              </div>

              <div v-else-if="pluginView === 'home'" class="plugin-home-panel">
                <div class="home-section">
                  <div class="home-section-title">历史标书</div>
                  <div class="plugin-mock-list">
                    <article
                      v-for="bid in historyBids"
                      :key="bid.id"
                      class="history-row"
                      @click="openBidMaterials(bid.id)"
                    >
                      <h3>{{ bid.title }}</h3>
                      <p>{{ bid.updatedAt }}</p>
                    </article>
                  </div>
                </div>
              </div>

              <div v-else class="plugin-workspace-stack">
                <div class="shell-view-tabs" role="tablist" aria-label="写作与素材">
                  <button type="button" class="shell-view-tab" role="tab" :aria-selected="primaryShellTab === 'writing'" :class="{ active: primaryShellTab === 'writing' }" @click="primaryShellTab = 'writing'">生成文本</button>
                  <button type="button" class="shell-view-tab" role="tab" :aria-selected="primaryShellTab === 'materials'" :class="{ active: primaryShellTab === 'materials' }" @click="primaryShellTab = 'materials'">插入素材</button>
                </div>

                <div v-if="primaryShellTab === 'writing'" class="plugin-writing-panel">
                  <div class="writing-actions">
                    <button type="button" class="smart-writing-btn" @click="runSmartWriting">生成文本</button>
                    <p class="writing-action-note">单次点击仅生成本节内容</p>
                  </div>
                  <div class="writing-assist">
                    <textarea
                      v-model="writingAssistInfo"
                      class="writing-assist-input"
                      rows="5"
                      placeholder="辅助信息（非必填）：可补充写作重点，如突出金融行业经验、强调进度保障、技术方案偏正式风格。"
                    ></textarea>
                  </div>
                </div>

                <div v-else class="plugin-materials-panel">
                  <div class="materials-tabs">
                    <button class="material-tab-btn" :class="{ active: materialsMode === 'history' }" @click="materialsMode = 'history'">历史标书素材</button>
                    <button class="material-tab-btn" :class="{ active: materialsMode === 'recommended' }" @click="materialsMode = 'recommended'">推荐素材</button>
                    <button class="material-tab-btn" :class="{ active: materialsMode === 'all' }" @click="materialsMode = 'all'">全部素材</button>
                  </div>

                  <div class="materials-toolbar">
                    <input v-model="materialSearch" class="materials-search" placeholder="搜索素材名称或类型" />
                  </div>

                  <div class="plugin-mock-list">
                    <article
                      v-for="item in filteredMaterials"
                      :key="item.name"
                      class="material-row clickable"
                      @click="openImagePicker(item.name)"
                    >
                      <div class="material-main">
                        <span class="material-icon">{{ item.icon }}</span>
                        <div class="material-copy">
                          <h3>{{ item.name }}</h3>
                          <p>{{ item.subtype }}</p>
                        </div>
                      </div>
                      <button class="material-insert-btn" type="button" @click.stop="insertWholeMaterial(item.name)">
                        <Plus :size="14" />
                        {{ getInsertLabel(item.name) }}
                      </button>
                    </article>
                    <div v-if="filteredMaterials.length === 0 && materialsMode !== 'all'" class="empty-tip">未搜索到匹配素材</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <footer class="word-statusbar">
            <span>第 1 页，共 1 页</span>
            <span>中文(简体，中国)</span>
            <span>可访问性：良好</span>
            <span>缩放 100%</span>
          </footer>
        </section>

      </div>
    </section>

    <div v-if="showImagePicker" class="picker-mask" @click.self="closeImagePicker">
      <div class="picker-modal">
        <header class="picker-header">
          <h3>{{ selectedMaterialName }} - 选择图片</h3>
          <button class="picker-close" @click="closeImagePicker">×</button>
        </header>
        <div class="picker-grid">
          <article v-for="i in pickerImages" :key="i" class="picker-card" @click="toggleImageSelection(i)">
            <span class="picker-check" :class="{ selected: selectedImageIds.includes(i) }"></span>
            <div class="picker-thumb">图片 {{ i }}</div>
          </article>
        </div>
        <footer class="picker-footer">
          <span>已选 {{ selectedImageIds.length }} / {{ pickerImages.length }} 张</span>
          <div class="picker-actions">
            <button @click="toggleSelectAllImages">{{ selectedImageIds.length === pickerImages.length ? '取消全选' : '全选' }}</button>
            <button @click="closeImagePicker">取消</button>
            <button class="primary" :disabled="selectedImageIds.length === 0" @click="insertSelectedImages">插入选中图片</button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plugin-mock-page {
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: #f1f3f6;
}

.mock-main {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mock-topbar {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
}

.mock-note {
  font-size: 12px;
  color: #2563eb;
}

.workspace-shell {
  height: calc(100% - 56px);
  overflow: hidden;
}

.word-workspace {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.word-editor-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.word-titlebar {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-bottom: 1px solid #e5e7eb;
  background: #f3f4f6;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #cbd5e1;
}

.dot.blue {
  background: #3b82f6;
}

.dot.gray {
  background: #d1d5db;
}

.doc-name {
  margin-left: 4px;
  font-size: 11px;
  color: #475569;
}

.titlebar-search {
  width: 200px;
  height: 22px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  font-size: 11px;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.titlebar-right {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.title-chip {
  font-size: 11px;
  color: #64748b;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 3px 7px;
}

.title-chip.primary {
  color: #1d4ed8;
  border-color: #bfdbfe;
  background: #e8effd;
}

.word-menu {
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f3f4f6;
  gap: 14px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: #ffffff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  cursor: pointer;
}

.ribbon-tabs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.ribbon-tabs span {
  padding: 5px 8px;
  border-radius: 6px;
}

.ribbon-tabs span.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.ribbon-toolbar {
  min-height: 62px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  padding: 8px 12px;
}

.toolbar-group {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-right: 12px;
  border-right: 1px solid #e5e7eb;
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-btn {
  min-width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  white-space: nowrap;
}

.toolbar-btn.wide {
  min-width: 56px;
  padding: 0 8px;
}

.toolbar-field {
  min-width: 36px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f8fafc;
  color: #334155;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  pointer-events: none;
  white-space: nowrap;
}

.toolbar-field.wide {
  min-width: 72px;
}

.word-canvas-wrap {
  flex: 1;
  padding: 20px 24px;
  overflow: auto;
  display: flex;
  justify-content: center;
}

.word-canvas {
  width: min(100%, 790px);
  min-height: 900px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 14px rgba(15, 23, 42, 0.1);
}

.doc-content {
  padding: 44px 52px;
  font-size: 14px;
  line-height: 1.9;
  color: #111827;
}

.doc-content p {
  margin: 0 0 12px;
}

.word-ruler {
  height: 22px;
  border-bottom: 1px solid #e5e7eb;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 74px;
  font-size: 10px;
  color: #94a3b8;
}

.word-statusbar {
  height: 26px;
  border-top: 1px solid #e5e7eb;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
  font-size: 11px;
  color: #64748b;
}

.plugin-mock-shell {
  flex: 0 0 320px;
  align-self: stretch;
  min-height: 0;
  width: 320px;
  background: #fff;
  border-left: 1px solid #e2e8f0;
  box-shadow: -6px 0 18px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
}

.shell-view-tabs {
  position: relative;
  z-index: 3;
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.shell-view-tab {
  flex: 1;
  position: relative;
  border: none;
  background: transparent;
  padding: 10px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition:
    color 0.15s,
    background 0.15s;
  text-align: center;
}

.shell-view-tab:hover {
  color: #334155;
  background: #f1f5f9;
}

.shell-view-tab.active {
  background: #fff;
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.plugin-workspace-stack {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.plugin-chat-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.plugin-writing-panel {
  flex: 1;
  min-height: 0;
  padding: 14px 12px 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.writing-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 295px;
}

.smart-writing-btn {
  width: 100%;
  height: 36px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.smart-writing-btn:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.writing-action-note {
  margin: 0;
  font-size: 11px;
  color: #64748b;
}

.writing-assist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  max-width: 295px;
}

.writing-assist-label {
  font-size: 12px;
  color: #64748b;
}

.writing-assist-input {
  width: 100%;
  box-sizing: border-box;
  min-height: 112px;
  resize: vertical;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  font-family: inherit;
  color: #334155;
  line-height: 1.5;
}

.writing-assist-input:focus {
  outline: none;
  border-color: #93c5fd;
}

.plugin-shell-brand {
  flex-shrink: 0;
}

.shell-guest-badge {
  margin-left: auto;
  align-self: center;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-bubble {
  max-width: 92%;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-bubble.assistant {
  align-self: flex-start;
  background: #f1f5f9;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.chat-bubble.user {
  align-self: flex-end;
  background: #eff6ff;
  color: #1e3a8a;
  border: 1px solid #bfdbfe;
}

.chat-bubble p {
  margin: 0;
}

.chat-bubble-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.bubble-action-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #475569;
  border-radius: 6px;
  font-size: 11px;
  line-height: 1;
  padding: 5px 9px;
  cursor: pointer;
}

.bubble-action-btn.primary {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
}

.chat-composer {
  flex-shrink: 0;
  padding: 10px 12px 12px;
  border-top: 1px solid #f1f5f9;
  background: #fafafa;
}

.chat-input-field {
  position: relative;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.chat-input-field:focus-within {
  border-color: #93c5fd;
  box-shadow: 0 0 0 1px #bfdbfe;
}

.chat-input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  max-height: 88px;
  resize: none;
  border: none;
  border-radius: 8px;
  padding: 8px 126px 8px 10px;
  font-size: 12px;
  font-family: inherit;
  color: #334155;
  line-height: 1.45;
  background: transparent;
}

.chat-input:focus {
  outline: none;
}

.chat-auto-insert-toggle {
  position: absolute;
  right: 40px;
  bottom: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #64748b;
  user-select: none;
}

.chat-auto-insert-toggle input {
  width: 13px;
  height: 13px;
  margin: 0;
}

.chat-send-btn {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.chat-send-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.chat-send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.plugin-mock-header {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 14px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.plugin-mock-header svg {
  color: #7c3aed;
  margin-top: 2px;
}

.plugin-mock-header h1 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.plugin-mock-header p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
}

.account-entry {
  margin-left: auto;
  position: relative;
}

.avatar-btn {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  cursor: pointer;
}

.account-menu {
  position: absolute;
  top: 36px;
  right: 0;
  width: 96px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
  padding: 6px;
  z-index: 20;
}

.account-menu button {
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: #334155;
  text-align: left;
  cursor: pointer;
}

.account-menu button:hover {
  background: #f8fafc;
}

.plugin-home-panel,
.plugin-materials-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.home-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.home-section .plugin-mock-list {
  flex: 1;
}

.home-section-title {
  padding: 10px 12px 0;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.plugin-login-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  text-align: center;
}

.plugin-login-panel h3 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.plugin-login-panel p {
  margin: 0 0 4px;
  font-size: 12px;
  color: #64748b;
}

.login-qr {
  width: 168px;
  height: 168px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.qr-noise {
  position: absolute;
  inset: 12px;
  background:
    repeating-linear-gradient(0deg, #111827 0 4px, transparent 4px 8px),
    repeating-linear-gradient(90deg, #111827 0 4px, transparent 4px 8px);
  opacity: 0.35;
  mask: radial-gradient(circle at 50% 50%, #000 70%, transparent 100%);
}

.qr-finder {
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid #111827;
  background: #fff;
  box-sizing: border-box;
}

.qr-finder::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: #111827;
}

.qr-finder.tl {
  left: 10px;
  top: 10px;
}

.qr-finder.tr {
  right: 10px;
  top: 10px;
}

.qr-finder.bl {
  left: 10px;
  bottom: 10px;
}

.test-login-btn {
  margin-top: 4px;
  min-width: 120px;
  height: 34px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}

.materials-header {
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.materials-title {
  margin: 0;
  font-size: 12px;
  color: #334155;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #dbeafe;
  background: #f8fbff;
  color: #2563eb;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.materials-tabs {
  display: flex;
  gap: 8px;
  padding: 10px 12px 0;
}

.material-tab-btn {
  border: 1px solid #dbeafe;
  background: #f8fbff;
  color: #2563eb;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}

.material-tab-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.materials-toolbar {
  display: flex;
  align-items: center;
  padding: 10px 12px 0;
}

.materials-search {
  flex: 1;
  height: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  color: #334155;
  padding: 0 10px;
}

.materials-search:focus {
  outline: none;
  border-color: #bfdbfe;
}

.plugin-mock-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  min-height: 0;
}

.material-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.material-row.clickable {
  cursor: pointer;
}

.material-main {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-icon {
  font-size: 16px;
}

.material-copy h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.material-copy p {
  margin: 2px 0 0;
  font-size: 11px;
  color: #94a3b8;
}

.material-insert-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: 72px;
  justify-content: center;
  border: 1px solid #bfdbfe;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 10px;
  cursor: pointer;
}

.history-row {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  padding: 10px;
  cursor: pointer;
}

.history-row h3 {
  margin: 0;
  font-size: 12px;
  color: #1e293b;
  font-weight: 600;
}

.history-row p {
  margin: 6px 0 0;
  font-size: 11px;
  color: #64748b;
}

.empty-tip {
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 18px 10px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

.picker-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.picker-modal {
  width: min(980px, 92vw);
  height: min(640px, 88vh);
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.picker-header {
  height: 54px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
}

.picker-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.picker-close {
  border: none;
  background: transparent;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
}

.picker-grid {
  flex: 1;
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  overflow: auto;
}

.picker-card {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  background: #f8fafc;
  height: 170px;
  position: relative;
}

.picker-check {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid #d1d5db;
  background: #fff;
}

.picker-check.selected {
  border-color: #2563eb;
  background: #2563eb;
}

.picker-thumb {
  position: absolute;
  inset: 32px 10px 10px;
  background: linear-gradient(180deg, #f1f5f9, #e2e8f0);
  border-radius: 6px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.picker-footer {
  height: 56px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  font-size: 12px;
  color: #6b7280;
}

.picker-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.picker-actions button {
  height: 32px;
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 12px;
  cursor: pointer;
}

.picker-actions .primary {
  border-color: #60a5fa;
  background: #bfdbfe;
  color: #1d4ed8;
}

.picker-actions .primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .word-workspace {
    height: calc(100% - 56px);
  }
}
</style>
