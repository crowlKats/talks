<template>
  <div class="text-left h-full flex flex-col items-start" v-click>
    <div>
      <h2 class="font-bold text-[--jsr-yellow]">
        {{ title }}
      </h2>
    </div>
    <div
      class="rounded-lg pt-10 relative -top-7 z-10 flex-1 flex flex-col"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
