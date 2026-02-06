<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  ChevronLeft,
  Type,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Grid3X3,
  Code,
  Sparkles,
  History
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// Import sub-components
import OutlinePanel from './OutlinePanel.vue';
import AiToolsPanel from './AiToolsPanel.vue';
import SectionBlock from './components/SectionBlock.vue';
import VersionPanel from './components/VersionPanel.vue';

// Import mock data
import {
  outlineItemsData,
  mockContents,
  scoringPoints,
  recommendedMaterials,
  materialDetails,
  enterpriseMaterialsData,
  manualUploadsData,
  type OutlineItem,
  type Material,
  type MaterialDetail,
  type EnterpriseMaterial,
  type ManualUpload,
  type SectionContent
} from '@/mocks/bidDocSkeleton';

const router = useRouter();

// ============ State Management ============

// Right panel resizable state
const rightPanelWidth = ref(320);
const isResizing = ref(false);
const minPanelWidth = 280;
const maxPanelWidth = 480;

// Outline state
const outlineItems = ref<OutlineItem[]>(outlineItemsData);
const activeOutlineId = ref('section-1-1');

// Generation state
const generatedSections = ref<Set<string>>(new Set());
const generatingSection = ref<string | null>(null);
const streamingContent = ref<Record<string, string>>({});
const userEditedContent = ref<Record<string, string>>({});

// Right panel tab state
const activeRightTab = ref<'node' | 'materials'>('node');
const materialSearchQuery = ref('');

// Scoring points completion tracking
const completedPoints = ref<Set<string>>(new Set());
const isDetecting = ref(false);

// Enterprise materials
const enterpriseMaterials = ref<EnterpriseMaterial[]>(enterpriseMaterialsData);
const manualUploads = ref<ManualUpload[]>(manualUploadsData);

// Inserted materials tracking
const insertedMaterials = ref<Set<string>>(new Set());

// Preview modal state
const showPreviewModal = ref(false);
const previewingMaterial = ref<MaterialDetail | null>(null);

// Version panel state
const showVersionPanel = ref(false);

// Manual scrolling flag
const isManualScrolling = ref(false);

// ============ Computed Properties ============

// Flatten sections for content display (recursive to handle all levels)
const flattenSections = (): OutlineItem[] => {
  const result: OutlineItem[] = [];
  const addSection = (section: OutlineItem) => {
    result.push(section);
    if (section.children) {
      section.children.forEach(child => addSection(child));
    }
  };
  outlineItems.value.forEach(section => addSection(section));
  return result;
};

const allSections = computed(() => flattenSections());

