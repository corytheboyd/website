<template>
  <section
    :class="['window', containerClass, { minimized }]"
    :style="{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${width}px`,
      height: minimized ? 'auto' : `${height}px`,
      zIndex: windowIndex + Z_INDEX_OFFSET,
    }"
    @mousedown="handleFocus"
  >
    <div
      :class="['title-bar', { inactive: !isFocused }]"
      @mousedown="startDrag"
      @touchstart="startTouchDrag"
    >
      <div class="title-bar-text flex">
        <img v-if="windowIcon" :src="windowIcon" alt="" class="window-icon" />
        <span>{{ title }}</span>
      </div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @click="handleMinimize"></button>
        <button aria-label="Close" @click="handleClose"></button>
      </div>
    </div>
    <div
      class="window-body h-full"
      :class="bodyClass"
      v-show="!minimized"
      :style="{
        margin: 0,
      }"
    >
      <slot></slot>
    </div>
    <!-- Resize handles -->
    <div
      class="absolute top-0 right-2 left-2 z-10 h-2 cursor-row-resize"
      @mousedown="startResize('n', $event)"
    />
    <div
      class="absolute top-2 right-0 bottom-2 z-10 w-2 cursor-col-resize"
      @mousedown="startResize('e', $event)"
    />
    <div
      class="absolute right-2 bottom-0 left-2 z-10 h-2 cursor-row-resize"
      @mousedown="startResize('s', $event)"
    />
    <div
      class="absolute top-2 bottom-2 left-0 z-10 w-2 cursor-col-resize"
      @mousedown="startResize('w', $event)"
    />
    <div
      class="absolute top-0 left-0 z-10 h-3 w-3 cursor-nwse-resize"
      @mousedown="startResize('nw', $event)"
    />
    <div
      class="absolute top-0 right-0 z-10 h-3 w-3 cursor-nesw-resize"
      @mousedown="startResize('ne', $event)"
    />
    <div
      class="absolute right-0 bottom-0 z-10 h-3 w-3 cursor-nwse-resize"
      @mousedown="startResize('se', $event)"
    />
    <div
      class="absolute bottom-0 left-0 z-10 h-3 w-3 cursor-nesw-resize"
      @mousedown="startResize('sw', $event)"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useWindowStore } from "@/state/store";

const Z_INDEX_OFFSET = 100;
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
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: "",
  bodyClass: "",
  initiallyVisible: true,
  width: 800,
  height: 600,
  position: () => ({ x: 100, y: 100 }),
});

const store = useWindowStore();
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const desktopBounds = ref({
  width: window.innerWidth,
  height: window.innerHeight - 40,
  left: 0,
  top: 0,
  taskbarHeight: 40,
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

const windowIcon = computed(() => store.getWindow(props.id)?.icon);

const isResizing = ref(false);
const resizeDirection = ref<string | null>(null);
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });

const width = computed(() => {
  const window = store.getWindow(props.id);
  return window?.width ?? props.width;
});
const height = computed(() => {
  const window = store.getWindow(props.id);
  return window?.height ?? props.height;
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
});

onUnmounted(() => {
  window.removeEventListener("resize", updateBounds);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopDrag);
});

const updateBounds = () => {
  // Use the actual desktop area if available
  const desktopArea = window.__desktopArea?.value;
  if (desktopArea) {
    const rect = desktopArea.getBoundingClientRect();
    desktopBounds.value = {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      taskbarHeight: desktopBounds.value.taskbarHeight,
    };
  } else {
    desktopBounds.value = {
      width: window.innerWidth,
      height: window.innerHeight - desktopBounds.value.taskbarHeight,
      left: 0,
      top: 0,
      taskbarHeight: desktopBounds.value.taskbarHeight,
    };
  }
};

const handleFocus = () => {
  store.setFocusedWindowId(props.id);
};

