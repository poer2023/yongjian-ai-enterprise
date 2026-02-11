<script setup lang="ts">
import { ref } from 'vue';
import { Edit3 } from 'lucide-vue-next';

const teamInfo = ref({
  logo: '⚖️',
  name: '涌见AI企业版',
  shortName: '涌见AI',
  slogan: 'AI企业助手',
  scale: '6人/100人',
  expireDate: '2027-01-15 00:00:00',
  searchCount: '0次/1000次',
  coins: '289万/3000万硬币',
  questionCount: '1次/1000万次',
  storageSpace: '1MB/100GB'
});
</script>

<template>
  <div class="team-overview">
    <div class="content-header">
      <h1 class="page-title">团队概览</h1>
    </div>
    <div class="info-card">
      <div class="card-header">
        <h2 class="card-title">团队信息</h2>
        <button class="edit-btn"><Edit3 :size="14" />编辑</button>
      </div>
      <div class="info-list">
        <div class="info-row">
          <span class="info-label">团队LOGO</span>
          <div class="info-value"><div class="team-logo"><span class="logo-emoji">⚖️</span></div></div>
        </div>
        <div class="info-row"><span class="info-label">团队名称</span><span class="info-value">{{ teamInfo.name }}</span></div>
        <div class="info-row"><span class="info-label">团队简称</span><span class="info-value">{{ teamInfo.shortName }}</span></div>
        <div class="info-row"><span class="info-label">团队标语</span><span class="info-value">{{ teamInfo.slogan }}</span></div>
        <div class="info-row"><span class="info-label">团队规模</span><span class="info-value">{{ teamInfo.scale }}</span></div>
        <div class="info-row"><span class="info-label">团队有效期</span><span class="info-value">{{ teamInfo.expireDate }}</span></div>
        <div class="info-row"><span class="info-label">学术搜索次数</span><span class="info-value">{{ teamInfo.searchCount }}</span></div>
        <div class="info-row"><span class="info-label">共享硬币</span><span class="info-value">{{ teamInfo.coins }}</span></div>
        <div class="info-row"><span class="info-label">提问次数</span><span class="info-value">{{ teamInfo.questionCount }}</span></div>
        <div class="info-row"><span class="info-label">知识库空间</span><span class="info-value">{{ teamInfo.storageSpace }}</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-overview { width: 100%; max-width: 700px; }
.content-header { margin-bottom: 24px; }
.page-title { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0; }
.info-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px 32px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.card-title { font-size: 16px; font-weight: 600; color: #1e293b; margin: 0; }
.edit-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; color: #3b82f6; font-size: 13px; font-weight: 500; cursor: pointer; }
.edit-btn:hover { background: #f8fafc; border-color: #93c5fd; }
.info-list { display: flex; flex-direction: column; }
.info-row { display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
.info-row:last-child { border-bottom: none; }
.info-label { width: 120px; font-size: 14px; color: #64748b; flex-shrink: 0; }
.info-value { flex: 1; font-size: 14px; color: #1e293b; }
.team-logo { width: 64px; height: 64px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid #93c5fd; }
.logo-emoji { font-size: 32px; }
</style>
