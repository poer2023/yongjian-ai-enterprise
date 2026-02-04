<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  FileText,
  Loader2
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const displayedOutline = ref('');
let charIndex = 0;
let timer: ReturnType<typeof setInterval>;

// Mock outline content for streaming display
const fullOutline = `# XX项目技术投标文件

## 第一章 投标函及投标函附录
### 1.1 投标函
### 1.2 法定代表人授权书
### 1.3 投标保证金证明

## 第二章 资格证明文件
### 2.1 企业营业执照
### 2.2 资质证书
### 2.3 业绩证明材料
### 2.4 财务状况证明

## 第三章 技术方案
### 3.1 项目理解与需求分析
#### 3.1.1 项目背景理解
#### 3.1.2 建设目标分析
#### 3.1.3 核心需求梳理
### 3.2 总体设计方案
#### 3.2.1 设计原则
#### 3.2.2 技术架构设计
#### 3.2.3 网络拓扑设计
### 3.3 详细技术方案
#### 3.3.1 硬件部署方案
#### 3.3.2 软件系统方案
#### 3.3.3 安全保障方案
#### 3.3.4 数据管理方案
### 3.4 技术亮点与创新
#### 3.4.1 核心技术优势
#### 3.4.2 差异化竞争力

## 第四章 项目实施方案
### 4.1 项目组织架构
### 4.2 实施进度计划
### 4.3 质量保障措施
### 4.4 风险控制方案

## 第五章 售后服务方案
### 5.1 服务体系介绍
### 5.2 运维服务内容
### 5.3 培训方案
### 5.4 应急响应机制

## 第六章 商务报价
### 6.1 报价总表
### 6.2 分项报价明细
### 6.3 付款方式说明

## 附录
### 附录A 项目团队成员简历
### 附录B 类似项目业绩案例
### 附录C 相关资质证书复印件`;

onMounted(() => {
  // Simulate streaming output
  timer = setInterval(() => {
    if (charIndex < fullOutline.length) {
      // Add multiple characters at once for faster display
      const charsToAdd = Math.min(3, fullOutline.length - charIndex);
      displayedOutline.value += fullOutline.slice(charIndex, charIndex + charsToAdd);
      charIndex += charsToAdd;
    }
  }, 20);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleSkip = () => {
  router.push({
    name: 'bid-doc-result',
    query: route.query
  });
};

const handleSkipToSkeleton = () => {
  router.push({
    name: 'bid-doc-skeleton',
    query: route.query
  });
};
</script>

<template>
  <div class="processing-page">
    <header class="page-header">
      <div class="header-icon">
        <FileText :size="20" />
      </div>
      <div class="header-content">
        <h1 class="page-title">AI标书生成</h1>
        <p class="page-desc">正在为您生成标书大纲...</p>
      </div>
    </header>

    <main class="main-content">
      <div class="outline-card">
        <div class="outline-header">
          <Loader2 :size="16" class="spinner" />
          <span>大纲生成中</span>
        </div>
        <div class="outline-content">
          <pre class="outline-text">{{ displayedOutline }}<span class="cursor">|</span></pre>
        </div>
      </div>

      <div class="action-bar">
        <button class="action-btn secondary" @click="handleSkipToSkeleton">
          进入结果页（空）
        </button>
        <button class="action-btn primary" @click="handleSkip">
          进入结果页（完成）
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.processing-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

.page-header {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 36px;
  height: 36px;
  background: #eff6ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.page-desc {
  font-size: 12px;
  color: #64748b;
  margin: 2px 0 0 0;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.outline-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.outline-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
}

.spinner {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.outline-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 400px;
  max-height: calc(100vh - 300px);
}

.outline-text {
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #334155;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

.cursor {
  animation: blink 1s step-end infinite;
  color: #3b82f6;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-bottom: 24px;
}

.action-btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.secondary {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.action-btn.secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn.primary {
  background: #3b82f6;
  border: none;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}
</style>
