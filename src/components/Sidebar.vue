<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  Home,
  MessageSquare,
  Brain,
  Bot,
  Building2,
  FileText,
  Users,
  Newspaper,
  Bell
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const bottomItems = [
  { icon: FileText, label: '团队管理', routeName: 'team' },
  { icon: Users, label: '个人中心', routeName: 'profile' },
];

const handleItemClick = (routeName: string) => {
  if (routeName) {
    router.push({ name: routeName });
  }
};

const isActive = (routeName: string) => {
  return route.name === routeName;
};

// 检查标讯搜索是否处于激活状态
const isBidSearchActive = computed(() => {
  const bidRoutes = ['enterprise-search', 'bid-center', 'bid-info-form', 'bid-info-daily', 'bid-analysis-form', 'bid-analysis-result', 'bid-doc-form', 'bid-doc-result'];
  return bidRoutes.includes(route.name as string);
});

// 检查标讯订阅是否处于激活状态
const isBidSubscriptionActive = computed(() => {
  const subscriptionRoutes = ['bid-daily-report'];
  return subscriptionRoutes.includes(route.name as string);
});
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-area">
        <div class="logo-icon">
          <Building2 :size="18" />
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
        :class="{ active: isBidSubscriptionActive }"
        @click="handleItemClick('bid-subscription')"
      >
        <Bell :size="18" class="nav-icon" />
        <span class="nav-label">标讯订阅</span>
      </div>

      <!-- AI对话 -->
      <div
        class="nav-item"
        :class="{ active: isActive('chat') }"
        @click="handleItemClick('chat')"
      >
        <MessageSquare :size="18" class="nav-icon" />
        <span class="nav-label">AI对话</span>
      </div>

      <!-- 智能体 -->
      <div
        class="nav-item"
        :class="{ active: isActive('agents') }"
        @click="handleItemClick('agents')"
      >
        <Bot :size="18" class="nav-icon" />
        <span class="nav-label">智能体</span>
        <span class="hot-dot"></span>
      </div>

      <!-- 知识库 -->
      <div
        class="nav-item"
        :class="{ active: isActive('knowledge') }"
        @click="handleItemClick('knowledge')"
      >
        <Brain :size="18" class="nav-icon" />
        <span class="nav-label">知识库</span>
      </div>
    </nav>

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
  width: 200px;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  flex-shrink: 0;
}

.sidebar-header {
  margin-bottom: 32px;
  padding: 0 8px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.logo-text {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 4px;
  line-height: 1.2;
}

.logo-brand {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.3px;
}

.logo-highlight {
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  font-size: 15px;
  position: relative;
  font-weight: 500;
  min-height: 44px;
}

.nav-item:hover {
  background-color: #f8fafc;
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

.hot-badge {
  font-size: 12px;
  margin-left: auto;
}

.hot-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  margin-left: auto;
}

.sidebar-nav {
  flex: 1;
}

.nav-group {
  margin-bottom: 4px;
}

.nav-children {
  margin-left: 12px;
  border-left: 2px solid #e2e8f0;
  padding-left: 0;
}

.nav-child-item {
  padding: 10px 16px;
  font-size: 13px;
  margin-bottom: 2px;
}

.nav-child-item .nav-icon {
  margin-right: 8px;
}

.sidebar-footer {
  padding-top: 12px;
  margin-top: auto;
}

.footer-item {
  color: #64748b;
  font-size: 13px;
}

.footer-item:hover {
  color: #1e40af;
  background-color: #f8fafc;
}
</style>
