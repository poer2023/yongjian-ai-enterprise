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
              {{ sub.title }}
            </div>
            <!-- Level 3 -->
            <template v-if="sub.children">
              <template v-for="sub3 in sub.children" :key="sub3.id">
                <div
                  class="outline-item level-3"
                  :class="{ active: activeOutlineId === sub3.id }"
                  @click="$emit('select', sub3.id)"
                >
                  {{ sub3.title }}
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
                    {{ sub4.title }}
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
  padding: 12px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.6;
  margin-bottom: 2px;
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
</style>
