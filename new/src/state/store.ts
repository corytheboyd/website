import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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

type AppState = {
  focusedWindowId: string | null;
  windows: Window[];
  desktopWidth: number;
  desktopHeight: number;
  setFocusedWindowId: (id: string | null) => void;
  addWindow: (window: Omit<Window, "minimized"> & Partial<Pick<Window, "width" | "height" | "position">>) => void;
  minimizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  setWindowPosition: (id: string, position: Position) => void;
  moveWindow: (id: string, delta: Position) => void;
  setDesktopSize: (width: number, height: number) => void;
};

const DEFAULT_WINDOW_SIZE = {
  width: 800,
  height: 600,
};

const DEFAULT_WINDOW_POSITION = {
  x: 100,
  y: 100,
};

const DEFAULT_DESKTOP_SIZE = {
  width: 1920,
  height: 1080,
};

const clampWindowPosition = (
  position: Position,
  width: number,
  height: number,
  desktopWidth: number,
  desktopHeight: number
): Position => {
  return {
    x: Math.max(0, Math.min(position.x, desktopWidth - width)),
    y: Math.max(0, Math.min(position.y, desktopHeight - height)),
  };
};

export const useStore = create<AppState>()(
  immer((set) => ({
    focusedWindowId: null,
    windows: [],
    desktopWidth: DEFAULT_DESKTOP_SIZE.width,
    desktopHeight: DEFAULT_DESKTOP_SIZE.height,
    setFocusedWindowId: (id) =>
      set((state) => {
        state.focusedWindowId = id;
      }),
    addWindow: (window) =>
      set((state) => {
        const width = window.width ?? DEFAULT_WINDOW_SIZE.width;
        const height = window.height ?? DEFAULT_WINDOW_SIZE.height;
        const position = window.position ?? DEFAULT_WINDOW_POSITION;
        
        state.windows.push({
          ...window,
          minimized: false,
          width,
          height,
          position: clampWindowPosition(position, width, height, state.desktopWidth, state.desktopHeight),
        });
      }),
    minimizeWindow: (id) =>
      set((state) => {
        const window = state.windows.find((w: Window) => w.id === id);
        if (window) {
          window.minimized = !window.minimized;
        }
      }),
    closeWindow: (id) =>
      set((state) => {
        state.windows = state.windows.filter((w: Window) => w.id !== id);
        if (state.focusedWindowId === id) {
          state.focusedWindowId = null;
        }
      }),
    setWindowPosition: (id, position) =>
      set((state) => {
        const window = state.windows.find((w: Window) => w.id === id);
        if (window) {
          window.position = clampWindowPosition(
            position,
            window.width,
            window.height,
            state.desktopWidth,
            state.desktopHeight
          );
        }
      }),
    moveWindow: (id, delta) =>
      set((state) => {
        const window = state.windows.find((w: Window) => w.id === id);
        if (window) {
          const newPosition = {
            x: window.position.x + delta.x,
            y: window.position.y + delta.y,
          };
          window.position = clampWindowPosition(
            newPosition,
            window.width,
            window.height,
            state.desktopWidth,
            state.desktopHeight
          );
        }
      }),
    setDesktopSize: (width, height) =>
      set((state) => {
        state.desktopWidth = width;
        state.desktopHeight = height;
        // Ensure all windows are within bounds after desktop resize
        state.windows.forEach((window: Window) => {
          window.position = clampWindowPosition(
            window.position,
            window.width,
            window.height,
            width,
            height
          );
        });
      }),
  }))
);