// Get current section info (recursive search)
const currentSection = computed(() => {
  const findSection = (sections: OutlineItem[], id: string): { id: string; title: string } | null => {
    for (const section of sections) {
      if (section.id === id) return { id: section.id, title: section.title };
      if (section.children) {
        const found = findSection(section.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  return findSection(outlineItems.value, activeOutlineId.value);
});

// Get scoring points for current section
const currentScoringPoints = computed(() => {
  return scoringPoints[activeOutlineId.value] || ['暂无评分要点'];
});

// Get recommended materials for current section
const currentMaterials = computed(() => {
  return recommendedMaterials[activeOutlineId.value] || [];
});

// Check if current section content is generated
const isCurrentSectionGenerated = computed(() => {
  return generatedSections.value.has(activeOutlineId.value);
});

// Check if any section is currently generating
const isAnyGenerating = computed(() => {
  return generatingSection.value !== null;
});

// Count remaining sections
const remainingSectionsCount = computed(() => {
  const level2Sections = allSections.value.filter(s => s.level === 2);
  return level2Sections.filter(s => !generatedSections.value.has(s.id)).length;
});

// Get completion stats for current section
const completionStats = computed(() => {
  const points = scoringPoints[activeOutlineId.value] || [];
  const total = points.length;
  let completed = 0;
  points.forEach((_, index) => {
    if (completedPoints.value.has(`${activeOutlineId.value}-${index}`)) {
      completed++;
    }
  });
  return { completed, total };
});

// ============ Resize Handlers ============

const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return;
  const container = document.querySelector('.result-body');
  if (!container) return;
  const containerRect = container.getBoundingClientRect();
  const newWidth = containerRect.right - e.clientX;
  if (newWidth >= minPanelWidth && newWidth <= maxPanelWidth) {
    rightPanelWidth.value = newWidth;
  }
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// ============ Scroll Tracking ============

const setupScrollTracking = () => {
  const contentPanel = document.querySelector('.content-panel');
  if (!contentPanel) return;

  let scrollTimer: ReturnType<typeof setTimeout> | null = null;

  const handleScroll = () => {
    if (isManualScrolling.value) return;
    if (scrollTimer) return;

    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      const headings = document.querySelectorAll('h3.subsection-heading[id]');
      const panelRect = contentPanel.getBoundingClientRect();
      const targetY = panelRect.top + 100;

      let closestSection = '';
      let closestDistance = Infinity;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const headingY = rect.top;
        if (headingY <= targetY) {
          const distance = targetY - headingY;
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = heading.id;
          }
        }
      });

      if (!closestSection) {
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top >= panelRect.top && rect.top <= panelRect.bottom) {
            if (!closestSection) {
              closestSection = heading.id;
            }
          }
        });
      }

      if (closestSection && closestSection !== activeOutlineId.value) {
        activeOutlineId.value = closestSection;
      }
    }, 50);
  };

  contentPanel.addEventListener('scroll', handleScroll);

  (window as any).__scrollCleanup = () => {
    contentPanel.removeEventListener('scroll', handleScroll);
    if (scrollTimer) clearTimeout(scrollTimer);
  };
};

const cleanupScrollTracking = () => {
  if ((window as any).__scrollCleanup) {
    (window as any).__scrollCleanup();
    delete (window as any).__scrollCleanup;
  }
};

// ============ Content Methods ============

const getSectionContent = (sectionId: string): SectionContent => {
  return mockContents[sectionId] || {
    type: 'text',
    content: `本节内容已生成完成。

根据招标文件要求，我方对本节内容作出如下响应：

1. 我方完全理解并接受招标文件中的相关要求；
2. 我方具备履行本节要求的能力和资质；
3. 我方承诺按照招标文件规定的标准和要求执行。

投标人：金盾检测技术股份有限公司
日期：2025年11月26日`
  };
};

const getSectionTextContent = (sectionId: string): string => {
  const content = getSectionContent(sectionId);
  return content.content;
};

const getEditableContent = (sectionId: string): string => {
  if (userEditedContent.value[sectionId] !== undefined) {
    return userEditedContent.value[sectionId];
  }
  if (streamingContent.value[sectionId]) {
    return streamingContent.value[sectionId];
  }
  if (generatedSections.value.has(sectionId)) {
    return getSectionTextContent(sectionId);
  }
  return '';
};

const hasContent = (sectionId: string): boolean => {
  return !!(
    userEditedContent.value[sectionId]?.trim() ||
    streamingContent.value[sectionId]?.trim() ||
    generatedSections.value.has(sectionId)
  );
};

// ============ Generation Methods ============

const generateSection = async (sectionId: string) => {
  generatingSection.value = sectionId;
  streamingContent.value[sectionId] = '';

  const fullContent = getSectionTextContent(sectionId);
  const chars = fullContent.split('');

  for (let i = 0; i < chars.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 15));
    streamingContent.value[sectionId] += chars[i];
  }

  userEditedContent.value[sectionId] = streamingContent.value[sectionId];
  generatedSections.value.add(sectionId);
  generatingSection.value = null;
};

const generateAllRemaining = async () => {
  const level2Sections = allSections.value.filter(s => s.level === 2);
  const remainingSections = level2Sections.filter(s => !generatedSections.value.has(s.id));

  for (const section of remainingSections) {
    await generateSection(section.id);
  }
};

