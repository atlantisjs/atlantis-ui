import { computed, defineComponent, inject } from 'vue';
import { RadioValue } from './radio';
import { radioGroupKey } from './group';

export default defineComponent({
  name: 'AtsRadioButton',
  props: {
    name: { type: String },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    disabled: Boolean
  },
  setup(props, { slots }) {
    const radioGroup = inject(radioGroupKey);
    const checked = computed<RadioValue>({
      get() {
        return radioGroup?.modelValue.value;
      },
      set(val) {
        radioGroup?.onChange(val);
      }
    });

    const classes = computed(() => [
      'ats-radio-button',
      {
        'ats-radio-button--disabled': props.disabled,
        'ats-radio-button--active': checked.value === props.value
      }
    ]);

    return () => (
      <div class={classes.value}>
        <label>
          <input
            v-model={checked.value}
            type="radio"
            value={props.value}
            name={props.name}
            disabled={props.disabled}
          />
          {slots.default ? slots.default() : props.label}
        </label>
      </div>
    );
  }
});
