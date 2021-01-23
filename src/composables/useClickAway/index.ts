import { Ref } from 'vue';
import { useEventListener, EventName } from '../useEventListener';
import { ElementType } from '@/utils';

const defaultEvent: EventName = 'click';

export function useClickAway(
  el: Ref<HTMLElement>,
  onClickAway: (event: Event) => void,
  eventName: EventName = defaultEvent,
  container: ElementType = document.documentElement
) {
  function onClickAwayFn(e: Event) {
    const dom = el.value;
    if (!dom || dom.contains(e.target as HTMLElement)) {
      return;
    }

    onClickAway(e);
  }

  useEventListener(container, {
    type: eventName,
    listener: onClickAwayFn,
  });
}
