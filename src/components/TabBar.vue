<template>
  <div class="tab-bar">
    <div class="tabs-scroll-container">
      <div
        v-for="(buffer, index) in editorStore.buffers"
        :key="buffer.id"
        class="tab-item"
        :class="{ active: index === editorStore.activeBufferIndex }"
        @click="editorStore.switchBuffer(index)"
      >
        <span class="tab-name">
          {{ getFileName(buffer) }}
          <span v-if="buffer.isDirty" class="dirty-dot">●</span>
        </span>
        <button class="close-btn" @click.stop="handleClose(index)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
    <button class="add-tab-btn" @click="editorStore.newBuffer()" title="New Tab">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { promptUnsavedChanges } from '../composables/useUnsavedPrompt';
import { saveFile } from '../services/fileService';

const editorStore = useEditorStore();

const getFileName = (buffer) => {
  if (!buffer.filePath) return 'Untitled';
  return buffer.filePath.split(/[\\/]/).pop();
};

const handleClose = async (index) => {
  const buffer = editorStore.buffers[index];
  if (buffer.isDirty) {
    // We temporarily switch to this buffer to use the existing prompt logic
    const prevIndex = editorStore.activeBufferIndex;
    editorStore.switchBuffer(index);
    
    const choice = await promptUnsavedChanges();
    if (choice === 'cancel') {
      editorStore.switchBuffer(prevIndex);
      return;
    }
    if (choice === 'save') {
      const saved = await saveFile(editorStore);
      if (!saved) {
        editorStore.switchBuffer(prevIndex);
        return;
      }
    }
  }
  editorStore.closeBuffer(index);
};
</script>

<style scoped>
.tab-bar {
  display: flex;
  align-items: center;
  background: var(--toolbar-bg);
  border-bottom: 1px solid var(--border-color);
  height: 36px;
  padding: 0 8px;
  user-select: none;
}

.tabs-scroll-container {
  display: flex;
  overflow-x: auto;
  flex: 1;
  height: 100%;
  scrollbar-width: none; /* Firefox */
}

.tabs-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 0 12px;
  min-width: 100px;
  max-width: 200px;
  height: 100%;
  border-right: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.tab-item:hover {
  background: rgba(0, 0, 0, 0.08);
}

.tab-item.active {
  background: var(--bg-color);
  color: var(--text-color);
  border-bottom: 2px solid var(--accent-color);
}

.tab-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.dirty-dot {
  color: var(--accent-color);
  margin-left: 4px;
  font-size: 0.6rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.add-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  margin-left: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.add-tab-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-color);
}
</style>
