import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import type { WindowContentComponent } from './windowTypes';

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
  icon?: string;
  component: WindowContentComponent;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
};

interface WindowState {
  focusedWindowId: string | null;
  windows: Window[];
  taskbarOrder: string[]; // Array of window IDs in taskbar order
  desktopOrder: string[]; // Array of window IDs in z-index order
}

const DEFAULT_WINDOW_SIZE = {
  width: 800,
  height: 600,
};

const DEFAULT_WINDOW_MIN_SIZE = {
  minWidth: 200,
  minHeight: 100,
};

const DEFAULT_WINDOW_POSITION = {
  x: 100,
  y: 100,
};

const DEFAULT_WINDOW_OPTIONS = {
  resizable: true,
};

export const useWindowStore = defineStore("windows", {
  state: (): WindowState => ({
    focusedWindowId: null,
    windows: [],
    taskbarOrder: [],
    desktopOrder: [],
  }),

  getters: {
    getWindow:
      (state) =>
      (id: string): Window | undefined =>
        state.windows.find((w) => w.id === id),

    getWindowIndex:
      (state) =>
      (id: string): number =>
        state.windows.findIndex((w) => w.id === id),

    getTaskbarIndex:
      (state) =>
      (id: string): number =>
        state.taskbarOrder.indexOf(id),

    getDesktopIndex:
      (state) =>
      (id: string): number =>
        state.desktopOrder.indexOf(id),
  },

  actions: {
    setFocusedWindowId(id: string | null) {
      this.focusedWindowId = id;
      if (id) {
        // Move window to top of desktop order
        const desktopIndex = this.getDesktopIndex(id);
        if (desktopIndex !== -1) {
          this.desktopOrder.splice(desktopIndex, 1);
          this.desktopOrder.push(id);
        }
      }
    },

    addWindow(
      window: Omit<Window, "minimized" | "id"> &
        Partial<Pick<Window, "width" | "height" | "position" | "icon" | "minWidth" | "minHeight" | "resizable">>,
    ) {
      const id = uuidv4();
      let width = window.width ?? DEFAULT_WINDOW_SIZE.width;
      let height = window.height ?? DEFAULT_WINDOW_SIZE.height;
      let position = window.position ?? DEFAULT_WINDOW_POSITION;
      let minWidth = window.minWidth ?? DEFAULT_WINDOW_MIN_SIZE.minWidth;
      let minHeight = window.minHeight ?? DEFAULT_WINDOW_MIN_SIZE.minHeight;
      let resizable = window.resizable ?? DEFAULT_WINDOW_OPTIONS.resizable;
      // Try to get desktop width and height from DOM
      let desktopRect = typeof window !== 'undefined' && (window as any).__desktopArea?.value
        ? (window as any).__desktopArea.value.getBoundingClientRect()
        : undefined;
      if (desktopRect !== undefined) {
        const BORDER_BUFFER = 12;
        // Clamp width and x
        if (width > desktopRect.width) {
          width = desktopRect.width - BORDER_BUFFER;
          position.x = 0;
        } else {
          position.x = Math.max(0, Math.min(position.x, desktopRect.width - width));
        }
        // Clamp height and y
        if (height > desktopRect.height) {
          height = desktopRect.height - BORDER_BUFFER;
          position.y = 0;
        } else {
          position.y = Math.max(0, Math.min(position.y, desktopRect.height - height));
        }
      }
      this.windows.push({
        ...window,
        id,
        minimized: false,
        width,
        height,
        position,
        icon: window.icon,
        minWidth,
        minHeight,
        resizable,
      });

      // Add to end of taskbar
      this.taskbarOrder.push(id);
      // Add to end of desktop order
      this.desktopOrder.push(id);
      // Set focus to the new window
      this.setFocusedWindowId(id);
      return id; // Return the generated ID
    },

    minimizeWindow(id: string) {
      const window = this.getWindow(id);
      if (window) {
        window.minimized = !window.minimized;
      }
    },

    closeWindow(id: string) {
      // Remove from windows array
      this.windows = this.windows.filter((w) => w.id !== id);

      // Remove from taskbar order
      const taskbarIndex = this.getTaskbarIndex(id);
      if (taskbarIndex !== -1) {
        this.taskbarOrder.splice(taskbarIndex, 1);
      }

      // Remove from desktop order
      const desktopIndex = this.getDesktopIndex(id);
      if (desktopIndex !== -1) {
        this.desktopOrder.splice(desktopIndex, 1);
      }

      // Clear focus if needed
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

    setWindowSize(id: string, size: { width: number; height: number }) {
      const window = this.getWindow(id);
      if (window) {
        window.width = size.width;
        window.height = size.height;
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

    clampAllWindowsToDesktop(desktopRect?: DOMRect) {
      // Try to get desktop width and height from DOM if not provided
      if (!desktopRect && typeof window !== 'undefined' && (window as any).__desktopArea?.value) {
        desktopRect = (window as any).__desktopArea.value.getBoundingClientRect();
      }
      if (!desktopRect) return;
      const BORDER_BUFFER = 12;
      this.windows.forEach(win => {
        let width = win.width;
        let height = win.height;
        let position = { ...win.position };
        // Clamp width and x
        if (width > desktopRect.width) {
          width = desktopRect.width - BORDER_BUFFER;
          position.x = 0;
        } else {
          position.x = Math.max(0, Math.min(position.x, desktopRect.width - width));
        }
        // Clamp height and y
        if (height > desktopRect.height) {
          height = desktopRect.height - BORDER_BUFFER;
          position.y = 0;
        } else {
          position.y = Math.max(0, Math.min(position.y, desktopRect.height - height));
        }
        win.width = width;
        win.height = height;
        win.position = position;
      });
    },
  },
});
