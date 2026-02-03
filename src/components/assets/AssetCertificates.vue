<script setup lang="ts">
import { ref } from 'vue';
import { Award, Plus, Eye, Download } from 'lucide-vue-next';

interface Certificate {
  id: number;
  name: string;
  code: string;
  issuer: string;
  validUntil: string;
  status: 'valid' | 'expiring' | 'expired';
}

const certificates = ref<Certificate[]>([
  { id: 1, name: '建设工程质量检测机构资质证书', code: 'ZJZS-2023-001234', issuer: '上海市住建委', validUntil: '2028-01-14', status: 'valid' },
  { id: 2, name: '检验检测机构资质认定证书(CMA)', code: 'CMA-2022-567890', issuer: '上海市市场监管局', validUntil: '2025-05-31', status: 'expiring' },
  { id: 3, name: '安全生产许可证', code: 'AQSC-2023-112233', issuer: '上海市应急管理局', validUntil: '2026-07-31', status: 'valid' },
]);

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = { valid: '有效', expiring: '即将到期', expired: '已过期' };
  return map[status] || status;
};
</script>

<template>
  <div class="asset-certificates">
    <div class="section-header">
      <span class="count">共 {{ certificates.length }} 项资质</span>
      <button class="add-btn"><Plus :size="16" /> 添加资质</button>
    </div>

    <div class="cert-list">
      <div v-for="cert in certificates" :key="cert.id" class="cert-card">
        <div class="cert-icon"><Award :size="24" /></div>
        <div class="cert-info">
          <h4>{{ cert.name }}</h4>
          <p class="cert-code">{{ cert.code }}</p>
          <p class="cert-meta">{{ cert.issuer }} · 有效期至 {{ cert.validUntil }}</p>
        </div>
        <span class="status-badge" :class="cert.status">{{ getStatusLabel(cert.status) }}</span>
        <div class="cert-actions">
          <button><Eye :size="16" /></button>
          <button><Download :size="16" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-certificates { width: 100%; }

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

.cert-list { display: flex; flex-direction: column; gap: 12px; }

.cert-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.cert-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border-radius: 10px;
  color: #3b82f6;
}

.cert-info { flex: 1; }
.cert-info h4 { margin: 0 0 4px 0; font-size: 15px; color: #1e293b; }
.cert-code { margin: 0 0 4px 0; font-size: 13px; color: #64748b; font-family: monospace; }
.cert-meta { margin: 0; font-size: 12px; color: #94a3b8; }

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.status-badge.valid { background: #dcfce7; color: #16a34a; }
.status-badge.expiring { background: #fef3c7; color: #d97706; }
.status-badge.expired { background: #fee2e2; color: #dc2626; }

.cert-actions { display: flex; gap: 8px; }
.cert-actions button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
}
.cert-actions button:hover { background: #eff6ff; color: #3b82f6; }
</style>
