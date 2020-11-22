<template>
  <div>
    <ats-form ref="formRef">
      <ats-form-item label="百度" name="name">
        <ats-input ref="inputRef" v-model="text" minlength="123"> </ats-input>
      </ats-form-item>
    </ats-form>

    <div>{{ text }}</div>

    <ats-button @click="onClick">toggle</ats-button>

    <ats-alert v-model="visible" type="success" :description="text">
      哈哈哈啊哈
      <template #close>
        closea
      </template>
    </ats-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useToggle } from '@/composables';
import { Form } from '@/index';

export default defineComponent({
  name: 'InputPage',
  setup() {
    const text = ref('');
    const { state: visible, toggle } = useToggle();

    const inputRef = ref<null | HTMLInputElement>(null);
    const formRef = ref<typeof Form | null>(null);

    const onClick = () => {
      formRef.value?.validates();
    };

    return {
      text,
      inputRef,
      visible,
      toggle,

      formRef,
      onClick,
    };
  },
});
</script>
