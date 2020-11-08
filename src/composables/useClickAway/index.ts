import { Ref } from 'vue';
import { useEventListener, EventName } from '../useEventListener';

const defaultEvent: EventName = 'click';

export function useClickAway(
  el: Ref<HTMLElement>,
  onClickAway: (event: Event) => void,
  eventName: EventName = defaultEvent,
  container: Document | HTMLElement | Ref<HTMLElement> = document
) {
  function onClickAwayFn(e: Event) {
    const dom = el.value;
    if (!dom || dom.contains(e.target as HTMLElement)) {
      return;
    }

    onClickAway(e);
  }

  const removeListener: (...args: any) => any = useEventListener(container, {
    type: eventName,
    listener: onClickAwayFn
  });

  return removeListener;
}
