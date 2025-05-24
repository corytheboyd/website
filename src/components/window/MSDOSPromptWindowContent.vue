<template>
  <div
    ref="outputArea"
    class="h-full w-full flex-col overflow-y-scroll bg-black p-1 font-mono text-white"
  >
    <div class="flex-1">
      <div v-for="(line, i) in buffer" :key="i" class="whitespace-pre-wrap">
        {{ line }}
      </div>
      <div
        class="flex items-center whitespace-pre-wrap select-text"
        @click="focusInput"
      >
        <span>{{ getPrompt() }}{{ input }}</span>
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
          @keydown.tab.prevent="handleTabComplete"
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

// Hierarchical in-memory file system
interface FileEntry {
  name: string;
  size: number;
  date: string;
  time: string;
}
interface DirNode {
  name: string;
  label: string;
  serial: string;
  files: FileEntry[];
  dirs: DirNode[];
  free: number;
  date: string;
  time: string;
}

const fileSystemRoot: DirNode = {
  name: "C:",
  label: "C",
  serial: "1337-42069",
  files: [],
  dirs: [
    {
      name: "Users",
      label: "C",
      serial: "1337-42069",
      files: [],
      dirs: [
        {
          name: "CORY",
          label: "C",
          serial: "1337-42069",
          files: [
            {
              name: "nickleback.exe",
              size: 882737,
              date: "07-17-2001",
              time: "03:43",
            },
          ],
          dirs: [],
          free: 80085,
          date: "06-02-2023",
          time: "15:34",
        },
      ],
      free: 80085,
      date: "06-02-2023",
      time: "15:34",
    },
  ],
  free: 80085,
  date: "01-01-2000",
  time: "00:00",
};

const currentDir = ref<DirNode[]>([
  fileSystemRoot,
  fileSystemRoot.dirs[0],
  fileSystemRoot.dirs[0].dirs[0],
]);

function resolveDir(path: string[]): DirNode[] | null {
  let node = fileSystemRoot;
  const result: DirNode[] = [node];
  for (let i = 1; i < path.length; ++i) {
    const seg = path[i];
    const found = node.dirs.find(
      (d) => d.name.toLowerCase() === seg.toLowerCase(),
    );
    if (!found) return null;
    node = found;
    result.push(node);
  }
  return result;
}

function getCurrentDirNode() {
  return currentDir.value[currentDir.value.length - 1];
}

function getPrompt() {
  // C:\Users\CORY>
  return (
    currentDir.value
      .map((d, i) => (i === 0 ? d.name : "\\" + d.name))
      .join("") + ">"
  );
}

function formatDirOutput() {
  const dir = getCurrentDirNode();
  const lines: string[] = [];
  lines.push(` Directory of ${getPrompt().slice(0, -1)}`);
  lines.push("");
  for (const d of dir.dirs) {
    lines.push(`${d.date}  ${d.time}    <DIR>          ${d.name}`);
  }
  for (const f of dir.files) {
    lines.push(
      `${f.date}  ${f.time} ${f.size.toString().padStart(10, " ")} ${f.name}`,
    );
  }
  lines.push(
    `           ${dir.files.length} File(s) ${dir.files.reduce((a: number, b) => a + b.size, 0).toLocaleString()} bytes`,
  );
  lines.push(
    `           ${dir.dirs.length} Dir(s)  ${dir.free.toLocaleString()} bytes free`,
  );
  return lines;
}

function resolvePath(arg: string): DirNode[] | null {
  let parts = arg.replace(/\\+/g, "\\").split("\\").filter(Boolean);
  let base: DirNode[] = [];
  if (arg.startsWith("C:")) {
    // Absolute path
    base = [fileSystemRoot];
    parts = parts.slice(1);
  } else if (arg.startsWith("\\")) {
    // Absolute from root
    base = [fileSystemRoot];
  } else {
    // Relative
    base = [...currentDir.value];
  }
  let resolved: DirNode[] = [...base];
  for (const seg of parts) {
    if (seg === "..") {
      if (resolved.length > 1) resolved.pop();
    } else {
      const node = resolved[resolved.length - 1];
      const found = node.dirs.find(
        (d) => d.name.toLowerCase() === seg.toLowerCase(),
      );
      if (!found) return null;
      resolved.push(found);
    }
  }
  return resolved;
}

const buffer = ref<string[]>([]); // Only output lines
const input = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const outputArea = ref<HTMLElement | null>(null);
let historyIndex = ref<number | null>(null);

const isFocused = computed(() => store.focusedWindowId === props.windowId);

const COMMANDS = ["cls", "clrscr", "dir", "cd", "chdir"];

function trimBuffer() {
  if (buffer.value.length > MAX_REPL_LINES) {
    buffer.value.splice(0, buffer.value.length - MAX_REPL_LINES);
  }
}

