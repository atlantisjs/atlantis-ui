<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      :class="[
        'ats-alert',
        {
          [`ats-alert--${type}`]: type,
        },
      ]"
    >
      <div v-if="showIcon" class="ats-alert--icon">icon</div>

      <div class="ats-alert--title"><slot></slot></div>
      <div
        v-if="description || $slot.description"
        class="ats-alert--description"
      >
        <slot name="description">{{ description }}</slot>
      </div>

      <div v-if="closable" class="ats-alert--close" onClick="onClose">
        <slot name="close">x</slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { oneOf } from '@/utils';

type AlertType = 'success' | 'info' | 'warning' | 'error';

export default defineComponent({
  name: 'AtsAlert',
  props: {
    modelValue: { type: Boolean, default: true },
    type: {
      type: String as PropType<AlertType>,
      validator: (value: string) =>
        oneOf(value, ['success', 'info', 'warning', 'error']),
    },
    closable: { type: Boolean, default: true },
    showIcon: { type: Boolean, default: false },
    description: { type: String },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onClose = () => {
      emit('update:modelValue', false);
    };

    return {
      onClose,
    };
  },
});
</script>
