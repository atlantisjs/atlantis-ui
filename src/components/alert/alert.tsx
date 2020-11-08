import { computed, defineComponent, PropType, Transition } from 'vue';
import { oneOf } from '@/utils';

type AlertType = 'success' | 'info' | 'warning' | 'error';

export default defineComponent({
  name: 'AtsAlert',
  props: {
    modelValue: { type: Boolean, default: true },
    type: {
      type: String as PropType<AlertType>,
      validator: (value: string) =>
        oneOf(value, ['success', 'info', 'warning', 'error'])
    },
    closable: { type: Boolean, default: true },
    showIcon: { type: Boolean, default: false },
    description: { type: String }
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const classes = computed(() => [
      'ats-alert',
      {
        [`ats-alert--${props.type}`]: props.type
      }
    ]);

    const onClose = () => {
      emit('update:modelValue', false);
    };

    return () => (
      <Transition name="fade">
        {props.modelValue && (
          <div class={classes.value}>
            {props.showIcon && <div class="ats-alert--icon">icon</div>}
            <div class="ats-alert--title">
              {slots.default && slots.default()}
            </div>
            {(slots.description || props.description) && (
              <div class="ats-alert--title">
                {slots.description ? slots.description() : props.description}
              </div>
            )}
            {props.closable && (
              <div class="ats-alert--close" onClick={() => onClose()}>
                {slots.close ? slots.close() : 'x'}
              </div>
            )}
          </div>
        )}
      </Transition>
    );
  }
});
