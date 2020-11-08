import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AtsFormItem',
  props: {
    rule: { type: Object }
  },
  setup() {
    const validate = () => {
      console.log('validate');
    };

    return {
      validate
    };
  }
});
