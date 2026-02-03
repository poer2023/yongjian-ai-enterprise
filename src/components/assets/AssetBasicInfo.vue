<script setup lang="ts">
import { ref } from 'vue';
import { Building2, MapPin, Phone, Mail, Globe, Edit } from 'lucide-vue-next';

const companyInfo = ref({
  name: '上海永健建设工程检测有限公司',
  legalPerson: '张三',
  registeredCapital: '5000万元',
  establishDate: '2010-05-15',
  address: '上海市浦东新区张江高科技园区',
  phone: '021-12345678',
  email: 'contact@yongjian.com',
  website: 'www.yongjian.com',
  businessScope: '建设工程质量检测、建筑材料检测、钢结构检测、地基基础检测'
});
</script>

<template>
  <div class="asset-basic-info">
    <div class="info-card">
      <div class="card-header">
        <div class="header-left">
          <Building2 :size="20" />
          <span>企业基本信息</span>
        </div>
        <button class="edit-btn">
          <Edit :size="14" />
          编辑
        </button>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <label>企业名称</label>
          <span>{{ companyInfo.name }}</span>
        </div>
        <div class="info-item">
          <label>法定代表人</label>
          <span>{{ companyInfo.legalPerson }}</span>
        </div>
        <div class="info-item">
          <label>注册资本</label>
          <span>{{ companyInfo.registeredCapital }}</span>
        </div>
        <div class="info-item">
          <label>成立日期</label>
          <span>{{ companyInfo.establishDate }}</span>
        </div>
        <div class="info-item full-width">
          <label><MapPin :size="14" /> 企业地址</label>
          <span>{{ companyInfo.address }}</span>
        </div>
        <div class="info-item">
          <label><Phone :size="14" /> 联系电话</label>
          <span>{{ companyInfo.phone }}</span>
        </div>
        <div class="info-item">
          <label><Mail :size="14" /> 邮箱</label>
          <span>{{ companyInfo.email }}</span>
        </div>
        <div class="info-item">
          <label><Globe :size="14" /> 网站</label>
          <span>{{ companyInfo.website }}</span>
        </div>
        <div class="info-item full-width">
          <label>经营范围</label>
          <span>{{ companyInfo.businessScope }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-basic-info {
  width: 100%;
}

.info-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #f8fafc;
  color: #3b82f6;
  border-color: #3b82f6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-item label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
}

.info-item span {
  font-size: 14px;
  color: #1e293b;
}
</style>
