<template>
  <div class="ats-alpha-picker" :class="[`ats-alpha-picker--${direction}`]">
    <div class="ats-alpha-picker__checkboard">
      <checkboard></checkboard>
    </div>
    <div
      class="ats-alpha-picker__gradient"
      :style="{ background: gradientColor }"
    ></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import tinycolor from 'tinycolor2';
import { useNumberValue } from '../use-number-value';
import Checkboard from './checkboard.vue';

type Direction = 'horizontal' | 'vertical';

export default defineComponent({
  name: 'AtsAlphaPicker',
  components: {
    Checkboard,
  },
  props: {
    modelValue: { type: Number, default: 0 },
    direction: { type: String as PropType<Direction>, default: 'horizontal' },
    color: { type: String, default: '#000' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props) {
    const { computedNumber: computedAlpha } = useNumberValue(props);
    const gradientColor = computed(() => {
      const rgba = tinycolor(props.color).toRgb();
      const rgbStr = [rgba.r, rgba.g, rgba.b].join(',');
      const direction = props.direction === 'horizontal' ? 'right' : 'bottom';

      return `linear-gradient(to ${direction}, rgba(${rgbStr}, 0) 0%, rgba(${rgbStr}, 1) 100%)`;
    });

    return {
      computedAlpha,
      gradientColor,
    };
  },
});
</script>

<style lang="scss">
.ats-alpha-picker {
  position: relative;
  width: 100%;
  height: 100%;

  &--horizontal {
  }
  &--vertical {
  }

  &__checkboard,
  &__gradient {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
</style>
