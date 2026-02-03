<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Sparkles } from 'lucide-vue-next';
import AssetBasicInfo from './assets/AssetBasicInfo.vue';
import AssetCertificates from './assets/AssetCertificates.vue';
import AssetTeamMembers from './assets/AssetTeamMembers.vue';
import AssetProjectCases from './assets/AssetProjectCases.vue';

const router = useRouter();
const activeTab = ref<'basic' | 'certs' | 'team' | 'cases'>('basic');

const goToUpload = () => {
  router.push({ name: 'asset-upload' });
};
</script>

<template>
  <div class="enterprise-assets">
    <div class="content-header">
      <div class="header-left">
        <h1 class="page-title">企业素材库</h1>
        <p class="page-subtitle">统一管理投标素材，一次配置全员复用</p>
      </div>
      <button class="add-asset-btn" @click="goToUpload">
        <Sparkles :size="16" />
        智能添加素材
      </button>
    </div>

    <div class="asset-tabs">
      <button :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础信息</button>
      <button :class="{ active: activeTab === 'certs' }" @click="activeTab = 'certs'">资质证书</button>
      <button :class="{ active: activeTab === 'team' }" @click="activeTab = 'team'">项目团队</button>
      <button :class="{ active: activeTab === 'cases' }" @click="activeTab = 'cases'">业绩案例</button>
    </div>

    <AssetBasicInfo v-if="activeTab === 'basic'" />
    <AssetCertificates v-else-if="activeTab === 'certs'" />
    <AssetTeamMembers v-else-if="activeTab === 'team'" />
    <AssetProjectCases v-else-if="activeTab === 'cases'" />
  </div>
</template>

<style scoped>
.enterprise-assets {
  width: 100%;
  max-width: 700px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.add-asset-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-asset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.asset-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.asset-tabs button {
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.asset-tabs button:hover {
  background: #f8fafc;
}

.asset-tabs button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
</style>
