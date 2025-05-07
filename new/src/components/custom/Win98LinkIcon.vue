<template>
  <a
    :href="href"
    :target="target || undefined"
    class="win98-link-icon"
    tabindex="0"
  >
    <Win98Icon :icon="icon" />
    <div class="label">{{ label }}</div>
  </a>
</template>

<script setup lang="ts">
import Win98Icon from './Win98Icon.vue'

defineProps<{
  icon: string
  label: string
  href: string
  target?: string
}>()
</script>

<style scoped>
.win98-link-icon {
  display: inline-block;
  width: 64px;
  text-align: center;
  font-family: 'Tahoma', 'Geneva', sans-serif;
  font-size: 13px;
  color: white;
  text-shadow: 1px 1px 0 #000, 0 0 2px #000;
  user-select: none;
  text-decoration: none;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
}
.win98-link-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.label {
  margin-top: 4px;
  word-break: break-word;
  border: 1px dotted transparent;
  border-radius: 0;
  padding: 2px 4px;
  box-sizing: border-box;
}
.win98-link-icon:hover .label {
  border-color: #fff;
}
</style> 
