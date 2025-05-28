import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import type { WindowContentComponent } from "./windowTypes.ts";
import type { ProgramConfig, ProgramId } from "../programs";
import { programs } from "../programs";

type Position = {
  x: number;
  y: number;
};

type DesktopIcon = {
  id: string;
  programId: ProgramId;
};

type Window = {
  id: string;
  programId: ProgramId;
  minimized: boolean;
  position: Position;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  showInToolbar?: boolean;
  minimizable?: boolean;
  focusOnOpen?: boolean;
  width: number;
  height: number;
  props?: Record<string, any>;
};

interface WindowState {
  focusedWindowId: string | null;
  windows: Window[];
  taskbarOrder: string[]; // Array of window IDs in taskbar order
  desktopOrder: string[]; // Array of window IDs in z-index order
  desktopIcons: DesktopIcon[]; // Array of desktop icons
  focusedIconId: string | null;
  startMenuOpen: boolean; // Whether the start menu is open
}

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
  showInToolbar: true,
  minimizable: true,
  focusOnOpen: true,
};

export const useWindowStore = defineStore("windows", {
  state: (): WindowState => ({
    focusedWindowId: null,
    windows: [],
    taskbarOrder: [],
    desktopOrder: [],
    desktopIcons: [],
    focusedIconId: null,
    startMenuOpen: false,
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

    getProgramById:
      () =>
      (programId: ProgramId): ProgramConfig | undefined => {
        return programs.find((p) => p.id === programId);
      },
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

    setFocusedIconId(id: string | null) {
      this.focusedIconId = id;
    },

    openProgram(programId: ProgramId, props?: Record<string, any>) {
      const program = this.getProgramById(programId);
      if (!program?.window) return null;

      const id = uuidv4();
      const window = program.window;
      let position = window.defaultPosition ?? DEFAULT_WINDOW_POSITION;
      let minWidth = DEFAULT_WINDOW_MIN_SIZE.minWidth;
      let minHeight = DEFAULT_WINDOW_MIN_SIZE.minHeight;
      let resizable = window.resizable ?? DEFAULT_WINDOW_OPTIONS.resizable;
      let showInToolbar = DEFAULT_WINDOW_OPTIONS.showInToolbar;
      let minimizable = DEFAULT_WINDOW_OPTIONS.minimizable;
      let focusOnOpen = DEFAULT_WINDOW_OPTIONS.focusOnOpen;
      let width = window.width;
      let height = window.height;

      // Try to get desktop width and height from DOM
      let desktopRect =
        typeof window !== "undefined" && (window as any).__desktopArea?.value
          ? (window as any).__desktopArea.value.getBoundingClientRect()
          : undefined;
      if (desktopRect !== undefined) {
        const BORDER_BUFFER = 12;
        // Clamp width and x
        if (width > desktopRect.width) {
          width = desktopRect.width - BORDER_BUFFER;
          position.x = 0;
        } else {
          position.x = Math.max(
            0,
            Math.min(position.x, desktopRect.width - width),
          );
        }
        // Clamp height and y
        if (height > desktopRect.height) {
          height = desktopRect.height - BORDER_BUFFER;
          position.y = 0;
        } else {
          position.y = Math.max(
            0,
            Math.min(position.y, desktopRect.height - height),
          );
        }
      }

      this.windows.push({
        id,
        programId,
        minimized: false,
        position,
        minWidth,
        minHeight,
        resizable,
        showInToolbar,
        minimizable,
        focusOnOpen,
        width,
        height,
        props,
      });

      // Add to end of taskbar only if showInToolbar is true
      if (showInToolbar) {
        this.taskbarOrder.push(id);
      }
      // Add to end of desktop order
      this.desktopOrder.push(id);
      // Set focus to the new window only if focusOnOpen is true
      if (focusOnOpen) {
        this.setFocusedWindowId(id);
      }
      return id;
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
      let toolbarHeight = 0;
      if (
        typeof window !== "undefined" &&
        (window as any).__toolbarArea?.value
      ) {
        toolbarHeight = (
          window as any
        ).__toolbarArea.value.getBoundingClientRect().height;
      }
      if (
        !desktopRect &&
        typeof window !== "undefined" &&
        (window as any).__desktopArea?.value
      ) {
        desktopRect = (
          window as any
        ).__desktopArea.value.getBoundingClientRect();
      }
      if (!desktopRect) return;
      const BORDER_BUFFER = 12;
      this.windows.forEach((win) => {
        const program = this.getProgramById(win.programId);
        if (!program?.window) return;

        let width = program.window.width;
        let height = program.window.height;
        let position = { ...win.position };
        // Clamp width and x
        if (width > desktopRect.width) {
          width = desktopRect.width - BORDER_BUFFER;
          position.x = 0;
        } else {
          position.x = Math.max(
            0,
            Math.min(position.x, desktopRect.width - width),
          );
        }
        // Clamp height and y (subtract toolbar height)
        const availableHeight = desktopRect.height - toolbarHeight;
        if (height > availableHeight) {
          height = availableHeight - BORDER_BUFFER;
          position.y = 0;
        } else {
          position.y = Math.max(
            0,
            Math.min(position.y, availableHeight - height),
          );
        }
        win.position = position;
      });
    },

    addDesktopIcon(programId: ProgramId) {
      const program = this.getProgramById(programId);
      if (!program?.desktopIcon) return null;

      const id = uuidv4();
      this.desktopIcons.push({
        id,
        programId,
      });
      return id;
    },

    removeDesktopIcon(id: string) {
      this.desktopIcons = this.desktopIcons.filter((icon) => icon.id !== id);
    },

    setStartMenuOpen(open: boolean) {
      this.startMenuOpen = open;
    },

    toggleStartMenu() {
      this.startMenuOpen = !this.startMenuOpen;
    },

    closeStartMenu() {
      this.startMenuOpen = false;
    },

    runCommand(command: string, windowId: string) {
      // Generic program registry
      const programs: Record<string, (args?: string) => void> = {
        exit: () => {
          this.closeWindow(windowId);
        },
        virus: () => {
          const numWindows = 20;
          for (let i = 0; i < numWindows; ++i) {
            setTimeout(() => {
              this.openProgram("virus", {
                // No props: let the component randomize the image
              });
            }, i * 50);
          }
        },
      };
      const [prog, ...args] = command.trim().split(/\s+/);
      if (programs[prog.toLowerCase()]) {
        programs[prog.toLowerCase()](args.join(" "));
      }
    },
  },
});
