<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  LayoutList,
  Users,
  UsersRound,
  Bot,
  Coins,
  Bell,
  Database
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// Menu items mapped to child route names
const menuItems = [
  { icon: LayoutList, label: '团队概览', id: 'team-overview' },
  { icon: Users, label: '成员管理', id: 'team-members' },
  { icon: UsersRound, label: '小组管理', id: 'team-groups' },
  { icon: Bot, label: '智能体管理', id: 'team-agents' },
  { icon: Coins, label: '权益明细', id: 'team-benefits' },
  { icon: Bell, label: '标讯订阅', id: 'team-bid-subscription' },
  { icon: Database, label: '企业总库', id: 'team-enterprise-library' }
];

const activeMenu = computed(() => route.name as string);

const handleMenuClick = (id: string) => {
  router.push({ name: id });
};
</script>

<template>
  <div class="team-manage-page">
    <!-- Sidebar Menu -->
    <aside class="sub-menu">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="menu-item"
        :class="{ active: activeMenu === item.id }"
        @click="handleMenuClick(item.id)"
      >
        <component :is="item.icon" :size="18" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </div>
    </aside>

    <!-- Main Content via child routes -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.team-manage-page { display: flex; height: 100%; background: #f8fafc; }

/* Sidebar */
.sub-menu { width: 180px; background: white; border-right: 1px solid #e2e8f0; padding: 20px 12px; flex-shrink: 0; }
.menu-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; color: #475569; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; font-size: 14px; font-weight: 500; }
.menu-item:hover { background: #f8fafc; color: #1e40af; }
.menu-item.active { background: #dbeafe; color: #3b82f6; font-weight: 600; }

/* Main Content */
.main-content { flex: 1; padding: 32px 40px; overflow-y: auto; display: flex; flex-direction: column; align-items: center; }
</style>
