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
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <div class="title-bar-text">{{ title }}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @click="handleMinimize">_</button>
        <button aria-label="Close" @click="handleClose">×</button>
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
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

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

const startDrag = (e: MouseEvent) => {
  if (
    e.target instanceof HTMLElement &&
    e.target.closest(".title-bar-controls")
  ) {
    return;
  }
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  };
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  store.setWindowPosition(props.id, {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y,
  });
};

const stopDrag = () => {
  isDragging.value = false;
};

const handleMinimize = () => {
  store.minimizeWindow(props.id);
};

const handleClose = () => {
  store.closeWindow(props.id);
};
</script>
