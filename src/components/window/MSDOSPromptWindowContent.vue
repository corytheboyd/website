<template>
  <div
    ref="outputArea"
    class="h-full w-full flex-col overflow-y-scroll bg-black p-1 font-mono text-white"
  >
    <div class="flex-1">
      <div v-for="(line, i) in buffer" :key="i" class="whitespace-pre">
        {{ line }}
      </div>
      <div
        class="flex items-center whitespace-pre select-text"
        @click="focusInput"
      >
        <span>{{ PROMPT }}{{ input }}</span>
        <span v-if="isFocused" class="animate-blink">_</span>
        <input
          ref="inputRef"
          v-model="input"
          class="absolute m-0 h-0 w-0 border-0 p-0 caret-transparent opacity-0 outline-none"
          autocomplete="off"
          spellcheck="false"
          @keydown.up.prevent="recallPrev"
          @keydown.down.prevent="recallNext"
          @keydown.enter.prevent="handleSubmit"
          tabindex="0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from "vue";
import { useWindowStore } from "@/state/store.ts";

const MAX_REPL_LINES = 200;

const props = defineProps<{ windowId: string }>();
const store = useWindowStore();

const PROMPT = "C:\\WINDOWS\\Desktop>";
const INTRO_LINES = [
  "Microsoft(R) Windows 98",
  "(C)Copyright Microsoft Corp 1981-1998.",
  "\n",
];

const buffer = ref<string[]>([]); // Only output lines
const input = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const outputArea = ref<HTMLElement | null>(null);
let historyIndex = ref<number | null>(null);

const isFocused = computed(() => store.focusedWindowId === props.windowId);

function trimBuffer() {
  if (buffer.value.length > MAX_REPL_LINES) {
    buffer.value.splice(0, buffer.value.length - MAX_REPL_LINES);
  }
}

function handleSubmit() {
  const cmd = input.value;
  if (!cmd) return;
  buffer.value.push(PROMPT + cmd);
  buffer.value.push(cmd);
  buffer.value.push("\n"); // blank line for spacing
  trimBuffer();
  input.value = "";
  historyIndex.value = null;
  nextTick(() => {
    if (outputArea.value) {
      outputArea.value.scrollTop = outputArea.value.scrollHeight;
    }
    focusInput();
  });
}

function recallPrev() {
  const inputs = buffer.value
    .filter((line) => line.startsWith(PROMPT))
    .map((line) => line.slice(PROMPT.length));
  if (!inputs.length) return;
  if (historyIndex.value === null) {
    historyIndex.value = inputs.length - 1;
  } else if (historyIndex.value > 0) {
    historyIndex.value--;
  }
  input.value = inputs[historyIndex.value] || "";
}

function recallNext() {
  const inputs = buffer.value
    .filter((line) => line.startsWith(PROMPT))
    .map((line) => line.slice(PROMPT.length));
  if (!inputs.length || historyIndex.value === null) return;
  if (historyIndex.value < inputs.length - 1) {
    historyIndex.value++;
    input.value = inputs[historyIndex.value] || "";
  } else {
    historyIndex.value = null;
    input.value = "";
  }
}

function focusInput() {
  if (inputRef.value instanceof HTMLInputElement) inputRef.value.focus();
}

onMounted(() => {
  buffer.value.push(...INTRO_LINES);
  nextTick(() => {
    trimBuffer();
    focusInput();
  });
});

watch(isFocused, (val) => {
  if (val) nextTick(focusInput);
});

watch(buffer, () => {
  nextTick(() => {
    if (outputArea.value) {
      outputArea.value.scrollTop = outputArea.value.scrollHeight;
    }
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
