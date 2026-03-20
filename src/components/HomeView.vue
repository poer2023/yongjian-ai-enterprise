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
          企业版 <span class="separator">|</span> <span class="highlight">AI企业助手</span>
        </h1>
      </div>

      <!-- Chat Input Area with Knowledge Base Button -->
      <div class="chat-area">
        <!-- Knowledge Base Button - positioned relative to chat area -->
        <div class="kb-container">
          <div class="knowledge-base-btn">
            <BrainCircuit :size="16" class="kb-icon" />
            <span class="kb-text">知识库</span>
            <ChevronRight :size="14" class="kb-chevron" />
          </div>
        </div>
        <ChatInput />
      </div>

      <!-- App Grid - 无标题 -->
      <div class="apps-section">
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background: #f8fafc;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.center-title-area {
  text-align: center;
  margin-bottom: 24px;
}

.main-title {
  font-size: 32px;
  font-weight: 700;
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
  font-weight: 700;
}

.chat-area {
  width: 100%;
  max-width: 100%;
  margin: 0 auto 40px;
  position: relative;
}

.kb-container {
  position: absolute;
  top: -48px;
  right: 0;
}

.knowledge-base-btn {
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
  margin-top: 0;
}
</style>
