<script setup>
import { loadSlim } from "@tsparticles/slim"; // or "tsparticles" for the full bundle

// This is the function that will be called to initialize the particles engine
const particlesInit = async (engine) => {
  await loadSlim(engine);
};

// This is the event handler for when the particles container is loaded
const particlesLoaded = async (container) => {
  console.log("Particles container loaded", container);
};

const randomId = `particles-${Math.random().toString(36).slice(2, 9)}`;

const options = {
  fpsLimit: 120,
  particles: {
    color: {
      value: [
        "#22d3ee",
        "#ffd100",
        "#0e7490",
        "#a5f3fc",
        "#083344",
        "#cffafe",
        "#cbd5e1",
      ],
    },
    links: {
      color: "#22d3ee",
      distance: 140,
      enable: true,
      opacity: 1,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.60,
      direction: "top",
      random: false,
      straight: false,
      outModes: "out",
      bounce: false,
    },
    number: {
      value: 90,
      limit: 0,
      density: {
        enable: true,
        area: 2084,
      },
    },
    opacity: {
      value: 1,
    },
    shape: {
      type: "polygon",
      options: {
        polygon: {
          sides: 4,
        },
      },
    },
    size: {
      value: { min: 1, max: 10 },
    },
  },
  detectRetina: true,
};

defineProps({
  blur: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div :class='["particles-mask", { blurred: blur }]'>
    <vue-particles
      :id="randomId"
      :particlesInit="particlesInit"
      :particlesLoaded="particlesLoaded"
      :options="options"
    />
  </div>
</template>

<style scoped>
.particles-mask {
  position: relative;
  width: 100%;
  height: 100%;

  z-index: -90;

  /* Apply a mask to fade out the content at the bottom */
  -webkit-mask-image: linear-gradient(
    to bottom,
    black 0%,
    black calc(100% - 8rem),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    black 0%,
    black calc(100% - 8rem),
    transparent 100%
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;

  background-color: #121417;
}

.blurred {
  filter: blur(12px);
}

html:not(.dark) {
  .particles-mask {
    background-color: #ffffff;
  }

  .blurred {
    filter: blur(6px);
  }
}
</style>
