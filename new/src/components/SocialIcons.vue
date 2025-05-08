<template>
  <section class="flex flex-row justify-center items-center gap-x-4 w-full">
    <Win98LinkIcon icon="mailbox_world-2" label="Email" href="mailto:public@corytheboyd.com" />
    <Win98LinkIcon icon="console_prompt-0" label="Code" href="https://github.com/corytheboyd" target="_blank" />
    <Win98LinkIcon icon="write_yellow-1" label="Blog" href="https://blog.corytheboyd.com/blog" target="_blank" />
    <Win98LinkIcon icon="wm-4" label="Music" href="https://soundcloud.com/corytheboyd" target="_blank" />
  </section>
</template>

<script setup lang="ts">
import Win98LinkIcon from './custom/Win98LinkIcon.vue';
</script>
