<script setup lang="ts">
defineProps<{
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}>();

// Determine score level based on value
const getScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
};

const getLevelText = (level: 'high' | 'medium' | 'low'): string => {
  const texts = {
    high: '高匹配',
    medium: '中匹配',
    low: '低匹配'
  };
  return texts[level];
};
</script>

<template>
  <div class="score-display" :class="[`size-${size || 'md'}`]">
    <div class="score-circle" :class="`score-${getScoreLevel(score)}`">
      <span class="score-value">{{ score }}</span>
      <span class="score-label">{{ label || '分' }}</span>
    </div>
    <span v-if="showText" class="score-text">{{ getLevelText(getScoreLevel(score)) }}</span>
  </div>
</template>

<style scoped>
.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.score-circle {
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid #22c55e;
  background: #f0fdf4;
}

/* Size variants */
.size-sm .score-circle {
  width: 60px;
  height: 60px;
  border-width: 3px;
}

.size-md .score-circle {
  width: 80px;
  height: 80px;
  border-width: 4px;
}

.size-lg .score-circle {
  width: 100px;
  height: 100px;
  border-width: 4px;
}

/* Score level colors */
.score-circle.score-high {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: #22c55e;
}

.score-circle.score-medium {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.score-circle.score-low {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #94a3b8;
}

.score-value {
  font-weight: 700;
  line-height: 1;
  color: #1e293b;
}

.size-sm .score-value { font-size: 20px; }
.size-md .score-value { font-size: 28px; }
.size-lg .score-value { font-size: 32px; }

.score-circle.score-high .score-value { color: #16a34a; }
.score-circle.score-medium .score-value { color: #d97706; }
.score-circle.score-low .score-value { color: #dc2626; }

.score-label {
  color: #64748b;
  margin-top: 2px;
}

.size-sm .score-label { font-size: 10px; }
.size-md .score-label { font-size: 12px; }
.size-lg .score-label { font-size: 12px; }

.score-text {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}
</style>
