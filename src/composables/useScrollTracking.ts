// Composable for scroll tracking logic
import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export interface ScrollTrackingOptions {
  throttleMs?: number;
  offset?: number;
}

export function useScrollTracking(
  containerRef: Ref<HTMLElement | null>,
  sectionIds: string[],
  options: ScrollTrackingOptions = {}
) {
  const { throttleMs = 100, offset = 100 } = options;
  
  const activeSection = ref(sectionIds[0] || '');
  
  let throttleTimer: number | null = null;
  
  const handleScroll = () => {
    if (throttleTimer) return;
    
    throttleTimer = window.setTimeout(() => {
      throttleTimer = null;
      
      const container = containerRef.value;
      if (!container) return;
      
      const scrollTop = container.scrollTop;
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        if (!sectionId) continue;
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop - offset <= scrollTop) {
          activeSection.value = sectionId;
          break;
        }
      }
    }, throttleMs);
  };
  
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      activeSection.value = sectionId;
    }
  };
  
  onMounted(() => {
    const container = containerRef.value;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
  });
  
  onUnmounted(() => {
    const container = containerRef.value;
    if (container) {
      container.removeEventListener('scroll', handleScroll);
    }
    if (throttleTimer) {
      clearTimeout(throttleTimer);
    }
  });
  
  return {
    activeSection,
    scrollToSection,
  };
}

export function useIntersectionTracking(
  sectionIds: string[],
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const { threshold = 0.5, rootMargin = '0px' } = options;
  
  const visibleSection = ref(sectionIds[0] || '');
  
  let observer: IntersectionObserver | null = null;
  
  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSection.value = entry.target.id;
            break;
          }
        }
      },
      { threshold, rootMargin }
    );
    
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }
  });
  
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
  
  return {
    visibleSection,
  };
}
