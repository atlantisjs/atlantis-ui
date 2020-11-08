import { defineComponent, InjectionKey, provide } from 'vue';
import { useExpose } from '@/composables';

interface AtsFormCtx {
  validate: (prop: string) => {};
}

export const formKey: InjectionKey<AtsFormCtx> = Symbol.for('form');

export default defineComponent({
  name: 'AtsForm',
  props: {},
  setup(props, { slots }) {
    const validate = (prop: string) => {
      console.log(prop);
    };
    async function validates() {
      console.log('validates');
    }
    const resetFields = () => {
      console.log('resetFields');
    };
    const scrollToField = (prop: string) => {
      console.log(prop);
    };

    provide(formKey, {
      validate
    });

    useExpose({
      validate,
      validates,
      resetFields,
      scrollToField
    });

    return () => <div class="ats-form">{slots.default && slots.default()}</div>;
  }
});
