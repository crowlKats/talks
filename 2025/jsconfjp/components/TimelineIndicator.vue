<template>
  <div class="absolute bottom-5px right-160px left-50px">
    <img :src="asset" :alt="`version 2.${version} timeline indicator`" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { resolveAssetUrl } from "../layoutHelper";

const props = defineProps<{
  version: string;
}>();

const asset = computed(() =>
    resolveAssetUrl(`/timeline_indicator_${props.version}.svg`)
);
</script>
