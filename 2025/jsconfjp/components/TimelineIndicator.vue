<template>
  <div class="absolute bottom-5px right-160px left-50px">
    <img :src="`/timeline_indicator_${version}.svg`" :alt="`version 2.${version} timeline indicator`" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  version: string;
}>();
</script>
