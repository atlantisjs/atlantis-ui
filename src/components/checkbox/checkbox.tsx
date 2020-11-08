import { computed, defineComponent, inject, nextTick, PropType } from 'vue';
import { checkboxGroupKey } from './group';

export type CheckboxValue = string[] | number[] | boolean;

export default defineComponent({
  name: 'AtsCheckbox',
  props: {
    modelValue: {
      type: [Array, Boolean] as PropType<CheckboxValue>,
      default: () => []
    },
    name: { type: String },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    disabled: Boolean
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit }) {
    const checkboxGroup = inject(checkboxGroupKey);

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
      }
    });

    const classes = computed(() => [
      'ats-checkbox',
      {
        'ats-checkbox--disabled': props.disabled
      }
    ]);

    return () => (
      <div class={classes.value}>
        <label>
          <input
            v-model={checked.value}
            type="checkbox"
            value={props.value}
            name={props.name}
            disabled={props.disabled}
          />
          <span class="ats-checkbox__label">
            {slots.default ? slots.default() : props.label}
          </span>
        </label>
      </div>
    );
  }
});
