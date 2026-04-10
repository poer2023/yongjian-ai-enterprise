<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  Home,
  MessageSquare, // AI提问
  Newspaper, // 标讯搜索
  Bell, // 资讯订阅
  Bot, // 智能体
  Network, // 知识库 (Tree structure)
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Users, // 团队管理
  User, // 个人中心
  Building2,
  Lock, // 隐藏知识库
  Briefcase // 企业素材库
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

// State for expandable menus
const isKnowledgeExpanded = ref(true);
/** Collapsed rail: icons only */
const isCollapsed = ref(false);

const toggleSidebarCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const knowledgeChildrenVisible = computed(
  () => isCollapsed.value || isKnowledgeExpanded.value
);

const handleItemClick = (routeName: string) => {
  if (routeName) {
    router.push({ name: routeName });
  }
};

const isActive = (routeName: string) => {
  return route.name === routeName;
};

const isSubscriptionActive = computed(() => {
  return ['bid-subscription', 'bid-info-form'].includes(String(route.name ?? ''));
});

const toggleKnowledge = () => {
  if (isCollapsed.value) return;
  isKnowledgeExpanded.value = !isKnowledgeExpanded.value;
};

// Bottom items
const bottomItems = [
  { icon: Users, label: '团队管理', routeName: 'team' },
  { icon: User, label: '个人中心', routeName: 'profile' },
];
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
    <!-- Logo Area -->
    <div class="sidebar-header">
      <div class="logo-area">
        <div class="logo-icon" :title="isCollapsed ? '涌见AI' : undefined">
          <Building2 :size="20" />
        </div>
        <div v-show="!isCollapsed" class="logo-text">
          <span class="logo-brand">涌见AI</span>
        </div>
        <button
          type="button"
          class="sidebar-collapse-toggle"
          :title="isCollapsed ? '展开侧栏' : '收起侧栏'"
          :aria-expanded="!isCollapsed"
          aria-label="切换侧栏展开或收起"
          @click="toggleSidebarCollapse"
        >
          <ChevronsLeft v-if="!isCollapsed" :size="18" />
          <ChevronsRight v-else :size="18" />
        </button>
      </div>
    </div>

    <nav class="sidebar-nav">
      <!-- 首页 -->
      <div
        class="nav-item"
        :class="{ active: isActive('home') }"
        :title="isCollapsed ? '首页' : undefined"
        @click="handleItemClick('home')"
      >
        <Home :size="18" class="nav-icon" />
        <span class="nav-label">首页</span>
      </div>

      <!-- AI提问 -->
      <div
        class="nav-item"
        :class="{ active: isActive('chat') }"
        :title="isCollapsed ? 'AI提问' : undefined"
        @click="handleItemClick('chat')"
      >
        <MessageSquare :size="18" class="nav-icon" />
        <span class="nav-label">AI提问</span>
      </div>

      <!-- 标讯搜索 -->
      <div
        class="nav-item"
        :class="{ active: isActive('enterprise-search') }"
        :title="isCollapsed ? '标讯搜索' : undefined"
        @click="handleItemClick('enterprise-search')"
      >
        <Newspaper :size="18" class="nav-icon" />
        <span class="nav-label">标讯搜索</span>
      </div>

      <!-- 资讯订阅 -->
      <div
        class="nav-item"
        :class="{ active: isSubscriptionActive }"
        :title="isCollapsed ? '资讯订阅' : undefined"
        @click="handleItemClick('bid-subscription')"
      >
        <Bell :size="18" class="nav-icon" />
        <span class="nav-label">资讯订阅</span>
      </div>

      <!-- 智能体 -->
      <div
        class="nav-item"
        :class="{ active: isActive('agents') }"
        :title="isCollapsed ? '智能体' : undefined"
        @click="handleItemClick('agents')"
      >
        <Bot :size="18" class="nav-icon" />
        <span class="nav-label">智能体</span>
        <span class="hot-badge-fire">🔥</span>
      </div>

      <!-- 知识库 Group -->
      <div class="nav-group">
        <div
          class="nav-item"
          :title="isCollapsed ? '知识库' : undefined"
          @click="toggleKnowledge"
        >
          <Network :size="18" class="nav-icon" />
          <span class="nav-label">知识库</span>
          <component
            :is="isKnowledgeExpanded ? ChevronDown : ChevronRight"
            v-show="!isCollapsed"
            :size="14"
            class="nav-chevron"
          />
        </div>

        <!-- Knowledge Sub-items -->
        <div v-show="knowledgeChildrenVisible" class="nav-children">
          <!-- 团队知识库 -->
          <div
            class="nav-child-item"
            :class="{ active: isActive('knowledge') }"
            :title="isCollapsed ? '团队知识库' : undefined"
            @click="handleItemClick('knowledge')"
          >
            <Users :size="14" class="nav-icon" />
            <span class="nav-label">团队知识库</span>
          </div>

          <!-- 企业素材库 -->
          <div
            class="nav-child-item"
            :class="{ active: isActive('enterprise-material') }"
            :title="isCollapsed ? '企业素材库' : undefined"
            @click="handleItemClick('enterprise-material')"
          >
            <Briefcase :size="14" class="nav-icon" />
            <span class="nav-label">企业素材库</span>
          </div>

          <!-- 个人知识库 -->
          <div
            class="nav-child-item"
            :title="isCollapsed ? '个人知识库' : undefined"
          >
            <User :size="14" class="nav-icon" />
            <span class="nav-label">个人知识库</span>
          </div>

          <!-- 隐藏知识库 -->
          <div
            class="nav-child-item"
            :title="isCollapsed ? '隐藏知识库' : undefined"
          >
            <Lock :size="14" class="nav-icon" />
            <span class="nav-label">隐藏知识库</span>
          </div>

          <!-- 小组知识库 -->
          <div
            class="nav-child-item group-kb-item"
            :title="isCollapsed ? '小组知识库' : undefined"
          >
            <div class="group-kb-left">
              <Users :size="14" class="nav-icon" />
              <span class="nav-label">小组知识库</span>
            </div>
            <Plus :size="14" class="add-icon" />
          </div>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div
        v-for="(item, index) in bottomItems"
        :key="index"
        class="nav-item footer-item"
        :class="{ active: isActive(item.routeName) }"
        :title="isCollapsed ? item.label : undefined"
        @click="handleItemClick(item.routeName)"
      >
        <component :is="item.icon" :size="18" class="nav-icon" />
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  flex-shrink: 0;
  border-right: 1px solid #dbeafe;
  overflow-x: hidden;
  transition: width 0.2s ease, padding 0.2s ease;
  box-sizing: border-box;
}

