<template>
  <div>{{ count }}</div>
  <at-button @click="increment">+</at-button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Button as AtButton } from '@atlantis/ui/src/button';

export default defineComponent({
  name: 'App',
  components: {
    AtButton,
  },
  setup() {
    const count = ref(0);

    const increment = () => count.value++;

    return {
      count,
      increment,
    };
  },
});
</script>

