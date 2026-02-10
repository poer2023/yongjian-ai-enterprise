<script setup lang="ts">
import type { OutlineItem } from '@/mocks/bidDocSkeleton';

interface Props {
  outlineItems: OutlineItem[];
  activeOutlineId: string;
}

interface Emits {
  (e: 'select', id: string): void;
}

defineProps<Props>();
defineEmits<Emits>();

const getSourceLabel = (type?: string) => {
  return { 'ai': 'AI', 'material': '素材', 'manual': '手动' }[type || ''] || '';
};

const getSourceClass = (type?: string) => {
  return { 'ai': 'source-ai', 'material': 'source-material', 'manual': 'source-manual' }[type || ''] || '';
};
</script>

<template>
  <aside class="outline-panel">
    <h3 class="outline-title">大纲</h3>
    <div class="outline-list">
      <template v-for="item in outlineItems" :key="item.id">
        <!-- Level 1 -->
        <div
          class="outline-item level-1"
          :class="{ active: activeOutlineId === item.id }"
          @click="$emit('select', item.id)"
        >
          {{ item.title }}
        </div>
        <!-- Level 2 -->
        <template v-if="item.children">
          <template v-for="sub in item.children" :key="sub.id">
            <div
              class="outline-item level-2"
              :class="{ active: activeOutlineId === sub.id }"
              @click="$emit('select', sub.id)"
            >
              <span class="outline-item-text">{{ sub.title }}</span>
              <span v-if="sub.sourceType" class="source-tag" :class="getSourceClass(sub.sourceType)">{{ getSourceLabel(sub.sourceType) }}</span>
            </div>
            <!-- Level 3 -->
            <template v-if="sub.children">
              <template v-for="sub3 in sub.children" :key="sub3.id">
                <div
                  class="outline-item level-3"
                  :class="{ active: activeOutlineId === sub3.id }"
                  @click="$emit('select', sub3.id)"
                >
                  <span class="outline-item-text">{{ sub3.title }}</span>
                  <span v-if="sub3.sourceType" class="source-tag" :class="getSourceClass(sub3.sourceType)">{{ getSourceLabel(sub3.sourceType) }}</span>
                </div>
                <!-- Level 4 -->
                <template v-if="sub3.children">
                  <div
                    v-for="sub4 in sub3.children"
                    :key="sub4.id"
                    class="outline-item level-4"
                    :class="{ active: activeOutlineId === sub4.id }"
                    @click="$emit('select', sub4.id)"
                  >
                    <span class="outline-item-text">{{ sub4.title }}</span>
                    <span v-if="sub4.sourceType" class="source-tag" :class="getSourceClass(sub4.sourceType)">{{ getSourceLabel(sub4.sourceType) }}</span>
                  </div>
                </template>
              </template>
            </template>
          </template>
        </template>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.outline-panel {
  width: 340px;
  background: white;
  border-right: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.outline-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 20px 24px 16px;
  margin: 0;
}

.outline-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 20px;
}

.outline-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.6;
  margin-bottom: 2px;
}

.outline-item-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.outline-item:hover {
  background: #f8f9fb;
}

.outline-item.active {
  background: #eef4ff;
  color: #4b83f0;
}

.outline-item.level-1 {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
}

.outline-item.level-2 {
  padding-left: 28px;
  font-size: 13px;
  color: #666;
}

.outline-item.level-3 {
  padding-left: 44px;
  font-size: 12px;
  color: #888;
}

.outline-item.level-4 {
  padding-left: 60px;
  font-size: 12px;
  color: #999;
}

/* Source Type Tags */
.source-tag {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
}

.source-tag.source-ai {
  background: #f3e8ff;
  color: #7c3aed;
}

.source-tag.source-material {
  background: #e0f2fe;
  color: #0284c7;
}

.source-tag.source-manual {
  background: #fff7ed;
  color: #c2410c;
}
</style>
