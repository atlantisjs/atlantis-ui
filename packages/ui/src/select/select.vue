<template>
  <div class="ats-select">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, InjectionKey, PropType, provide } from 'vue';
import { AtsSelectOptionCtx } from './option.vue';

type SelectMode = 'single' | 'multiple' | 'tags';

interface AtsSelectCtx {
  addSelectItems: (item: AtsSelectOptionCtx) => void;
  removeSelectItems: (item: AtsSelectOptionCtx) => void;
}

const selectKey: InjectionKey<AtsSelectCtx> = Symbol.for('AtsSelect');

export default defineComponent({
  name: 'AtsSelect',
  props: {
    modelValue: { type: [String, Array], default: '' },
    mode: { type: String as PropType<SelectMode>, default: 'single' },
    placeholder: { type: String },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup() {
    const selectItems: AtsSelectOptionCtx[] = [];

    const addSelectItems = (item: AtsSelectOptionCtx) => {
      selectItems.push(item);
    };
    const removeSelectItems = (item: AtsSelectOptionCtx) => {
      selectItems.splice(selectItems.indexOf(item), 1);
    };

    const selectCtx = {
      addSelectItems,
      removeSelectItems,
    };

    provide(selectKey, selectCtx);
  },
});

export function useAtsSelect() {
  return inject(selectKey);
}
</script>
