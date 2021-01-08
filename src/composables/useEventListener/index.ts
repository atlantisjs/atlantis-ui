import { watchEffect, Ref, ref, isRef } from 'vue';
import { ElementType, isComponentPublicInstance } from '@/utils';

export type EventName = keyof HTMLElementEventMap;

export function useEventListener(
  target: Ref<ElementType | undefined> | ElementType | undefined,
  option: {
    type: EventName;
    listener: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
  }
) {
  const { type, listener, options } = option;

  const targetElRef = ref<Element>();

  watchEffect(
    () => {
      if (isRef(target)) {
        if (target.value) {
          targetElRef.value = isComponentPublicInstance(target.value)
            ? target.value.$el
            : target;
        }
      } else {
        if (target)
          targetElRef.value = isComponentPublicInstance(target)
            ? target.$el
            : target;
      }
    },
    { flush: 'post' }
  );

  watchEffect(
    onInvalidate => {
      targetElRef.value?.addEventListener(type, listener, options);

      onInvalidate(() => {
        targetElRef.value?.removeEventListener(type, listener);
      });
    },
    { flush: 'post' }
  );
}
