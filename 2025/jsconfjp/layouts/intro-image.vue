<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps({
  image: {
    type: String,
  },
  class: {
    type: String,
  },
  backgroundSize: {
    type: String,
    default: "cover",
  },
});

const style = computed(() =>
  handleBackground(props.image, false, props.backgroundSize)
);
</script>

<template>
  <div class="grid grid-cols-5 w-full h-full auto-rows-fr">
    <div class="col-span-3 slidev-layout intro" :class="props.class">
      <div class="my-auto">
        <slot />
      </div>
    </div>
    <div class="col-span-2 w-full h-full" :style="style" />
  </div>
</template>
