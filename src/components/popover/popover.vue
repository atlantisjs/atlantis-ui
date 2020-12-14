<template>
  <teleport to="body" :disabled="!appendToBody">
    <div class="ats-poppver">
      <slot name="content"></slot>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Trigger, Placement } from './types';

export const DEFAULT_TRIGGER: Trigger = 'hover';

export default defineComponent({
  name: 'AtsPoppver',
  props: {
    appendToBody: { type: Boolean, default: false },
    arrowOffset: { type: Number, default: 5 },
    trigger: {
      type: [String, Array] as PropType<Trigger>,
      default: DEFAULT_TRIGGER,
    },
    disabled: { type: Boolean, default: false },
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom' as Placement,
    },
  },
  emits: ['update:visible', 'after-enter', 'after-leave'],
  setup() {},
});
</script>
