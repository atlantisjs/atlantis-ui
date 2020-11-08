import { defineComponent } from 'vue';
// import { createPopper } from '@popperjs/core';

export default defineComponent({
  name: 'AtsTooltip',
  props: {
    content: { type: String, default: '' },
    placement: { type: String, default: 'top' }
  },
  setup(props, { slots }) {
    // const createPopperElement = () => {
    //   const el = document.createElement('div');

    //   return el;
    // };

    return () => (
      <div class="ats-tooltip">{slots.default && slots.default()}</div>
    );
  }
});
