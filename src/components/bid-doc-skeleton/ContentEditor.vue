<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next';
import type { OutlineItem } from '@/mocks/bidDocSkeleton';

interface Props {
  allSections: OutlineItem[];
  activeOutlineId: string;
  generatingSection: string | null;
}

interface Emits {
  (e: 'generate', sectionId: string): void;
  (e: 'document-input', event: Event): void;
  (e: 'document-focus'): void;
}

defineProps<Props>();
defineEmits<Emits>();

// These will be provided by parent via props or expose
const getEditableContent = (sectionId: string): string => {
  // Will be injected by parent
  return '';
};

const hasContent = (sectionId: string): boolean => {
  // Will be injected by parent
  return false;
};

// Expose methods for parent to inject
defineExpose({
  getEditableContent,
  hasContent,
});
</script>

<template>
  <main class="content-panel">
    <div class="document-container">
      <div class="document-wrapper">
        <div
          class="skeleton-content"
          contenteditable="true"
          @input="$emit('document-input', $event)"
          @focus="$emit('document-focus')"
        >
          <!-- Sections rendered as HTML structure -->
          <template v-for="section in allSections" :key="section.id">
            <!-- Level 1 Section -->
            <h2 v-if="section.level === 1" :id="section.id" class="section-heading">{{ section.title }}</h2>

            <!-- Level 2 Section -->
            <template v-else>
              <div class="section-block" :class="{ 'is-active': activeOutlineId === section.id }">
                <h3 :id="section.id" class="subsection-heading">{{ section.title }}</h3>
                <p class="section-content" :data-section-id="section.id">
                  <slot :name="`content-${section.id}`"></slot>
                </p>
                <!-- AI button inside section block -->
                <button
                  v-if="activeOutlineId === section.id && !generatingSection"
                  class="section-ai-btn"
                  contenteditable="false"
                  @click.prevent.stop="$emit('generate', section.id)"
                >
                  <Sparkles :size="14" />
                  AI生成
                </button>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.content-panel {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  background: #f5f7fa;
}

.document-container {
  max-width: 820px;
  margin: 0 auto;
}

.document-wrapper {
  position: relative;
}

.skeleton-content {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 48px 56px;
  min-height: 800px;
  outline: none;
  line-height: 1.8;
}

/* Section Headings */
.section-heading {
  font-size: 18px;
  font-weight: 700;
  margin: 40px 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #4b83f0;
  color: #1a1a1a;
}

.section-heading:first-child {
  margin-top: 0;
}

.subsection-heading {
  font-size: 15px;
  font-weight: 600;
  margin: 24px 0 8px 0;
  color: #1a1a1a;
}

.section-block {
  position: relative;
}

.section-content {
  font-size: 14px;
  color: #333;
  margin: 0 0 20px 0;
  min-height: 1.5em;
  white-space: pre-wrap;
}

.section-content:empty::before {
  content: '在此输入内容...';
  color: #c4c9cf;
}

/* AI button inside section */
.section-ai-btn {
  position: absolute;
  bottom: 24px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #4b83f0 0%, #7c3aed 100%);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(75, 131, 240, 0.3);
}

.section-ai-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(75, 131, 240, 0.4);
}

.streaming-text {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #4b83f0;
  margin-left: 2px;
  animation: blink 0.8s infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
