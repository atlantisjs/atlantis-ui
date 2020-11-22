<template>
  <div class="ats-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  InjectionKey,
  nextTick,
  PropType,
  provide,
  WritableComputedRef,
  toRefs,
  Ref,
  inject,
} from 'vue';
import { CheckboxValue } from './checkbox.vue';

interface CheckboxGroupCtx {
  model: WritableComputedRef<CheckboxValue>;
  onChange: (value: CheckboxValue) => void;
  min: Ref<number>;
  max?: Ref<number | undefined>;
}

export default defineComponent({
  name: 'AtsCheckboxGroup',
  props: {
    modelValue: {
      type: [Boolean, Array] as PropType<CheckboxValue>,
      default: () => [],
    },
    disabled: { type: Boolean, default: false },
    min: { type: Number, default: 0 },
    max: { type: Number },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const model = computed<CheckboxValue>({
      get() {
        return props.modelValue;
      },
      set(val) {
        onChange(val);
      },
    });

    function onChange(val: CheckboxValue) {
      emit('update:modelValue', val);
      nextTick(() => {
        emit('change', val);
      });
    }

    provide(checkboxGroupKey, {
      model,
      ...toRefs(props),
      onChange,
    });

    return {
      model,
      onChange,
    };
  },
});

const checkboxGroupKey: InjectionKey<CheckboxGroupCtx> = Symbol.for(
  'AtsCheckboxGroup'
);

export function useAtsCheckboxGroup() {
  return inject(checkboxGroupKey);
}
</script>
