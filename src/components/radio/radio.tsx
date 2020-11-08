import { defineComponent, ref, nextTick, computed, inject } from 'vue';
import { radioGroupKey } from './group';

export type RadioValue = string | number | boolean | undefined;

export default defineComponent({
  name: 'AtsRadio',
  props: {
    modelValue: { type: [Boolean, String, Number], default: '' },
    name: { type: String },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    disabled: Boolean
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit }) {
    const radioRef = ref<HTMLInputElement>();

    const radioGroup = inject(radioGroupKey);

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
      }
    });

    const onChange = () => {
      nextTick(() => {
        emit('change', checked.value);
      });
    };

    const classes = computed(() => [
      'ats-radio',
      {
        'ats-radio--disabled': props.disabled
      }
    ]);

    return () => (
      <div class={classes}>
        <label>
          <input
            v-model={checked.value}
            ref={radioRef}
            type="radio"
            role="radio"
            name={props.name}
            value={props.value}
            class="ats-radio__input"
            disabled={props.disabled}
            onChange={onChange}
          />
          <span class="ats-radio__inner"></span>
          <span class="ats-radio__label">
            {slots.default ? slots.default() : props.label}
          </span>
        </label>
      </div>
    );
  }
});
