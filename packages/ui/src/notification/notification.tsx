import { useToggle } from 'packages/composables';
import { defineComponent, Transition, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'AtsNotification',
  props: {
    title: { type: String, default: '', required: true },
    closable: { type: Boolean, default: true },
    position: { type: String, default: 'top-right' },
    customClass: { type: String },
    duration: { type: Number, default: 3000 },
    pauseOnHover: { type: Boolean, default: true },
    offset: { type: Number, default: 0 },
    onClose: { type: Function, default: () => {} },
  },
  setup(props, { slots }) {
    let timer: number | null;
    let closed = false;

    const positionStyle = computed(() => {
      const verticalProperty = props.position.startsWith('top')
        ? 'top'
        : 'bottom';

      return {
        [verticalProperty]: `${props.offset}px`,
      };
    });

    const { state: visible, toggle: onToggle } = useToggle();

    onMounted(() => {
      onToggle();
      startTimer();
    });

    function close() {
      closed = true;
      onToggle();
      clearTimer();
    }

    function startTimer() {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          if (!closed) {
            close();
          }
        }, props.duration);
      }
    }

    function clearTimer() {
      if (timer) clearTimeout(timer);
      timer = null;
    }

    const classes = computed(() => [
      'ats-notification',
      `${props.position}`,
      props.customClass,
    ]);

    return () => (
      <Transition
        name="ats__bounce"
        mode="out-in"
        onAfterLeave={() => props.onClose?.()}
      >
        <div
          v-show={visible.value}
          class={classes.value}
          style={positionStyle.value}
          onMouseenter={() => props.pauseOnHover && clearTimer()}
          onMouseleave={() => props.pauseOnHover && startTimer()}
        >
          <div class="ats-notification--title">{props.title}</div>

          {slots.default && (
            <div class="ats-notification--message">
              {slots.default && slots.default()}
            </div>
          )}

          {props.closable && (
            <div class="ats-notification--close" onClick={() => close()}>
              x
            </div>
          )}
        </div>
      </Transition>
    );
  },
});
