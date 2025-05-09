<template>
  <section
    :class="['window', containerClass]"
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
      <div class="title-bar-text">{{ title }}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @click="handleMinimize"></button>
        <button aria-label="Close" @click="handleClose"></button>
      </div>
    </div>
    <div class="window-body" :class="bodyClass" v-show="!minimized">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useWindowStore } from "@/state/store";

const Z_INDEX_OFFSET = 100;

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

onMounted(() => {
  // Update bounds on window resize
  window.addEventListener("resize", updateBounds);
  updateBounds();
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
</script>
