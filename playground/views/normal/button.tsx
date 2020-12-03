import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ButtonPage',
  setup() {
    const checked = ref([]);
    const current = ref(0);
    const visible = ref(false);

    return () => (
      <div>
        <ats-button
          onClick={() => {
            visible.value = !visible.value;
          }}
        >
          12332132
        </ats-button>

        <ats-checkbox-group v-model={checked.value}>
          <ats-checkbox value="a">abvadasd</ats-checkbox>
          <ats-checkbox value="b">abvadasd</ats-checkbox>
          <ats-checkbox value="c">abvadasd</ats-checkbox>
          <ats-checkbox value="d">abvadasd</ats-checkbox>
          <ats-checkbox value="e">abvadasd</ats-checkbox>
        </ats-checkbox-group>

        <ats-steps current={current.value}>
          <ats-step title="1111"></ats-step>
          <ats-step title="2222"></ats-step>
        </ats-steps>

        <ats-modal visible={visible.value}>anbc</ats-modal>
      </div>
    );
  },
});
