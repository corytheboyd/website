<template>
  <a :href="href" :target="target || undefined">
    <Win98Icon :icon="icon" />
    <div class="label">{{ label }}</div>
  </a>
</template>

<script setup lang="ts">
import Win98Icon from "@/components/custom/Win98Icon.vue";

defineProps<{
  icon: string;
  label: string;
  href: string;
  target?: string;
}>();
</script>
