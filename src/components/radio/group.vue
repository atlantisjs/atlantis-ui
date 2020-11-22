<template>
  <div class="ats-radio-group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  InjectionKey,
  provide,
  nextTick,
  toRefs,
  inject,
} from 'vue';
import { RadioValue } from './radio.vue';

interface RadioGroupCtx {
  modelValue: Ref<RadioValue>;
  disabled: Ref<boolean>;
  onChange: (value: RadioValue) => void;
}

export default defineComponent({
  name: 'AtsRadioGroup',
  props: {
    modelValue: { type: [Boolean, String, Number], required: true },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const onChange = (value: RadioValue) => {
      emit('update:modelValue', value);
      nextTick(() => {
        emit('change', value);
      });
    };

    provide(radioGroupKey, {
      ...toRefs(props),
      onChange,
    });

    return {
      onChange,
    };
  },
});

const radioGroupKey: InjectionKey<RadioGroupCtx> = Symbol.for(
  'AtsRadioGroupKey'
);

export function useAtsRadioGroupKey() {
  return inject(radioGroupKey);
}
</script>
