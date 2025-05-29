<template>
  <section
    :class="[
      'window',
      containerClass,
      { minimized },
      'max-w-full',
      'max-h-full',
      'md:max-w-[90vw]',
      'md:max-h-[90vh]',
    ]"
    :style="{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${width}px`,
      height: minimized ? 'auto' : `${height}px`,
      zIndex: isFocused
        ? FOCUSED_Z_INDEX_OFFSET + windowIndex
        : windowIndex + Z_INDEX_OFFSET,
    }"
    @mousedown="handleFocus"
  >
    <div
      :class="['title-bar', { inactive: !isFocused }]"
      @mousedown="startDrag"
      @touchstart="startTouchDrag"
    >
      <div class="title-bar-text flex">
        <img v-if="icon" :src="icon" alt="" class="window-icon" />
        <span>{{ title }}</span>
      </div>
      <div class="title-bar-controls">
        <button
          v-if="isMinimizable"
          aria-label="Minimize"
          @click="handleMinimize"
        ></button>
        <button aria-label="Close" @click="handleClose"></button>
      </div>
    </div>
    <div
      class="window-body h-full overflow-hidden"
      :class="bodyClass"
      v-show="!minimized"
      :style="{
        margin: 0,
      }"
    >
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, provide } from "vue";
import { useWindowStore } from "@/state/store.ts";

const Z_INDEX_OFFSET = 100;
const FOCUSED_Z_INDEX_OFFSET = 1000; // Higher offset for focused windows
const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;

interface Props {
  id: string;
  title: string;
  containerClass?: string;
  bodyClass?: string;
  initiallyVisible?: boolean;
  width?: number;
  height?: number;
  position?: { x: number; y: number };
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  minimizable?: boolean;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: "",
  bodyClass: "",
  initiallyVisible: true,
  width: 800,
  height: 600,
  position: () => ({ x: 100, y: 100 }),
  minWidth: MIN_WIDTH,
  minHeight: MIN_HEIGHT,
  resizable: true,
  minimizable: true,
  icon: "",
});

const store = useWindowStore();
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const desktopBounds = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  left: 0,
  top: 0,
});

const position = computed(() => {
  const window = store.getWindow(props.id);
  return window?.position ?? props.position;
});

const minimized = computed(() => {
  const window = store.getWindow(props.id);
  return window?.minimized ?? false;
});

const isFocused = computed(() => store.focusedWindowId === props.id);

const windowIndex = computed(() => store.getDesktopIndex(props.id));

const isMinimizable = computed(() => {
  const window = store.getWindow(props.id);
  return window?.minimizable ?? props.minimizable;
});

const width = computed(() => {
  const window = store.getWindow(props.id);
  return window?.width;
});
const height = computed(() => {
  const window = store.getWindow(props.id);
  return window?.height;
});

onMounted(() => {
  // Update bounds on window resize
  window.addEventListener("resize", updateBounds);
  updateBounds();

  // Clamp window position and size after mount (simulate drag correction)
  setTimeout(() => {
    const windowObj = store.getWindow(props.id);
    if (!windowObj) return;
    let width = windowObj.width;
    let height = windowObj.height;
    let x = windowObj.position.x;
    let y = windowObj.position.y;
    const maxWidth = desktopBounds.value.width;
    const maxHeight = desktopBounds.value.height;
    if (width > maxWidth) {
      width = maxWidth;
      x = 0;
    }
    if (height > maxHeight) {
      height = maxHeight;
      y = 0;
    }
    const maxX = desktopBounds.value.width - width;
    const maxY = desktopBounds.value.height - height;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    if (windowObj.width !== width || windowObj.height !== height) {
      windowObj.width = width;
      windowObj.height = height;
    }
    if (windowObj.position.x !== x || windowObj.position.y !== y) {
      store.setWindowPosition(props.id, { x, y });
    }
  }, 0);

  provide("windowId", props.id);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateBounds);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopDrag);
});

const updateBounds = () => {
  // Use the actual desktop area if available
  const desktopArea = window.__desktopArea?.value;
  const toolbarArea = window.__toolbarArea?.value;
  let toolbarHeight = 0;
  if (toolbarArea) {
    toolbarHeight = toolbarArea.getBoundingClientRect().height;
  }
  if (desktopArea) {
    const rect = desktopArea.getBoundingClientRect();
    desktopBounds.value = {
      width: rect.width,
      height: rect.height - toolbarHeight,
      left: rect.left,
      top: rect.top,
    };
  } else {
    desktopBounds.value = {
      width: window.innerWidth,
      height: window.innerHeight - toolbarHeight,
      left: 0,
      top: 0,
    };
  }
};

const handleFocus = () => {
  store.setFocusedWindowId(props.id);
};

const startDragCommon = (clientX: number, clientY: number) => {
  if (!isFocused.value) {
    store.setFocusedWindowId(props.id);
  }

  isDragging.value = true;
  dragStart.value = {
    x: clientX - position.value.x - desktopBounds.value.left,
    y: clientY - position.value.y - desktopBounds.value.top,
  };
};

const handleDragMove = (clientX: number, clientY: number) => {
  if (!isDragging.value) return;

  // Use current window size from store
  const win = store.getWindow(props.id);
  const winWidth = win?.width ?? props.width;
  const winHeight = win?.height ?? props.height;

  // Calculate new position with bounds checking
  const maxX = desktopBounds.value.width - winWidth;
  const maxY = desktopBounds.value.height - winHeight;
  const newX = Math.max(
    0,
    Math.min(clientX - dragStart.value.x - desktopBounds.value.left, maxX),
  );
  const newY = Math.max(
    0,
    Math.min(clientY - dragStart.value.y - desktopBounds.value.top, maxY),
  );

  store.setWindowPosition(props.id, {
    x: newX,
    y: newY,
  });
};

const startDrag = (e: MouseEvent) => {
  if (
    e.target instanceof HTMLElement &&
    e.target.closest(".title-bar-controls")
  ) {
    return;
  }
  startDragCommon(e.clientX, e.clientY);

  // Add document-level mouse handlers
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopDrag);
};

const handleMouseMove = (e: MouseEvent) => {
  handleDragMove(e.clientX, e.clientY);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopDrag);
};

const handleMinimize = () => {
  store.minimizeWindow(props.id);
};

const handleClose = () => {
  store.closeWindow(props.id);
};

const startTouchDrag = (e: TouchEvent) => {
  if (
    e.target instanceof HTMLElement &&
    e.target.closest(".title-bar-controls")
  ) {
    return;
  }
  if (e.touches.length !== 1) return;
  startDragCommon(e.touches[0].clientX, e.touches[0].clientY);
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", stopTouchDrag);
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length !== 1) return;
  e.preventDefault();
  handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
};

const stopTouchDrag = () => {
  isDragging.value = false;
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchend", stopTouchDrag);
};
</script>

<style scoped>
.window-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  vertical-align: middle;
}

.window.minimized {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.window {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.window-body {
  flex: 1 1 0%;
  min-height: 0;
}
</style>
