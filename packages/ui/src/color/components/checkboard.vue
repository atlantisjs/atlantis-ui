<template>
  <div class="ats-checkerboard" :style="bgStyle"></div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Checkboard',
  props: {
    size: { type: Number, default: 8 },
    white: { type: String, default: '#ffffff' },
    grey: { type: String, default: '#e6e6e6' },
  },
  setup(props) {
    const bgStyle = computed(() => ({
      'background-image':
        'url(' + getCheckboard(props.white, props.grey, props.size) + ')',
    }));

    return {
      bgStyle,
    };
  },
});

/**
 * get base 64 data by canvas
 */
function renderCheckboard(c1: string, c2: string, size: number) {
  // Dont Render On Server
  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');

  canvas.width = canvas.height = size * 2;

  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = c2;
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size, size);
  ctx.fillRect(0, 0, size, size);

  return canvas.toDataURL('image/png');
}

const _checkboardCache: Map<string, string> = new Map();

/**
 * get checkboard base data and cache
 */
function getCheckboard(c1: string, c2: string, size: number) {
  const key = c1 + ',' + c2 + ',' + size;

  if (_checkboardCache.get(key)) {
    return _checkboardCache.get(key);
  } else {
    const checkboard = renderCheckboard(c1, c2, size);

    _checkboardCache.set(key, checkboard);

    return checkboard;
  }
}
</script>

<style lang="scss">
.ats-checkerboard {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: repeat;
}
</style>
