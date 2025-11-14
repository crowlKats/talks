<template>
  <div
    class="h-full flex flex-col items-center"
    v-click
    v-motion
    :initial="{ y: 80 }"
    :enter="{ y: 0 }"
  >
    <div
      class="relative rounded-lg inline-block p-3 px-6 z-20 dark:bg-[#222]/70 bg-[#ddd]/50"
    >
      <h2 class="font-bold text-[--jsr-yellow]">
        {{ title }}
      </h2>
    </div>
    <div
      class="dark:bg-[#181818]/70 bg-[#eee]/70 rounded-lg p-6 pt-10 relative -top-7 z-10 border dark:border-[#222]/90 border-[#eee]/90 flex-1 flex flex-col"
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
