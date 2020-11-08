import { computed, defineComponent, PropType } from 'vue';

type ButtonType = 'primary' | 'danger' | 'text' | 'default';
type ButtonNativeType = 'button' | 'submit' | 'reset';

export default defineComponent({
  name: 'AtsButton',
  props: {
    type: { type: String as PropType<ButtonType>, default: 'default' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    nativeType: { type: String as PropType<ButtonNativeType> },
    block: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    circle: { type: Boolean, default: false }
  },
  setup(props, { slots, attrs }) {
    const classes = computed(() => [
      'ats-button',
      `ats-button--${props.type}`,
      {
        'ats-button--round': props.round,
        'ats-button--circle': props.circle,
        'ats-button--loading': props.loading,
        'ats-button--block': props.block
      }
    ]);

    return () => (
      <button
        class={classes.value}
        type={props.nativeType}
        disabled={props.disabled}
        {...attrs}
      >
        {slots.default && slots.default()}
      </button>
    );
  }
});
