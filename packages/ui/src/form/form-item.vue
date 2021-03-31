<template>
  <div class="ats-form-item">
    <label class="ats-form-item__label">{{ label }}</label>
    <div class="ats-form-item__content"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  InjectionKey,
  onBeforeMount,
  provide,
  onBeforeUnmount,
} from 'vue';
import { useAtsForm } from './form.vue';

export interface AtsFormItemCtx {
  validate: () => void;
}

const formItemKey: InjectionKey<AtsFormItemCtx> = Symbol.for('AtsFormItem');

export default defineComponent({
  name: 'AtsFormItem',
  props: {
    rule: { type: Object },
    name: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  setup(props) {
    const validate = () => {
      console.log(props.name);
    };

    const formItemCtx: AtsFormItemCtx = {
      validate,
    };

    provide(formItemKey, formItemCtx);

    const Form = useAtsForm();

    onBeforeMount(() => {
      Form?.addField(formItemCtx);
    });

    onBeforeUnmount(() => {
      Form?.removeField(formItemCtx);
    });

    return {
      validate,
    };
  },
});

export function useAtsFormItem() {
  return inject(formItemKey);
}
</script>
