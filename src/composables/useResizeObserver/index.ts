import ResizeObserver from 'resize-observer-polyfill';
import { watchEffect, Ref, ref, isRef, onBeforeUnmount } from 'vue';
import { ElementType, isComponentPublicInstance } from '@/utils';
import throttle from 'lodash.throttle';

interface UseResizeOptions {
  wait?: number;
}

export function useResizeObserver(
  el?: Ref<ElementType> | Element,
  options: UseResizeOptions = { wait: 200 }
) {
  const resizeObserverEntry = ref<ResizeObserverEntry>();

  const observer = new ResizeObserver(
    throttle(entries => {
      resizeObserverEntry.value = entries[0];
    }, options.wait)
  );

  const targetRef = el || ref<ElementType>();
  const targetElRef = ref<Element>();

  watchEffect(
    () => {
      if (isRef(targetRef)) {
        if (targetRef.value) {
          targetElRef.value = isComponentPublicInstance(targetRef.value)
            ? targetRef.value.$el
            : targetRef.value;
        }
      } else {
        targetElRef.value = targetRef;
      }
    },
    { flush: 'post' }
  );

  watchEffect(
    () => {
      if (targetElRef.value) observer.observe(targetElRef.value);

      return () => {
        clearObserve();
      };
    },
    { flush: 'post' }
  );

  onBeforeUnmount(() => {
    observer.disconnect();
  });

  function clearObserve() {
    if (targetElRef.value) observer.unobserve(targetElRef.value);
  }

  return {
    targetRef,
    resizeObserverEntry,
    clearObserve,
  };
}
