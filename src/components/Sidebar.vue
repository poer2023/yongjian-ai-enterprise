<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  Home,
  MessageSquare, // AI提问
  Newspaper, // 标讯搜索
  Bell, // 标讯订阅
  Bot, // 智能体
  Network, // 知识库 (Tree structure)
  ChevronDown,
  ChevronRight,
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

const handleItemClick = (routeName: string) => {
  if (routeName) {
    router.push({ name: routeName });
  }
};

const isActive = (routeName: string) => {
  return route.name === routeName;
};

const toggleKnowledge = () => {
  isKnowledgeExpanded.value = !isKnowledgeExpanded.value;
};

// Bottom items
const bottomItems = [
  { icon: Users, label: '团队管理', routeName: 'team' },
  { icon: User, label: '个人中心', routeName: 'profile' },
];
</script>

<template>
  <aside class="sidebar">
    <!-- Logo Area -->
    <div class="sidebar-header">
      <div class="logo-area">
        <div class="logo-icon">
          <Building2 :size="20" />
        </div>
        <div class="logo-text">
          <span class="logo-brand">涌见AI</span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <!-- 首页 -->
      <div
        class="nav-item"
        :class="{ active: isActive('home') }"
        @click="handleItemClick('home')"
      >
        <Home :size="18" class="nav-icon" />
        <span class="nav-label">首页</span>
      </div>

      <!-- AI提问 -->
      <div
        class="nav-item"
        :class="{ active: isActive('chat') }"
        @click="handleItemClick('chat')"
      >
        <MessageSquare :size="18" class="nav-icon" />
        <span class="nav-label">AI提问</span>
      </div>

      <!-- 标讯搜索 -->
      <div
        class="nav-item"
        :class="{ active: isActive('enterprise-search') }"
        @click="handleItemClick('enterprise-search')"
      >
        <Newspaper :size="18" class="nav-icon" />
        <span class="nav-label">标讯搜索</span>
      </div>

      <!-- 标讯订阅 -->
      <div
        class="nav-item"
        :class="{ active: isActive('bid-subscription') }"
        @click="handleItemClick('bid-subscription')"
      >
        <Bell :size="18" class="nav-icon" />
        <span class="nav-label">标讯订阅</span>
      </div>

      <!-- 智能体 -->
      <div
        class="nav-item"
        :class="{ active: isActive('agents') }"
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
          @click="toggleKnowledge"
        >
          <Network :size="18" class="nav-icon" />
          <span class="nav-label">知识库</span>
          <component :is="isKnowledgeExpanded ? ChevronDown : ChevronRight" :size="14" class="nav-chevron" />
        </div>
        
        <!-- Knowledge Sub-items -->
        <div v-show="isKnowledgeExpanded" class="nav-children">
          <!-- 团队知识库 -->
          <div
            class="nav-child-item"
            :class="{ active: isActive('knowledge') }"
            @click="handleItemClick('knowledge')"
          >
            <Users :size="14" class="nav-icon" />
            <span class="nav-label">团队知识库</span>
          </div>

          <!-- 企业素材库 -->
          <div
            class="nav-child-item"
            :class="{ active: isActive('enterprise-material') }"
            @click="handleItemClick('enterprise-material')"
          >
            <Briefcase :size="14" class="nav-icon" />
            <span class="nav-label">企业素材库</span>
          </div>

          <!-- 个人知识库 -->
          <div class="nav-child-item">
            <User :size="14" class="nav-icon" />
            <span class="nav-label">个人知识库</span>
          </div>

          <!-- 隐藏知识库 -->
          <div class="nav-child-item">
            <Lock :size="14" class="nav-icon" />
            <span class="nav-label">隐藏知识库</span>
          </div>

          <!-- 小组知识库 -->
          <div class="nav-child-item group-kb-item">
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
}

.sidebar-header {
  margin-bottom: 24px;
  padding: 0 8px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
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
