<script lang="tsx">
import { defineComponent, nextTick, Teleport, watch } from 'vue';
import { useToggle } from '@/composables';

export default defineComponent({
  name: 'AtsModal',
  props: {
    modelValue: { type: Boolean, default: false },
    appendToBody: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    const { state: visible, toggle: toggleVisible } = useToggle();

    watch(
      () => props.modelValue,
      value => {
        toggleVisible(value);
      },
      { immediate: true }
    );

    const onClose = () => {
      toggleVisible();

      nextTick(() => {
        emit('update:modelValue', visible.value);
      });
    };

    const renderModal = () => (
      <div class="ats-modal">
        <div onClick={() => onClose()}>close</div>
        <div class="ats-modal__content">{slots.default && slots.default()}</div>
      </div>
    );

    return () => (
      <>
        {visible.value && (
          <Teleport to="body" disabled={!props.appendToBody}>
            {renderModal()}
          </Teleport>
        )}
      </>
    );
  },
});
</script>
