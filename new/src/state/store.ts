import { defineStore } from 'pinia';

type Position = {
  x: number;
  y: number;
};

type Window = {
  id: string;
  name: string;
  minimized: boolean;
  width: number;
  height: number;
  position: Position;
};

interface WindowState {
  focusedWindowId: string | null;
  windows: Window[];
}

const DEFAULT_WINDOW_SIZE = {
  width: 800,
  height: 600,
};

const DEFAULT_WINDOW_POSITION = {
  x: 100,
  y: 100,
};

export const useWindowStore = defineStore('windows', {
  state: (): WindowState => ({
    focusedWindowId: null,
    windows: [],
  }),

  getters: {
    getWindow: (state) => (id: string): Window | undefined => 
      state.windows.find((w) => w.id === id),
  },

  actions: {
    setFocusedWindowId(id: string | null) {
      this.focusedWindowId = id;
    },

    addWindow(window: Omit<Window, "minimized"> & Partial<Pick<Window, "width" | "height" | "position">>) {
      this.windows.push({
        ...window,
        minimized: false,
        width: window.width ?? DEFAULT_WINDOW_SIZE.width,
        height: window.height ?? DEFAULT_WINDOW_SIZE.height,
        position: window.position ?? DEFAULT_WINDOW_POSITION,
      });
    },

    minimizeWindow(id: string) {
      const window = this.getWindow(id);
      if (window) {
        window.minimized = !window.minimized;
      }
    },

    closeWindow(id: string) {
      this.windows = this.windows.filter((w) => w.id !== id);
      if (this.focusedWindowId === id) {
        this.focusedWindowId = null;
      }
    },

    setWindowPosition(id: string, position: Position) {
      const window = this.getWindow(id);
      if (window) {
        window.position = position;
      }
    },

    moveWindow(id: string, delta: Position) {
      const window = this.getWindow(id);
      if (window) {
        window.position = {
          x: window.position.x + delta.x,
          y: window.position.y + delta.y,
        };
      }
    },
  },
});