const regenerateCurrentSection = async () => {
  if (activeOutlineId.value && activeOutlineId.value.split('-').length > 2) {
    generatedSections.value.delete(activeOutlineId.value);
    await generateSection(activeOutlineId.value);
  }
};

// ============ Navigation Methods ============

const goBack = () => {
  router.push({ name: 'bid-doc-form' });
};

const selectOutline = (id: string) => {
  isManualScrolling.value = true;
  activeOutlineId.value = id;

  const heading = document.getElementById(id);
  if (heading) {
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  setTimeout(() => {
    isManualScrolling.value = false;
  }, 500);
};

// ============ Scoring Points Methods ============

const toggleScoringPoint = (index: number) => {
  const key = `${activeOutlineId.value}-${index}`;
  if (completedPoints.value.has(key)) {
    completedPoints.value.delete(key);
  } else {
    completedPoints.value.add(key);
  }
};

const detectScoringPoints = async () => {
  const sectionId = activeOutlineId.value;
  const sectionHasContent = generatedSections.value.has(sectionId) ||
                     streamingContent.value[sectionId] ||
                     mockContents[sectionId];

  if (!sectionHasContent) {
    alert('请先生成本节内容，再进行评分要点检测');
    return;
  }

  isDetecting.value = true;
  const points = scoringPoints[sectionId] || [];

  for (let i = 0; i < points.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
    const shouldPass = Math.random() > 0.3;
    if (shouldPass) {
      completedPoints.value.add(`${sectionId}-${i}`);
    } else {
      completedPoints.value.delete(`${sectionId}-${i}`);
    }
  }

  isDetecting.value = false;
};

// ============ Material Methods ============

const insertMaterial = (material: Material) => {
  const detail = materialDetails[material.name];
  if (!detail) {
    alert('素材详情未找到');
    return;
  }

  let insertContent = '';
  if (material.type === 'cert') {
    insertContent = `\n\n【${detail.name}】\n${detail.content}`;
  } else if (material.type === 'case') {
    insertContent = `\n\n【业绩案例：${detail.name}】\n${detail.content}`;
  } else if (material.type === 'team') {
    insertContent = `\n\n【项目成员：${detail.name}】\n${detail.content}`;
  }

  const sectionId = activeOutlineId.value;

  // Get existing content or initialize
  let currentContent = '';
  if (userEditedContent.value[sectionId]) {
    currentContent = userEditedContent.value[sectionId];
  } else if (streamingContent.value[sectionId]) {
    currentContent = streamingContent.value[sectionId];
  } else if (mockContents[sectionId]) {
    currentContent = mockContents[sectionId].content;
  }

  // Set the new content
  userEditedContent.value[sectionId] = currentContent + insertContent;
  generatedSections.value.add(sectionId);

  insertedMaterials.value.add(`${sectionId}-${material.name}`);
};

const previewMaterial = (material: Material) => {
  const detail = materialDetails[material.name];
  if (detail) {
    previewingMaterial.value = detail;
    showPreviewModal.value = true;
  } else {
    alert('素材详情未找到');
  }
};

const insertEnterpriseMaterial = (material: EnterpriseMaterial) => {
  const sectionId = activeOutlineId.value;
  const insertContent = material.type === 'team'
    ? `\n\n【项目成员：${material.name}】\n${material.content}`
    : material.type === 'case'
    ? `\n\n【业绩案例：${material.name}】\n${material.content}`
    : `\n\n【${material.name}】\n${material.content}`;

  // Get existing content or initialize
  let currentContent = '';
  if (userEditedContent.value[sectionId]) {
    currentContent = userEditedContent.value[sectionId];
  } else if (streamingContent.value[sectionId]) {
    currentContent = streamingContent.value[sectionId];
  } else if (mockContents[sectionId]) {
    currentContent = mockContents[sectionId].content;
  }

  // Set the new content
  userEditedContent.value[sectionId] = currentContent + insertContent;
  generatedSections.value.add(sectionId);

  material.inserted = true;
  material.insertedSectionId = sectionId;
};

const previewEnterpriseMaterial = (material: EnterpriseMaterial) => {
  previewingMaterial.value = {
    name: material.name,
    type: material.type,
    description: material.description,
    content: material.content,
    meta: material.meta
  };
  showPreviewModal.value = true;
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewingMaterial.value = null;
};

const jumpToSection = (sectionId: string) => {
  selectOutline(sectionId);
  activeRightTab.value = 'node';
};

// ============ AI Edit ============

const handleAIEdit = (action: string) => {
  alert(`AI ${action}功能：将对「${currentSection.value?.title}」的内容进行${action}`);
};

// ============ Export ============

const exportWord = () => {
  alert('Word文档已导出');
};

// ============ Version Management ============

const openVersionPanel = () => {
  showVersionPanel.value = true;
};

const handleSaveVersion = (name: string, description: string) => {
  console.log('保存版本:', name, description);
  // Demo: just log, no actual persistence
};

const handleRollback = (versionId: string) => {
  console.log('回滚到版本:', versionId);
  // Demo: just log, no actual rollback
};

// ============ Document Input Handler ============

const handleDocumentInput = (event: Event) => {
  const target = event.target as HTMLElement;

  // Sync all h2 titles (level 1)
  const h2Elements = target.querySelectorAll('h2.section-heading');
  h2Elements.forEach((h2) => {
    const id = h2.id;
    const newTitle = h2.textContent?.trim() || '';
    for (const section of outlineItems.value) {
      if (section.id === id) {
        section.title = newTitle;
        break;
      }
    }
  });

  // Sync all h3 titles (level 2)
  const h3Elements = target.querySelectorAll('h3.subsection-heading');
  h3Elements.forEach((h3) => {
    const id = h3.id;
    const newTitle = h3.textContent?.trim() || '';
    for (const section of outlineItems.value) {
      if (section.children) {
        const child = section.children.find(c => c.id === id);
        if (child) {
          child.title = newTitle;
          break;
        }
      }
    }
  });

  // Sync content
  const contentElements = target.querySelectorAll('p.section-content');
  contentElements.forEach((p) => {
    const sectionId = (p as HTMLElement).dataset.sectionId;
    if (sectionId) {
      const content = p.textContent?.trim() || '';
      userEditedContent.value[sectionId] = content;
      if (content) {
        generatedSections.value.add(sectionId);
      } else {
        generatedSections.value.delete(sectionId);
      }
    }
  });
};

// ============ Lifecycle ============

onMounted(() => {
  setupScrollTracking();
});

onUnmounted(() => {
  cleanupScrollTracking();
});
</script>

<template>
  <div class="result-page-fullscreen">
    <!-- Header -->
    <header class="result-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
        </button>
        <div class="header-tag">AI标书生成</div>
        <div class="header-title">信息系统安全等级保护测评（等保2.0）项目投标文件</div>
        <div class="header-status">生成中</div>
      </div>

      <div class="header-right">
        <div class="format-toolbar">
          <button class="toolbar-btn"><Type :size="16" /></button>
          <button class="toolbar-btn"><Undo2 :size="16" /></button>
          <button class="toolbar-btn"><Redo2 :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn text-btn">H1</button>
          <button class="toolbar-btn text-btn">H2</button>
          <button class="toolbar-btn text-btn">H3</button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Bold :size="16" /></button>
          <button class="toolbar-btn"><Italic :size="16" /></button>
          <button class="toolbar-btn"><Underline :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Grid3X3 :size="16" /></button>
          <button class="toolbar-btn"><Code :size="16" /></button>
        </div>
        <button class="version-btn" @click="openVersionPanel">
          <History :size="16" />
          版本管理
        </button>
        <button class="export-btn" @click="exportWord">
          导出Word
        </button>
      </div>
    </header>

    <div class="result-body">
      <!-- Left Outline Panel -->
      <OutlinePanel
        :outline-items="outlineItems"
        :active-outline-id="activeOutlineId"
        @select="selectOutline"
      />

      <!-- Center Content Panel -->
      <main class="content-panel">
        <div class="document-container">
          <div class="document-wrapper">
            <div
              class="skeleton-content"
              contenteditable="true"
              @input="handleDocumentInput"
            >
              <!-- Sections rendered as HTML structure -->
              <template v-for="section in allSections" :key="section.id">
                <!-- Level 1 Section -->
                <h2 v-if="section.level === 1" :id="section.id" class="section-heading">{{ section.title }}</h2>

                <!-- Level 2 Section -->
                <template v-else>
                  <SectionBlock
                    :section-id="section.id"
                    :title="section.title"
                    :content="getEditableContent(section.id)"
                    :section-data="mockContents[section.id]"
                    :is-active="activeOutlineId === section.id"
                    :is-generating="generatingSection === section.id"
                    :has-content="hasContent(section.id)"
                    @generate="generateSection"
                  />
                </template>
              </template>
            </div>
          </div>
        </div>
      </main>

      <!-- Right AI Tools Panel -->
      <AiToolsPanel
        :right-panel-width="rightPanelWidth"
        :active-right-tab="activeRightTab"
        :current-section-title="currentSection?.title || ''"
        :current-scoring-points="currentScoringPoints"
        :current-materials="currentMaterials"
        :is-current-section-generated="isCurrentSectionGenerated"
        :is-any-generating="isAnyGenerating"
        :remaining-sections-count="remainingSectionsCount"
        :completion-stats="completionStats"
        :is-detecting="isDetecting"
        :enterprise-materials="enterpriseMaterials"
        :manual-uploads="manualUploads"
        :material-search-query="materialSearchQuery"
        @update:active-right-tab="activeRightTab = $event"
        @update:material-search-query="materialSearchQuery = $event"
        @start-resize="startResize"
        @toggle-scoring-point="toggleScoringPoint"
        @detect-scoring-points="detectScoringPoints"
        @insert-material="insertMaterial"
        @preview-material="previewMaterial"
        @ai-edit="handleAIEdit"
        @generate-all-remaining="generateAllRemaining"
        @regenerate-current="regenerateCurrentSection"
        @insert-enterprise-material="insertEnterpriseMaterial"
        @preview-enterprise-material="previewEnterpriseMaterial"
        @jump-to-section="jumpToSection"
      />
    </div>

    <!-- Material Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click.self="closePreviewModal">
      <div class="preview-modal">
        <div class="modal-header">
          <div class="modal-title-row">
            <span class="modal-type-tag">{{ previewingMaterial?.type }}</span>
            <h3 class="modal-title">{{ previewingMaterial?.name }}</h3>
          </div>
          <button class="modal-close-btn" @click="closePreviewModal">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">{{ previewingMaterial?.description }}</p>
          <div class="modal-content">
            <pre>{{ previewingMaterial?.content }}</pre>
          </div>
          <div v-if="previewingMaterial?.meta" class="modal-meta">
            <div v-for="(value, key) in previewingMaterial.meta" :key="key" class="meta-item">
              <span class="meta-label">{{ key }}：</span>
              <span class="meta-value">{{ value }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn secondary" @click="closePreviewModal">关闭</button>
          <button
            class="modal-btn primary"
            @click="insertMaterial({ type: 'cert', name: previewingMaterial?.name || '', icon: '' }); closePreviewModal()"
          >
            插入到当前节点
          </button>
        </div>
      </div>
    </div>

    <!-- Version Panel -->
    <VersionPanel
      :is-open="showVersionPanel"
      @close="showVersionPanel = false"
      @save-version="handleSaveVersion"
      @rollback="handleRollback"
    />
  </div>
</template>

<style scoped>
@import './styles.css';
</style>
