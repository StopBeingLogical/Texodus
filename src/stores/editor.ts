import { defineStore } from 'pinia';

export interface EditorBuffer {
  id: string;
  content: string;
  filePath: string | null;
  isDirty: boolean;
}

interface EditorState {
  buffers: EditorBuffer[];
  activeBufferIndex: number;
  aboutVisible: boolean;
}

const createEmptyBuffer = (): EditorBuffer => ({
  id: crypto.randomUUID(),
  content: '',
  filePath: null,
  isDirty: false,
});

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    buffers: [createEmptyBuffer()],
    activeBufferIndex: 0,
    aboutVisible: false,
  }),
  getters: {
    activeBuffer(state): EditorBuffer {
      return state.buffers[state.activeBufferIndex] || state.buffers[0];
    },
    content(state): string {
      return this.activeBuffer.content;
    },
    filePath(state): string | null {
      return this.activeBuffer.filePath;
    },
    isDirty(state): boolean {
      return this.activeBuffer.isDirty;
    },
    hasDirtyBuffers(state): boolean {
      return state.buffers.some((b) => b.isDirty);
    },
  },
  actions: {
    updateContent(newContent: string) {
      const b = this.activeBuffer;
      if (b.content === newContent) return;
      b.content = newContent;
      b.isDirty = true;
    },
    setFilePath(path: string | null) {
      this.activeBuffer.filePath = path;
    },
    setDirty(dirty: boolean) {
      this.activeBuffer.isDirty = dirty;
    },
    setAboutVisible(visible: boolean) {
      this.aboutVisible = visible;
    },
    loadFile(content: string, path: string | null) {
      // If we only have one empty buffer, replace it. Otherwise add new.
      const b = this.activeBuffer;
      if (this.buffers.length === 1 && !b.content && !b.filePath && !b.isDirty) {
        b.content = content;
        b.filePath = path;
        b.isDirty = false;
      } else {
        const newBuffer: EditorBuffer = {
          id: crypto.randomUUID(),
          content,
          filePath: path,
          isDirty: false,
        };
        this.buffers.push(newBuffer);
        this.activeBufferIndex = this.buffers.length - 1;
      }
    },
    newBuffer() {
      const nb = createEmptyBuffer();
      this.buffers.push(nb);
      this.activeBufferIndex = this.buffers.length - 1;
    },
    switchBuffer(index: number) {
      if (index >= 0 && index < this.buffers.length) {
        this.activeBufferIndex = index;
      }
    },
    closeBuffer(index: number) {
      if (this.buffers.length <= 1) {
        this.reset();
        return;
      }
      this.buffers.splice(index, 1);
      if (this.activeBufferIndex >= this.buffers.length) {
        this.activeBufferIndex = this.buffers.length - 1;
      }
    },
    reset() {
      this.buffers = [createEmptyBuffer()];
      this.activeBufferIndex = 0;
    },
  },
});