const startDrag = (e: MouseEvent) => {
  if (
    e.target instanceof HTMLElement &&
    e.target.closest(".title-bar-controls")
  ) {
    return;
  }
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - position.value.x - desktopBounds.value.left,
    y: e.clientY - position.value.y - desktopBounds.value.top,
  };

  // Add document-level mouse handlers
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopDrag);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;

  // Calculate new position with bounds checking
  const newX = Math.max(
    0,
    Math.min(
      e.clientX - dragStart.value.x - desktopBounds.value.left,
      desktopBounds.value.width - props.width,
    ),
  );
  const newY = Math.max(
    0,
    Math.min(
      e.clientY - dragStart.value.y - desktopBounds.value.top,
      desktopBounds.value.height - (minimized.value ? 0 : props.height),
    ),
  );

  store.setWindowPosition(props.id, {
    x: newX,
    y: newY,
  });
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
  isDragging.value = true;
  const touch = e.touches[0];
  dragStart.value = {
    x: touch.clientX - position.value.x - desktopBounds.value.left,
    y: touch.clientY - position.value.y - desktopBounds.value.top,
  };
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", stopTouchDrag);
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length !== 1) return;
  e.preventDefault();
  const touch = e.touches[0];
  const newX = Math.max(
    0,
    Math.min(
      touch.clientX - dragStart.value.x - desktopBounds.value.left,
      desktopBounds.value.width - props.width,
    ),
  );
  const newY = Math.max(
    0,
    Math.min(
      touch.clientY - dragStart.value.y - desktopBounds.value.top,
      desktopBounds.value.height - (minimized.value ? 0 : props.height),
    ),
  );
  store.setWindowPosition(props.id, {
    x: newX,
    y: newY,
  });
};

const stopTouchDrag = () => {
  isDragging.value = false;
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchend", stopTouchDrag);
};

const startResize = (direction: string, e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  isResizing.value = true;
  resizeDirection.value = direction;
  const win = store.getWindow(props.id);
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: win?.width ?? props.width,
    height: win?.height ?? props.height,
    left: win?.position.x ?? props.position.x,
    top: win?.position.y ?? props.position.y,
  };
  document.addEventListener("mousemove", handleResizeMove);
  document.addEventListener("mouseup", stopResize);
};

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing.value || !resizeDirection.value) return;
  const dx = e.clientX - resizeStart.value.x;
  const dy = e.clientY - resizeStart.value.y;
  let newWidth = resizeStart.value.width;
  let newHeight = resizeStart.value.height;
  let newLeft = resizeStart.value.left;
  let newTop = resizeStart.value.top;
  const bounds = desktopBounds.value;
  // Edge/corner logic
  if (resizeDirection.value.includes("e")) {
    newWidth = Math.max(
      MIN_WIDTH,
      Math.min(resizeStart.value.width + dx, bounds.width - newLeft),
    );
  }
  if (resizeDirection.value.includes("s")) {
    newHeight = Math.max(
      MIN_HEIGHT,
      Math.min(resizeStart.value.height + dy, bounds.height - newTop),
    );
  }
  if (resizeDirection.value.includes("w")) {
    newWidth = Math.max(
      MIN_WIDTH,
      Math.min(
        resizeStart.value.width - dx,
        resizeStart.value.width + resizeStart.value.left,
      ),
    );
    newLeft = Math.min(
      resizeStart.value.left + dx,
      resizeStart.value.left + resizeStart.value.width - MIN_WIDTH,
    );
    newLeft = Math.max(
      0,
      Math.min(
        newLeft,
        resizeStart.value.left + resizeStart.value.width - MIN_WIDTH,
      ),
    );
    if (newLeft + newWidth > bounds.width) {
      newWidth = bounds.width - newLeft;
    }
  }
  if (resizeDirection.value.includes("n")) {
    newHeight = Math.max(
      MIN_HEIGHT,
      Math.min(
        resizeStart.value.height - dy,
        resizeStart.value.height + resizeStart.value.top,
      ),
    );
    newTop = Math.min(
      resizeStart.value.top + dy,
      resizeStart.value.top + resizeStart.value.height - MIN_HEIGHT,
    );
    newTop = Math.max(
      0,
      Math.min(
        newTop,
        resizeStart.value.top + resizeStart.value.height - MIN_HEIGHT,
      ),
    );
    if (newTop + newHeight > bounds.height) {
      newHeight = bounds.height - newTop;
    }
  }
  store.setWindowSize(props.id, { width: newWidth, height: newHeight });
  store.setWindowPosition(props.id, { x: newLeft, y: newTop });
};

const stopResize = () => {
  isResizing.value = false;
  resizeDirection.value = null;
  document.removeEventListener("mousemove", handleResizeMove);
  document.removeEventListener("mouseup", stopResize);
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
