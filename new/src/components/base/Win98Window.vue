<template>
  <section :class="['window', containerClass]">
    <div class="title-bar">
      <div class="title-bar-text">{{ title }}</div>
      <div class="title-bar-controls">
        <button aria-label="Close" @click="handleClose"></button>
      </div>
    </div>
    <div class="window-body" :class="bodyClass" v-show="isVisible">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  title: string;
  containerClass?: string;
  bodyClass?: string;
  initiallyVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: "",
  bodyClass: "",
  initiallyVisible: true,
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const isVisible = ref(props.initiallyVisible);

const handleClose = () => {
  isVisible.value = false;
  emit("close");
};
</script>
