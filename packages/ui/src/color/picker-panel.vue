<template>
  <div class="ats-color-picker-panel" aria-label="color picker">
    <div class="ats-color-picker-panel__saturation">
      <div class="saturation--white"></div>
      <div class="saturation--black"></div>
      <div class="saturation--pointer">
        <div class="pointer-circle"></div>
      </div>
    </div>
    <div class="ats-color-picker-panel__controls">
      <div class="controls__hue-slider">
        <hue-picker v-model="hsl.h"></hue-picker>
      </div>
      <div class="controls__alpha-slider">
        <alpha-picker v-model="hsl.a" :color="hexColor"></alpha-picker>
      </div>
    </div>
    <div class="ats-color-picker-panel__fields"></div>
    <div class="ats-color-picker-panel__presets">
      <div
        v-for="c in presetColors"
        :key="c"
        :aria-label="'Color:' + c"
        class="presets-color"
        :style="{ background: c }"
        @click="onClickPreset(c)"
      >
        <checkboard v-if="isTransparent(c)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive } from 'vue';
import tinycolor from 'tinycolor2';
import HuePicker from './components/hue.vue';
import AlphaPicker from './components/alpha.vue';
import Checkboard from './components/checkboard.vue';

const presetColors = [
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
  'rgba(0,0,0,0)',
];

export default defineComponent({
  name: 'AtsColorPanel',
  components: {
    HuePicker,
    AlphaPicker,
    Checkboard,
  },
  props: {
    modelValue: { type: String },
    presetColors: {
      type: Array as PropType<string[]>,
      default: () => presetColors,
    },
    disableAlpha: { type: Boolean, default: false },
    disableFields: { type: Boolean, default: false },
  },
  setup() {
    const hsl = reactive({
      h: 0,
      s: 0,
      l: 0,
      a: 0,
    });
    const hexColor = computed(() => tinycolor(hsl).toHex());
    const rgbaColor = computed(() => tinycolor(hsl).toRgb());

    const onClickPreset = (color: string) => {
      const value = tinycolor(color).toHsl();

      hsl.h = value.h;
      hsl.s = value.s;
      hsl.l = value.l;
      hsl.a = value.a;
    };

    const isTransparent = (color: string) => tinycolor(color).toRgb().a === 0;

    return {
      hsl,
      hexColor,
      rgbaColor,

      onClickPreset,

      isTransparent,
    };
  },
});
</script>
