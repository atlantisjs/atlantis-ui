<template>
  <div class="ats-form">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, InjectionKey, provide, PropType } from 'vue';
import { AtsFormItemCtx } from './form-item.vue';

type FormLayout = 'horizontal' | 'vertical' | 'inline';

interface AtsFormCtx {
  layout: FormLayout;
  addField: (field: AtsFormItemCtx) => void;
  removeField: (field: AtsFormItemCtx) => void;
}

export default defineComponent({
  name: 'AtsForm',
  props: {
    layout: { type: String as PropType<FormLayout>, default: 'horizontal' },
  },
  setup(props) {
    const fields: AtsFormItemCtx[] = [];

    const addField = (field: AtsFormItemCtx) => {
      fields.push(field);
    };
    const removeField = (field: AtsFormItemCtx) => {
      fields.splice(fields.indexOf(field), 1);
    };

    const validate = (prop: string) => {
      console.log(prop);
    };
    function validates() {
      for (const field of fields) {
        field.validate();
      }
    }
    const resetFields = () => {
      console.log('resetFields');
    };
    const scrollToField = (prop: string) => {
      console.log(prop);
    };

    const formCtx: AtsFormCtx = {
      layout: props.layout,
      addField,
      removeField,
    };

    provide(formKey, formCtx);

    return {
      validate,
      validates,
      resetFields,
      scrollToField,
    };
  },
});

const formKey: InjectionKey<AtsFormCtx> = Symbol.for('AtsForm');

export function useAtsForm() {
  return inject(formKey);
}
</script>
