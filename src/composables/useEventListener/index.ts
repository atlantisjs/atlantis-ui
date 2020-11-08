import { onBeforeUnmount, watchEffect, Ref, isRef } from 'vue';

export type EventTarget = HTMLElement | Document | Ref<HTMLElement | Document>;

export type EventName = keyof HTMLElementEventMap;

export function useEventListener(
  target: EventTarget,
  option: {
    type: EventName;
    listener: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
  }
) {
  const { type, listener, options } = option;

  if (isRef(target)) {
    let prevEle: HTMLElement | Document;

    const destroyWatcher = watchEffect(
      () => {
        target.value?.addEventListener(type, listener, options);
        if (prevEle) {
          prevEle.removeEventListener(type, listener);
        }
        prevEle = target?.value;
      },
      { flush: 'post' }
    );

    const removeListener = (isDestroyWatcher = true) => {
      target.value.removeEventListener(type, listener);
      if (isDestroyWatcher) {
        destroyWatcher();
      }
    };
    onBeforeUnmount(() => {
      removeListener(true);
    });

    return removeListener;
  } else {
    target.addEventListener(type, listener, options);

    const removeListener = () => {
      target.removeEventListener(type, listener);
    };

    onBeforeUnmount(() => {
      removeListener();
    });

    return removeListener;
  }
}
