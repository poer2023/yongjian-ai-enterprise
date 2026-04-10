<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormPageLayout } from './shared';
import {
  FileText,
  Loader2
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const displayedOutline = ref('');
let charIndex = 0;
let timer: ReturnType<typeof setInterval>;
let pluginRedirectTimer: ReturnType<typeof setTimeout> | null = null;

const isPluginFlow = computed(() => route.query.source === 'plugin');

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
  if (isPluginFlow.value) {
    pluginRedirectTimer = setTimeout(() => {
      router.push({
        name: 'bid-doc-plugin-result',
        query: route.query,
      });
    }, 2600);
    return;
  }

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
  if (pluginRedirectTimer) clearTimeout(pluginRedirectTimer);
});

const handleSkipToSkeleton = () => {
  router.push({
    name: 'bid-doc-skeleton',
    query: route.query
  });
};
</script>

<template>
  <FormPageLayout
    v-if="isPluginFlow"
    :icon="FileText"
    title="生成中"
    subtitle="请耐心等待，AI正在为您生成投标文件"
  >
    <div class="doc-waiting-shell">
      <section class="doc-waiting-card">
        <div class="doc-waiting-card-title">生成进度</div>
        <div class="doc-waiting-card-body">
          <div class="doc-waiting-spinner" aria-hidden="true">
            <span class="spinner-dot spinner-dot-top"></span>
            <span class="spinner-dot spinner-dot-right"></span>
            <span class="spinner-dot spinner-dot-bottom"></span>
            <span class="spinner-dot spinner-dot-left"></span>
          </div>
          <p class="doc-waiting-status">生成中...</p>
        </div>
        <div class="doc-waiting-note">
          完成生成大约需要1~3分钟，后续可在 个人中心-使用记录 中查看，感谢理解~
        </div>
      </section>
    </div>
  </FormPageLayout>

  <div v-else class="processing-page">
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
        <button class="action-btn primary" @click="handleSkipToSkeleton">
          按章节生成
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.doc-waiting-shell {
  width: min(100%, 760px);
  min-height: calc(100vh - 188px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 0 40px;
}

.doc-waiting-card {
  width: 100%;
  background: white;
  border: 1px solid #e5edf8;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  min-height: 232px;
  padding: 18px 20px 0;
  overflow: hidden;
}

.doc-waiting-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.doc-waiting-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 124px;
}

.doc-waiting-spinner {
  position: relative;
  width: 28px;
  height: 28px;
  animation: waiting-spinner-rotate 1.8s linear infinite;
}

.spinner-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(180deg, #7db4ff 0%, #3b82f6 100%);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.08);
  animation: waiting-spinner-pulse 1.1s ease-in-out infinite;
}

.spinner-dot-top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.spinner-dot-right {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation-delay: 0.4s;
}

.spinner-dot-bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.6s;
}

.spinner-dot-left {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation-delay: 0.2s;
}

.doc-waiting-status {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  margin: 0;
}

.doc-waiting-note {
  min-height: 68px;
  margin-top: 8px;
  padding: 18px 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  text-align: center;
  border-top: 1px solid #edf2f7;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

@keyframes waiting-spinner-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes waiting-spinner-pulse {
  0%,
  100% {
    opacity: 0.45;
    transform-origin: center;
  }

  50% {
    opacity: 1;
  }
}

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

@media (max-width: 768px) {
  .doc-waiting-shell {
    min-height: auto;
    padding-bottom: 24px;
  }

  .doc-waiting-card {
    min-height: 208px;
    padding: 16px 16px 0;
  }
}
</style>
