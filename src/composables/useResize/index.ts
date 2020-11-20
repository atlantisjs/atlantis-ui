import ResizeObserver from 'resize-observer-polyfill';
import { onBeforeUnmount, onMounted, Ref, ref, isRef } from 'vue';

export function useResize(el: HTMLElement | Ref<HTMLElement>) {
  const resizeObserverEntry = ref<ResizeObserverEntry>();

  const observer = new ResizeObserver(entries => {
    resizeObserverEntry.value = entries[0];
  });

  onMounted(() => {
    if (isRef(el)) {
      observer.observe(el.value);
    } else {
      observer.observe(el);
    }
  });

  onBeforeUnmount(() => {
    observer.disconnect();
  });

  function clearObserve() {
    if (isRef(el)) {
      observer.unobserve(el.value);
    } else {
      observer.unobserve(el);
    }
  }

  return {
    resizeObserverEntry,

    clearObserve
  };
}
