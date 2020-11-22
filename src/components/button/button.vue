<template>
  <button
    :class="[
      'ats-button',
      `ats-button--${type}`,
      {
        'ats-button--round': round,
        'ats-button--circle': circle,
        'ats-button--loading': loading,
        'ats-button--block': block,
      },
    ]"
    :type="nativeType"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type ButtonType = 'primary' | 'danger' | 'text' | 'default';
type ButtonNativeType = 'button' | 'submit' | 'reset';

export default defineComponent({
  name: 'AtsButton',
  props: {
    type: { type: String as PropType<ButtonType>, default: 'default' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    nativeType: { type: String as PropType<ButtonNativeType> },
    block: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
  },
});
</script>
