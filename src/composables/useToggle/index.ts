import { ref } from 'vue';

type ToggleState = string | number | boolean;

export function useToggle(
  defaultValue: ToggleState = false,
  reverseValue?: ToggleState
) {
  const state = ref(defaultValue);

  function toggle(value?: ToggleState) {
    if (typeof reverseValue === 'undefined') {
      reverseValue = !defaultValue;
    }

    if (typeof value === 'undefined') {
      state.value = state.value === defaultValue ? reverseValue : defaultValue;
      return;
    }

    if (value === defaultValue || value === reverseValue) {
      state.value = value;
    } else {
      state.value = state.value === defaultValue ? reverseValue : defaultValue;
      console.warn(
        `Function toggle parameter must be ${defaultValue} or ${reverseValue}`
      );
    }
  }

  return { state, toggle };
}
