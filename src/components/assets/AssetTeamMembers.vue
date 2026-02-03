<script setup lang="ts">
import { ref } from 'vue';
import { Users, Plus, MoreVertical } from 'lucide-vue-next';

interface TeamMember {
  id: number;
  name: string;
  title: string;
  certifications: string[];
  experience: string;
}

const members = ref<TeamMember[]>([
  { id: 1, name: '李明', title: '高级工程师', certifications: ['一级建造师', '注册结构工程师'], experience: '15年' },
  { id: 2, name: '王芳', title: '项目经理', certifications: ['一级建造师', 'PMP'], experience: '12年' },
  { id: 3, name: '张伟', title: '技术负责人', certifications: ['注册岩土工程师'], experience: '18年' },
]);
</script>

<template>
  <div class="asset-team-members">
    <div class="section-header">
      <span class="count">共 {{ members.length }} 名成员</span>
      <button class="add-btn"><Plus :size="16" /> 添加成员</button>
    </div>

    <div class="member-list">
      <div v-for="member in members" :key="member.id" class="member-card">
        <div class="member-avatar">{{ member.name.slice(0, 1) }}</div>
        <div class="member-info">
          <h4>{{ member.name }}</h4>
          <p class="member-title">{{ member.title }} · {{ member.experience }}经验</p>
          <div class="cert-tags">
            <span v-for="cert in member.certifications" :key="cert" class="cert-tag">{{ cert }}</span>
          </div>
        </div>
        <button class="more-btn"><MoreVertical :size="16" /></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-team-members { width: 100%; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.count { font-size: 14px; color: #64748b; }

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.member-list { display: flex; flex-direction: column; gap: 12px; }

.member-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.member-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.member-info { flex: 1; }
.member-info h4 { margin: 0 0 4px 0; font-size: 15px; color: #1e293b; }
.member-title { margin: 0 0 8px 0; font-size: 13px; color: #64748b; }

.cert-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.cert-tag {
  padding: 3px 8px;
  background: #f1f5f9;
  border-radius: 4px;
  font-size: 12px;
  color: #475569;
}

.more-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
}
.more-btn:hover { background: #f8fafc; }
</style>
