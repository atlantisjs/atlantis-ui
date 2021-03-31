<template>
  <div
    :class="[
      'ats-radio',
      {
        'ats-radio--disabled': disabled,
      },
    ]"
  >
    <label>
      <input
        ref="radioRef"
        v-model="checked"
        type="radio"
        role="radio"
        class="ats-radio__input"
        :name="name"
        :value="value"
        :disabled="disabled"
        @change="onChange"
      />
      <span class="ats-radio__inner"></span>
      <span class="ats-radio__label">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed } from 'vue';
import { useAtsRadioGroupKey } from './group.vue';

export type RadioValue = string | number | boolean | undefined;

export default defineComponent({
  name: 'AtsRadio',
  props: {
    modelValue: { type: [Boolean, String, Number], default: '' },
    name: { type: String },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    disabled: Boolean,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const radioRef = ref<HTMLInputElement>();
    const radioGroup = useAtsRadioGroupKey();

    const checked = computed<RadioValue>({
      get() {
        return radioGroup ? radioGroup.modelValue.value : props.modelValue;
      },
      set(val) {
        if (radioGroup) {
          radioGroup.onChange(val);
        } else {
          emit('update:modelValue', val);
        }

        radioRef.value &&
          (radioRef.value.checked = props.modelValue === props.value);
      },
    });

    const onChange = () => {
      nextTick(() => {
        emit('change', checked.value);
      });
    };

    return {
      onChange,
    };
  },
});
</script>
