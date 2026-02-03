<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  FileText,
  Loader2,
  Check
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const progress = ref(0);
const currentStep = ref(0);
let timer: ReturnType<typeof setInterval>;

const steps = [
  { name: '解析招标文件', desc: '提取项目要求与评分标准' },
  { name: '匹配素材资源', desc: '关联企业信息、资质、业绩' },
  { name: '生成技术方案', desc: 'AI智能撰写技术标内容' },
  { name: '生成商务文件', desc: '整合企业介绍与项目业绩' },
  { name: '格式校验与排版', desc: '检查废标项与签章位置' },
];

onMounted(() => {
  timer = setInterval(() => {
    if (progress.value < 95) {
      if (progress.value < 30) {
        progress.value += 1.5;
      } else if (progress.value < 60) {
        progress.value += 1;
      } else if (progress.value < 85) {
        progress.value += 0.5;
      } else {
        progress.value += 0.2;
      }

      // Update steps based on progress
      if (progress.value > 20) currentStep.value = 1;
      if (progress.value > 40) currentStep.value = 2;
      if (progress.value > 60) currentStep.value = 3;
      if (progress.value > 80) currentStep.value = 4;
    }
  }, 100);
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

const getStepStatus = (index: number) => {
  if (index < currentStep.value) return 'completed';
  if (index === currentStep.value) return 'active';
  return 'pending';
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
        <p class="page-desc">请耐心等待，AI正在为您生成专业标书</p>
      </div>
    </header>

    <main class="main-content">
      <div class="status-card">
        <h2 class="status-title">生成进度</h2>

        <!-- Current Step Active Display -->
        <div class="active-step">
          <div class="step-icon-wrapper">
            <Loader2 :size="20" class="spinner" />
          </div>
          <div class="step-info">
            <div class="step-name">{{ steps[currentStep]?.name || '处理中...' }}</div>
            <div class="step-sub">{{ steps[currentStep]?.desc || '请稍候' }}</div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-labels">
            <span>处理进度</span>
            <span>正在进行第 {{ currentStep + 1 }} 步 / 共 {{ steps.length }} 步</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: Math.min(progress, 100) + '%' }"></div>
          </div>
        </div>

        <!-- Steps List -->
        <div class="steps-list">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-item"
            :class="getStepStatus(index)"
          >
            <div class="step-indicator">
              <Check v-if="getStepStatus(index) === 'completed'" :size="12" />
              <Loader2 v-else-if="getStepStatus(index) === 'active'" :size="12" class="spinner" />
              <span v-else class="step-dot"></span>
            </div>
            <div class="step-content">
              <span class="step-title">{{ step.name }}</span>
              <span class="step-desc">{{ step.desc }}</span>
            </div>
            <span class="step-status-text">
              {{ getStepStatus(index) === 'completed' ? '已完成' : getStepStatus(index) === 'active' ? '进行中' : '等待中' }}
            </span>
          </div>
        </div>
      </div>

      <div class="tips-card">
        <p>AI标书生成大约需要 2-5 分钟，后续可在 <a href="#">个人中心-使用记录</a> 中查看；遇到复杂项目或排队情况可能需要等待更久，感谢理解~</p>

        <div class="manual-action">
           <button class="skip-btn" @click="handleSkip">
             进入结果页 (测试用)
           </button>
        </div>
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
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.status-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.active-step {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #93c5fd;
}

.step-icon-wrapper {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.spinner {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.step-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.step-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

.progress-section {
  margin-bottom: 24px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.progress-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Steps List */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.3s;
}

.step-item.active {
  background: #eff6ff;
  border: 1px solid #93c5fd;
}

.step-item.completed {
  background: #eff6ff;
}

.step-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #94a3b8;
  flex-shrink: 0;
}

.step-item.active .step-indicator {
  background: #3b82f6;
  color: white;
}

.step-item.completed .step-indicator {
  background: #3b82f6;
  color: white;
}

.step-dot {
  width: 8px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 50%;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.step-title {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.step-desc {
  font-size: 12px;
  color: #94a3b8;
}

.step-item.active .step-title {
  color: #1e40af;
}

.step-item.active .step-desc {
  color: #3b82f6;
}

.step-status-text {
  font-size: 12px;
  color: #94a3b8;
}

.step-item.active .step-status-text {
  color: #3b82f6;
  font-weight: 500;
}

.step-item.completed .step-status-text {
  color: #3b82f6;
}

.tips-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  text-align: center;
}

.tips-card p {
  margin: 0;
}

.tips-card a {
  color: #3b82f6;
  text-decoration: none;
}

.tips-card a:hover {
  text-decoration: underline;
}

.manual-action {
  margin-top: 24px;
}

.skip-btn {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.skip-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
</style>
