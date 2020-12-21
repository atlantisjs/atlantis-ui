<template>
  <div ref="targetRef" class="wraper">
    <ats-button ref="buttonRef" class="button1">
      button
    </ats-button>
  </div>
</template>

<script lang="ts">
import { useDraggable } from '@/composables';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutPage',
  setup() {
    const { draggableRef: buttonRef, targetRef } = useDraggable();

    return {
      buttonRef,
      targetRef,
    };
  },
});
</script>

<style lang="scss">
.wraper {
  position: relative;
  left: 100px;
  width: 400px;
  height: 500px;
  background-color: red;
}
.button1 {
  position: absolute;
}
</style>
