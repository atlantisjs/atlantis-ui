<template>
  <div class="ats-tooltip">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { createPopper } from '@popperjs/core';
// import type { VNode} from 'vue'

export default defineComponent({
  name: 'AtsTooltip',
  props: {
    content: { type: String, default: '' },
    placement: { type: String, default: 'top' },
  },
  setup() {
    // const createPopperElement = () => {
    //   const el = document.createElement('div');

    //   return el;
    // };

    return {};
  },
});
</script>
