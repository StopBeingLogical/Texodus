<template>
  <div class="stats-menu" ref="menuContainer">
    <button class="trigger icon-only" @click="toggleMenu" title="Document Statistics">
      <span class="trigger-icon" :style="{ '--icon': `url(${iconInfo})` }"></span>
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <div class="menu-header">Document Statistics</div>
      
      <div class="stat-item">
        <span class="stat-label">Words</span>
        <span class="stat-value">{{ wordCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Characters (no spaces)</span>
        <span class="stat-value">{{ charCountNoSpaces }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Characters (with spaces)</span>
        <span class="stat-value">{{ charCount }}</span>
      </div>
      
      <div class="menu-divider"></div>
      
      <div class="stat-item">
        <span class="stat-label">Reading Time</span>
        <span class="stat-value">{{ readingTime }} min</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '../stores/editor';
import iconInfo from '../assets/icons/icons8-info-100.png';

const isOpen = ref(false);
const menuContainer = ref<HTMLElement | null>(null);
const editorStore = useEditorStore();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = (e: MouseEvent) => {
  if (menuContainer.value && !menuContainer.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});

// Statistics Computation
const content = computed(() => editorStore.content || '');

const wordCount = computed(() => {
  const text = content.value.trim();
  if (!text) return 0;
  // A simple word count split by whitespace
  return text.split(/\s+/).filter(word => word.length > 0).length;
});

const charCount = computed(() => content.value.length);

const charCountNoSpaces = computed(() => {
  return content.value.replace(/\s/g, '').length;
});

const readingTime = computed(() => {
  // Average reading speed is ~200 words per minute.
  const minutes = Math.ceil(wordCount.value / 200);
  return minutes > 0 ? minutes : 1;
});
</script>

<style scoped>
.stats-menu {
  position: relative;
  display: inline-block;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  height: 24px;
}

.trigger:hover {
  background: var(--btn-hover);
  color: var(--accent-color);
}

.trigger.icon-only {
  padding: 0.25rem 0.35rem;
}

.trigger-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  background-color: currentColor;
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
  transition: transform 0.15s;
}

.trigger:hover .trigger-icon { transform: scale(1.1); }
.trigger:active { transform: scale(0.94); }

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  width: 280px;
  background: var(--bg-color, #ffffff);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.menu-header {
  padding: 4px 16px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  color: var(--text-color);
  font-size: 0.85rem;
}

.stat-label {
  opacity: 0.8;
  white-space: nowrap;
}

.stat-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 6px 0;
  opacity: 0.6;
}
</style>
