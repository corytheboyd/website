<template>
  <div
    class="flex h-20 w-20 flex-col items-center justify-center gap-2 bg-gray-800/10"
  >
    <div
      class="flex flex-col items-center justify-center gap-2 bg-gray-200/10"
      @dblclick="handleDoubleClick"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <img :src="icon" :alt="name" class="h-8 w-8" />
      <div
        class="win98-font flex items-center justify-center px-1 text-center text-sm text-white"
        :class="{
          'outline-[1px] -outline-offset-[1px] outline-dotted':
            isContainerFocused,
        }"
      >
        {{ name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowStore } from "@/state/store";
import type { WindowContentComponent } from "@/state/windowTypes";
import { ref } from "vue";

interface Props {
  id: string;
  name: string;
  icon: string;
  component: WindowContentComponent;
}

const props = defineProps<Props>();
const store = useWindowStore();
const isContainerFocused = ref(false);

const handleClick = () => {
  isContainerFocused.value = true;
};

const handleFocus = () => {
  isContainerFocused.value = true;
};

const handleBlur = () => {
  isContainerFocused.value = false;
};

const handleDoubleClick = () => {
  store.addWindow({
    name: props.name,
    width: 400,
    height: 255,
    minHeight: 175,
    minWidth: 200,
    position: { x: 150, y: 150 },
    component: props.component,
  });
};
</script>

<style>
.focused-text {
  -webkit-box-shadow: inset 0px 0px 0px 10px #f00;
  -moz-box-shadow: inset 0px 0px 0px 10px #f00;
  box-shadow: inset 0px 0px 0px 1px #f00;
}
</style>
