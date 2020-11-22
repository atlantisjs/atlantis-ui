<script lang="tsx">
import { defineComponent, Teleport } from 'vue';

export default defineComponent({
  name: 'AtsModal',
  props: {
    appendToBody: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const renderModal = () => (
      <div class="at-modal">{slots.default && slots.default()}</div>
    );

    return () => (
      <>
        {props.appendToBody ? (
          <Teleport to="body">{renderModal()}</Teleport>
        ) : (
          renderModal()
        )}
      </>
    );
  },
});
</script>
