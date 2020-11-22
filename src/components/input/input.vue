<template>
  <div
    :class="[
      'ats-input',
      {
        'ats-input--disabled': disabled,
        'ats-input--prefix': $slots.prefix,
        'ats-input--suffix': $slots.suffix,
      },
    ]"
  >
    <div v-if="$slots.prefix" class="ats-input--prefix">
      <slot name="prefix"></slot>
    </div>

    <input
      ref="inputRef"
      class="ats-input--inner"
      :type="type"
      :disabled="disabled"
      @input="handleInput"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
    />

    <div v-if="$slots.suffix" class="ats-input--suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { isKorean } from '@/utils';
// import { useAtsForm } from '../form/form.vue';

export default defineComponent({
  name: 'AtsInput',
  props: {
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear'],
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null);

    const handleInput = (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      emit('input', target.value);
      emit('update:modelValue', target.value);
    };
    const handleChange = (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      emit('change', target.value);
    };

    const focused = ref(false);

    const handleBlur = (evt: Event) => {
      focused.value = false;
      emit('blur', evt);
    };
    const handleFocus = (evt: Event) => {
      focused.value = true;
      emit('focus', evt);
    };

    const isComposing = ref(false);

    // 文本合成事件 用于中文拼音输入
    const handleCompositionStart = () => {
      isComposing.value = true;
    };
    const handleCompositionUpdate = (event: CompositionEvent) => {
      const text = (event.target as HTMLInputElement).value;
      const lastCharacter = text[text.length - 1] || '';
      isComposing.value = !isKorean(lastCharacter);
    };
    const handleCompositionEnd = (event: CompositionEvent) => {
      if (isComposing.value) {
        isComposing.value = false;
        handleInput(event);
      }
    };

    const onFocus = () => {
      inputRef.value?.focus();
    };
    const onBlur = () => {
      inputRef.value?.blur();
    };

    return {
      inputRef,

      handleChange,
      handleInput,
      handleFocus,
      handleBlur,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,

      focus: onFocus,
      blur: onBlur,
    };
  },
});
</script>
