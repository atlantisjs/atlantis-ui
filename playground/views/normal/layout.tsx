import { useToggle } from '@/composables';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutPage',
  setup() {
    const { state, toggle } = useToggle(false);

    return () => (
      <>
        <ats-button onClick={() => toggle()}>button</ats-button>
        <ats-backdrop visible={state.value}>123123123</ats-backdrop>
      </>
    );
  },
});
