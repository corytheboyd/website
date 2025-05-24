<template>
  <div
    class="flex h-full w-full flex-col bg-black p-4 font-mono text-green-400"
  >
    <div class="mb-2 select-none">
      Microsoft(R) Windows 98<br />
      (C)Copyright Microsoft Corp 1981-1998.<br />
      <br />
    </div>
    <div class="flex-1 overflow-y-auto" ref="outputArea">
      <div v-for="(entry, i) in history" :key="i" class="whitespace-pre-wrap">
        <template v-if="entry.type === 'input'">
          <span>C:\WINDOWS\Desktop&gt;{{ entry.value }}</span>
        </template>
        <template v-else>
          <span>{{ entry.value }}</span>
        </template>
      </div>
    </div>
    <form class="mt-2 flex items-center" @submit.prevent="handleSubmit">
      <span class="select-none">C:\WINDOWS\Desktop&gt;</span>
      <span class="relative ml-1 flex-1">
        <input
          ref="inputRef"
          v-model="input"
          class="w-full border-0 bg-black pr-2 font-mono text-green-400 caret-transparent outline-none"
          autocomplete="off"
          spellcheck="false"
          @keydown.up.prevent="recallPrev"
          @keydown.down.prevent="recallNext"
        />
        <span
          v-if="isFocused"
          class="animate-blink pointer-events-none absolute top-0 left-0 flex h-full items-center"
          :style="{ left: `calc(${inputWidth}px + 2px)` }"
          >_</span
        >
      </span>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from "vue";
import { useWindowStore } from "@/state/store.ts";

const props = defineProps<{ windowId: string }>();
const store = useWindowStore();

interface Entry {
  type: "input" | "output";
  value: string;
}

const history = ref<Entry[]>([]);
const input = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const outputArea = ref<HTMLElement | null>(null);
let historyIndex = ref<number | null>(null);
const inputWidth = ref(0);

const isFocused = computed(() => store.focusedWindowId === props.windowId);

function updateInputWidth() {
  // Create a dummy span to measure the input text width
  if (!inputRef.value) return;
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.whiteSpace = "pre";
  span.style.font = getComputedStyle(inputRef.value).font;
  span.textContent = input.value || "";
  document.body.appendChild(span);
  inputWidth.value = span.offsetWidth;
  document.body.removeChild(span);
}

watch(input, updateInputWidth);

function handleSubmit() {
  const cmd = input.value.trim();
  if (!cmd) return;
  history.value.push({ type: "input", value: cmd });
  // For now, just echo the command as output
  history.value.push({ type: "output", value: cmd });
  input.value = "";
  historyIndex.value = null;
  nextTick(() => {
    if (outputArea.value) {
      outputArea.value.scrollTop = outputArea.value.scrollHeight;
    }
    inputRef.value?.focus();
    updateInputWidth();
  });
}

function recallPrev() {
  const inputs = history.value
    .filter((e) => e.type === "input")
    .map((e) => e.value);
  if (!inputs.length) return;
  if (historyIndex.value === null) {
    historyIndex.value = inputs.length - 1;
  } else if (historyIndex.value > 0) {
    historyIndex.value--;
  }
  input.value = inputs[historyIndex.value] || "";
}

function recallNext() {
  const inputs = history.value
    .filter((e) => e.type === "input")
    .map((e) => e.value);
  if (!inputs.length || historyIndex.value === null) return;
  if (historyIndex.value < inputs.length - 1) {
    historyIndex.value++;
    input.value = inputs[historyIndex.value] || "";
  } else {
    historyIndex.value = null;
    input.value = "";
  }
}

onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus();
    updateInputWidth();
  });
});
</script>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.animate-blink {
  animation: blink 1s steps(1) infinite;
}
</style>
