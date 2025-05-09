<template>
  <section
    :class="['window', containerClass]"
    :style="{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${width}px`,
      height: minimized ? 'auto' : `${height}px`,
      zIndex: isFocused ? 1 : 0,
    }"
    @mousedown="handleFocus"
  >
    <div
      class="title-bar"
      draggable="true"
      @dragstart="startDrag"
      @drag="onDrag"
      @dragend="stopDrag"
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
import { ref, computed, onMounted } from "vue";
import { useWindowStore } from "@/state/store";

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
const dragStartPosition = ref({ x: 0, y: 0 });
const dragStartMousePosition = ref({ x: 0, y: 0 });

const position = computed(() => {
  const window = store.getWindow(props.id);
  return window?.position ?? props.position;
});

const minimized = computed(() => {
  const window = store.getWindow(props.id);
  return window?.minimized ?? false;
});

const isFocused = computed(() => store.focusedWindowId === props.id);

onMounted(() => {
  store.addWindow({
    id: props.id,
    name: props.title,
    width: props.width,
    height: props.height,
    position: props.position,
  });
});

const handleFocus = () => {
  store.setFocusedWindowId(props.id);
};

const startDrag = (e: DragEvent) => {
  if (!e.dataTransfer) return;

  // Store initial positions
  dragStartPosition.value = { ...position.value };
  dragStartMousePosition.value = { x: e.clientX, y: e.clientY };

  // Required for Firefox
  e.dataTransfer.setData("text/plain", "");

  // Use move cursor
  e.dataTransfer.effectAllowed = "move";

  // Create an invisible drag image (required for custom drag behavior)
  const dragImage = new Image();
  dragImage.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  e.dataTransfer.setDragImage(dragImage, 0, 0);
};

const onDrag = (e: DragEvent) => {
  if (!e.clientX && !e.clientY) return; // Ignore invalid drag events

  const deltaX = e.clientX - dragStartMousePosition.value.x;
  const deltaY = e.clientY - dragStartMousePosition.value.y;

  store.setWindowPosition(props.id, {
    x: dragStartPosition.value.x + deltaX,
    y: dragStartPosition.value.y + deltaY,
  });
};

const stopDrag = () => {
  // No cleanup needed with the drag and drop API
};

const handleMinimize = () => {
  store.minimizeWindow(props.id);
};

const handleClose = () => {
  store.closeWindow(props.id);
};
</script>
