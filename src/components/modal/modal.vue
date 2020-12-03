<script lang="tsx">
import { defineComponent, Teleport } from 'vue';

export default defineComponent({
  name: 'AtsModal',
  props: {
    visible: { type: Boolean, default: false },
    appendToBody: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const renderModal = () => (
      <div class="at-modal">{slots.default && slots.default()}</div>
    );

    return () => (
      <>
        {props.visible && (
          <Teleport to="body" disabled={!props.appendToBody}>
            {renderModal()}
          </Teleport>
        )}
      </>
    );
  },
});
</script>
