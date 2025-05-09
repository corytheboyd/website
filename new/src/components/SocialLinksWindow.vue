<template>
  <Win98Window
    id="social-links"
    title="Social Links"
    class="w-auto"
    :width="500"
    :height="200"
    :position="{ x: 300, y: 300 }"
  >
    <p class="mb-2">Only offline WEIRDOS don't have these! 🤮</p>
    <div class="flex flex-col space-y-2">
      <ul class="space-y-1.5">
        <li>
          <a
            href="https://mastodon.social/@corytheboyd"
            target="_blank"
            class="text-blue-600 hover:underline"
          >
            https://mastodon.social/@corytheboyd
          </a>
        </li>
        <li>
          <a
            href="https://bsky.app/profile/corytheboyd.bsky.social"
            target="_blank"
            class="text-blue-600 hover:underline"
          >
            https://bsky.app/profile/corytheboyd.bsky.social
          </a>
        </li>
      </ul>
    </div>
  </Win98Window>
</template>

<script setup lang="ts">
import Win98Window from "@/components/base/Win98Window.vue";
</script>
