<template>
  <div
    :class="[
      'ats-radio-button',
      {
        'ats-radio-button--disabled': disabled,
        'ats-radio-button--active': checked === value,
      },
    ]"
  >
    <label>
      <input
        v-model="checked"
        type="radio"
        :value="value"
        :name="name"
        :disabled="disabled"
      />
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { RadioValue } from './radio.vue';
import { useAtsRadioGroupKey } from './group.vue';

export default defineComponent({
  name: 'AtsRadioButton',
  props: {
    name: { type: String },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    disabled: Boolean,
  },
  setup() {
    const radioGroup = useAtsRadioGroupKey();
    const checked = computed<RadioValue>({
      get() {
        return radioGroup?.modelValue.value;
      },
      set(val) {
        radioGroup?.onChange(val);
      },
    });

    return {
      checked,
    };
  },
});
</script>
