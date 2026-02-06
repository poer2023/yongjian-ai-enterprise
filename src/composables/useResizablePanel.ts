// Composable for resizable panel logic
import { ref, onMounted, onUnmounted } from 'vue';

export interface ResizablePanelOptions {
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

export function useResizablePanel(options: ResizablePanelOptions = {}) {
  const { minWidth = 200, maxWidth = 600, defaultWidth = 320 } = options;
  
  const panelWidth = ref(defaultWidth);
  const isResizing = ref(false);
  
  let startX = 0;
  let startWidth = 0;
  
  const startResize = (e: MouseEvent) => {
    isResizing.value = true;
    startX = e.clientX;
    startWidth = panelWidth.value;
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return;
    
    const diff = startX - e.clientX;
    const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + diff));
    panelWidth.value = newWidth;
  };
  
  const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopResize);
  });
  
  return {
    panelWidth,
    isResizing,
    startResize,
  };
}

export interface HorizontalSplitOptions {
  minLeftWidth?: number;
  minRightWidth?: number;
  defaultLeftWidth?: number;
}

export function useHorizontalSplitPanel(options: HorizontalSplitOptions = {}) {
  const { minLeftWidth = 200, minRightWidth = 200, defaultLeftWidth = 300 } = options;
  
  const leftWidth = ref(defaultLeftWidth);
  const isDragging = ref(false);
  
  let containerWidth = 0;
  
  const startDrag = (e: MouseEvent, container: HTMLElement) => {
    isDragging.value = true;
    containerWidth = container.offsetWidth;
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return;
    
    const maxLeft = containerWidth - minRightWidth;
    const newLeft = Math.min(maxLeft, Math.max(minLeftWidth, e.clientX));
    leftWidth.value = newLeft;
  };
  
  const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  });
  
  return {
    leftWidth,
    isDragging,
    startDrag,
  };
}
