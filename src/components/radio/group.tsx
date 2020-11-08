import {
  defineComponent,
  Ref,
  InjectionKey,
  provide,
  nextTick,
  toRefs
} from 'vue';
import { RadioValue } from './radio';

interface RadioGroupCtx {
  modelValue: Ref<RadioValue>;
  disabled: Ref<boolean>;
  onChange: (value: RadioValue) => void;
}

export const radioGroupKey: InjectionKey<RadioGroupCtx> = Symbol.for(
  'AtsRadioGroupKey'
);

export default defineComponent({
  name: 'AtsRadioGroup',
  props: {
    modelValue: { type: [Boolean, String, Number], required: true },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit }) {
    const onChange = (value: RadioValue) => {
      emit('update:modelValue', value);
      nextTick(() => {
        emit('change', value);
      });
    };

    provide(radioGroupKey, {
      ...toRefs(props),
      onChange
    });

    return () => (
      <div class="ats-radio-group">{slots.default && slots.default()}</div>
    );
  }
});
