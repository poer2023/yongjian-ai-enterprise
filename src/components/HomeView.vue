<script setup lang="ts">
import ChatInput from './ChatInput.vue';
import AppGrid from './AppGrid.vue';
import { BrainCircuit, ChevronRight } from 'lucide-vue-next';
</script>

<template>
  <div class="home-view">
    <div class="content-wrapper">
      <!-- Big Center Title -->
      <div class="center-title-area">
        <h1 class="main-title">
          金盾检测 <span class="separator">|</span> <span class="highlight">AI企业助手</span>
        </h1>
      </div>

      <!-- Chat Input Area -->
      <div class="chat-area">
        <div class="knowledge-base-btn">
          <BrainCircuit :size="16" class="kb-icon" />
          <span class="kb-text">知识库</span>
          <ChevronRight :size="14" class="kb-chevron" />
        </div>
        <ChatInput />
      </div>

      <!-- App Grid -->
      <div class="apps-section">
        <h2 class="section-title">智能应用</h2>
        <AppGrid />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 32px 40px;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.center-title-area {
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.separator {
  color: #94a3b8;
  font-weight: 400;
  margin: 0 4px;
}

.highlight {
  color: #3b82f6;
  font-weight: 600;
}

.chat-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 48px;
  position: relative;
}

.knowledge-base-btn {
  position: absolute;
  top: -50px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 10px 18px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  color: #1e3a8a;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.knowledge-base-btn:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.kb-icon {
  color: #3b82f6;
}

.kb-text {
  font-weight: 500;
}

.kb-chevron {
  color: #94a3b8;
}

.apps-section {
  margin-top: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 3px solid #3b82f6;
}
</style>
