<template>
  <div
    :class="[
      'ats-checkbox',
      {
        'ats-checkbox--disabled': disabled,
      },
    ]"
  >
    <label>
      <input
        v-model="checked"
        type="checkbox"
        :value="value"
        :name="name"
        :disabled="disabled"
      />
      <span class="ats-checkbox__label">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, PropType } from 'vue';
import { useAtsCheckboxGroup } from './group.vue';

export type CheckboxValue = string[] | number[] | boolean;

export default defineComponent({
  name: 'AtsCheckbox',
  props: {
    modelValue: {
      type: [Array, Boolean] as PropType<CheckboxValue>,
      default: () => [],
    },
    name: { type: String },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    disabled: Boolean,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const checkboxGroup = useAtsCheckboxGroup();

    const checked = computed<CheckboxValue>({
      get() {
        return checkboxGroup ? checkboxGroup.model.value : props.modelValue;
      },
      set(val) {
        if (checkboxGroup) {
          checkboxGroup.onChange(val);
        } else {
          emit('update:modelValue', val);

          nextTick(() => {
            emit('change', val);
          });
        }
      },
    });

    return {
      checked,
    };
  },
});
</script>