.sidebar--collapsed {
  width: 64px;
  padding: 16px 8px;
}

.sidebar-header {
  margin-bottom: 24px;
  padding: 0 8px;
}

.sidebar--collapsed .sidebar-header {
  padding: 0;
  margin-bottom: 16px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.sidebar--collapsed .logo-area {
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}

.logo-text {
  flex: 1;
  min-width: 0;
}

.sidebar-collapse-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: auto;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.45);
  color: #2563eb;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.sidebar-collapse-toggle:hover {
  background: rgba(255, 255, 255, 0.85);
  color: #1d4ed8;
}

.sidebar--collapsed .sidebar-collapse-toggle {
  margin-left: 0;
  width: 100%;
}

.sidebar--collapsed .logo-icon {
  justify-content: center;
}

.logo-icon {
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-brand {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
  font-size: 14px;
  position: relative;
  font-weight: 500;
  min-height: 40px;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.5);
  color: #1e40af;
}

.nav-item.active {
  background-color: #dbeafe;
  color: #2563eb;
  font-weight: 600;
}

.nav-icon {
  margin-right: 10px;
  flex-shrink: 0;
}

.nav-chevron {
  color: #94a3b8;
  margin-left: auto;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
}

.hot-badge-fire {
  font-size: 14px;
  margin-left: auto;
}

.sidebar--collapsed .nav-label,
.sidebar--collapsed .hot-badge-fire,
.sidebar--collapsed .nav-chevron,
.sidebar--collapsed .group-kb-item .add-icon {
  display: none !important;
}

.sidebar--collapsed .nav-item {
  justify-content: center;
  padding: 10px 8px;
}

.sidebar--collapsed .nav-icon {
  margin-right: 0;
}

.sidebar--collapsed .nav-child-item {
  justify-content: center;
  padding: 8px;
}

.sidebar--collapsed .nav-child-item .nav-icon {
  margin-right: 0;
}

.sidebar--collapsed .group-kb-item {
  justify-content: center;
  padding-right: 8px;
}

.sidebar--collapsed .group-kb-left {
  justify-content: center;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 2px;
}

.nav-children {
  margin-top: 2px;
  margin-bottom: 4px;
}

.nav-child-item {
  display: flex;
  align-items: center;
  padding: 8px 12px 8px 38px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  margin-bottom: 1px;
}

.nav-child-item .nav-icon {
  margin-right: 8px;
  width: 14px;
  height: 14px;
}

.nav-child-item:hover {
  background-color: rgba(255, 255, 255, 0.5);
  color: #1e40af;
}

.nav-child-item.active {
  background-color: #dbeafe;
  color: #2563eb;
  font-weight: 600;
}

.group-kb-item {
  justify-content: space-between;
  padding-right: 12px;
}

.group-kb-left {
  display: flex;
  align-items: center;
}

.group-kb-item .add-icon {
  color: #3b82f6;
}

.sidebar-footer {
  padding-top: 12px;
  margin-top: auto;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
}

.footer-item {
  color: #475569;
  font-size: 14px;
}

/* Custom Scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.sidebar-nav:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
</style>
