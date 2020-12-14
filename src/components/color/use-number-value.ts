import { computed, nextTick, ref, watch, getCurrentInstance } from 'vue';

export function useNumberValue(props: { modelValue: number }) {
  const instance = getCurrentInstance();

  const number = ref(0);
  const computedNumber = computed<number>({
    set(value) {
      number.value = value;

      nextTick(() => {
        if (instance) {
          instance.emit('update:modelValue', value);
          instance.emit('change', value);
        }
      });
    },
    get() {
      return number.value;
    },
  });

  watch(
    () => props.modelValue,
    value => {
      number.value = value;
    },
    {
      immediate: true,
    }
  );

  return {
    computedNumber,
  };
}
