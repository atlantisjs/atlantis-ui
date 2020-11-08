import { defineComponent, ref, inject } from 'vue';
import { isKorean } from '@/utils';
import { useExpose } from '@/composables';
import { formKey } from '@/components/form/form';
import { computed } from '@vue/reactivity';

export default defineComponent({
  name: 'AtsInput',
  props: {
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear'],
  setup(props, { slots, attrs, emit }) {
    const inputRef = ref<HTMLInputElement | null>(null);

    const atsForm = inject(formKey);

    atsForm?.validate('12313');

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

    useExpose({
      focus: onFocus,
      blur: onBlur
    });

    const classes = computed(() => [
      'ats-input',
      {
        'ats-input--disabled': props.disabled,
        'ats-input--prefix': slots.prefix,
        'ats-input--suffix': slots.suffix
      }
    ]);

    return () => (
      <div class={classes.value}>
        {slots.prefix && <div class="ats-input--prefix">{slots.prefix()}</div>}
        <input
          class="ats-input--inner"
          type={props.type}
          ref={inputRef}
          disabled={props.disabled}
          onInput={e => handleInput(e)}
          onChange={e => handleChange(e)}
          onBlur={e => handleBlur(e)}
          onFocus={e => handleFocus(e)}
          onCompositionstart={() => handleCompositionStart()}
          onCompositionupdate={e => handleCompositionUpdate(e)}
          onCompositionend={e => handleCompositionEnd(e)}
          {...attrs}
        />
        {slots.suffix && <div class="ats-input--suffix">{slots.suffix()}</div>}
      </div>
    );
  }
});
