<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="visible"
      class="ats-backdrop"
      :class="{ 'is-invisible': invisible }"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AtsBackdrop',
  props: {
    visible: { type: Boolean, default: false },
    invisible: { type: Boolean, default: false },
  },
});
</script>
