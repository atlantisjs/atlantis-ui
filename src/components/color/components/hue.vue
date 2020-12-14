<template>
  <div class="ats-hue-picker" :class="[`ats-hue-picker--${direction}`]"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useNumberValue } from '../use-number-value';

type Direction = 'horizontal' | 'vertical';

export default defineComponent({
  name: 'HuePicker',
  props: {
    modelValue: { type: Number, default: 0 },
    direction: { type: String as PropType<Direction>, default: 'horizontal' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const { computedNumber: computedHue } = useNumberValue(props);

    return {
      computedHue,
    };
  },
});
</script>

<style lang="scss">
.ats-hue-picker {
  position: relative;
  width: 100%;
  height: 100%;

  &--horizontal {
    background: linear-gradient(
      to right,
      #f00 0%,
      #ff0 17%,
      #0f0 33%,
      #0ff 50%,
      #00f 67%,
      #f0f 83%,
      #f00 100%
    );
  }
  &--vertical {
    background: linear-gradient(
      to top,
      #f00 0%,
      #ff0 17%,
      #0f0 33%,
      #0ff 50%,
      #00f 67%,
      #f0f 83%,
      #f00 100%
    );
  }
}
</style>
