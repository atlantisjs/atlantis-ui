<template>
  <div>
    <ats-form>
      <ats-input ref="inputRef" v-model="text" minlength="123">
        <template #prefix>prefix</template>
      </ats-input>
    </ats-form>

    <div>{{ text }}</div>

    <ats-button @click="toggle">toggle</ats-button>

    <ats-alert v-model="visible" type="success" :description="text">
      哈哈哈啊哈
      <template #close>
        closea
      </template>
    </ats-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { useToggle } from '@/composables';

export default defineComponent({
  name: 'InputPage',
  setup() {
    const text = ref('');
    const { state: visible, toggle } = useToggle();

    const inputRef = ref<null | HTMLInputElement>(null);

    watchEffect(
      () => {
        console.log(inputRef.value);
        inputRef.value?.focus();
      },
      { flush: 'post' }
    );

    return {
      text,
      inputRef,
      visible,
      toggle
    };
  }
});
</script>
