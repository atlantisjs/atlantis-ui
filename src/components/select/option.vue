<template>
  <div class="ats-select-option">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount } from 'vue';
import { useAtsSelect } from './select.vue';

export interface AtsSelectOptionCtx {
  value: string | number;
}

export default defineComponent({
  name: 'AtsSelectOption',
  props: {
    value: { type: [String, Number], default: '' },
  },
  setup(props) {
    const selectOptionCtx: AtsSelectOptionCtx = {
      value: props.value,
    };

    const Select = useAtsSelect();

    onBeforeMount(() => {
      Select?.addSelectItems(selectOptionCtx);
    });
    onBeforeUnmount(() => {
      Select?.removeSelectItems(selectOptionCtx);
    });
  },
});
</script>
