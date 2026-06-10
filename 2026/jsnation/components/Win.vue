<template>
  <div
    class="rounded-xl overflow-hidden shadow-2xl border dark:border-[#333] border-[#ddd] inline-block text-left w-full"
  >
    <div
      class="flex items-center gap-2 px-4 py-2.5 dark:bg-[#2a2a2a] bg-[#ededed]"
    >
      <span class="size-3 rounded-full bg-[#ff5f57]" />
      <span class="size-3 rounded-full bg-[#febc2e]" />
      <span class="size-3 rounded-full bg-[#28c840]" />
      <span class="ml-3 text-sm opacity-60">{{ title }}</span>
    </div>
    <div class="dark:bg-[#161616] bg-white px-6 py-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>