function handleSubmit() {
  const cmd = input.value.trim();
  if (!cmd) return;
  const [cmdName, ...cmdArgs] = cmd.split(/\s+/);
  const argStr = cmdArgs.join(" ");
  // Command registry
  const commands: Record<string, (arg?: string) => void> = {
    cls: () => buffer.value.splice(0, buffer.value.length),
    clrscr: () => buffer.value.splice(0, buffer.value.length),
    dir: () => {
      for (const line of formatDirOutput()) buffer.value.push(line);
    },
    cd: (arg?: string) => {
      if (!arg) return;
      let target = arg.trim();
      if (target === "..") {
        if (currentDir.value.length > 1) currentDir.value.pop();
      } else {
        const resolved = resolvePath(target);
        if (resolved) {
          currentDir.value = resolved;
        } else {
          buffer.value.push(`The system cannot find the path specified.`);
        }
      }
    },
    chdir: (arg?: string) => {
      commands.cd?.(arg);
    },
  };
  buffer.value.push(getPrompt() + cmd);
  if (commands[cmdName.toLowerCase()]) {
    commands[cmdName.toLowerCase()](argStr);
  } else {
    buffer.value.push(
      `'${cmdName}' is not recognized as an internal or external command, operable program or batch file.`,
    );
  }
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
    .filter((line) => line.startsWith(getPrompt()))
    .map((line) => line.slice(getPrompt().length));
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
    .filter((line) => line.startsWith(getPrompt()))
    .map((line) => line.slice(getPrompt().length));
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

function handleTabComplete() {
  const val = input.value.trim();
  if (!val) return;
  const parts = val.split(/\s+/);
  if (parts.length === 1) {
    // Try command completion first
    const matches = COMMANDS.filter((c) => c.startsWith(val.toLowerCase()));
    if (matches.length === 1) {
      input.value = matches[0] + " ";
      return;
    }
    // If not a command, try file/dir completion in current dir
    const baseDir = getCurrentDirNode();
    const fileMatches = baseDir.files.filter((f) =>
      f.name.toLowerCase().startsWith(val.toLowerCase()),
    );
    const dirMatches = baseDir.dirs.filter((d) =>
      d.name.toLowerCase().startsWith(val.toLowerCase()),
    );
    const allMatches = [
      ...dirMatches.map((d) => d.name),
      ...fileMatches.map((f) => f.name),
    ];
    if (allMatches.length === 1) {
      input.value = allMatches[0];
    }
    return;
  }
  const [cmd, ...args] = parts;
  // Path completion for cd/chdir
  if (cmd.toLowerCase() === "cd" || cmd.toLowerCase() === "chdir") {
    const partial = args.join(" ").trim();
    let baseDir = getCurrentDirNode();
    let partialSeg = partial;
    if (partial.includes("\\")) {
      const segs = partial.split("\\");
      partialSeg = segs.pop() || "";
      for (const seg of segs) {
        const found = baseDir.dirs.find(
          (d) => d.name.toLowerCase() === seg.toLowerCase(),
        );
        if (found) baseDir = found;
        else return;
      }
    }
    const matches = baseDir.dirs.filter((d) =>
      d.name.toLowerCase().startsWith(partialSeg.toLowerCase()),
    );
    if (matches.length === 1) {
      let prefix = "";
      if (partial.includes("\\"))
        prefix = partial.slice(0, partial.lastIndexOf("\\") + 1);
      input.value = cmd + " " + prefix + matches[0].name;
    }
    return;
  }
  // For other commands, complete files and directories in current dir
  const partial = args.join(" ").trim();
  let baseDir = getCurrentDirNode();
  let partialSeg = partial;
  if (partial.includes("\\")) {
    const segs = partial.split("\\");
    partialSeg = segs.pop() || "";
    for (const seg of segs) {
      const found = baseDir.dirs.find(
        (d) => d.name.toLowerCase() === seg.toLowerCase(),
      );
      if (found) baseDir = found;
      else return;
    }
  }
  const fileMatches = baseDir.files.filter((f) =>
    f.name.toLowerCase().startsWith(partialSeg.toLowerCase()),
  );
  const dirMatches = baseDir.dirs.filter((d) =>
    d.name.toLowerCase().startsWith(partialSeg.toLowerCase()),
  );
  const matches = [
    ...dirMatches.map((d) => d.name),
    ...fileMatches.map((f) => f.name),
  ];
  if (matches.length === 1) {
    let prefix = "";
    if (partial.includes("\\"))
      prefix = partial.slice(0, partial.lastIndexOf("\\") + 1);
    input.value = cmd + " " + prefix + matches[0];
  }
}

onMounted(() => {
  buffer.value.push("Microsoft(R) Windows 98");
  buffer.value.push("(C)Copyright Microsoft Corp 1981-1998.");
  buffer.value.push("\n");
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
