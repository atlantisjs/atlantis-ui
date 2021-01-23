import { ref, watchEffect, watch } from 'vue';
import { ElementType, isComponentPublicInstance } from '@/utils';

interface Coords {
  x: number;
  y: number;
}

interface CoordsLimits {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface UseDraggableOptions {
  controlStyle?: boolean;
  viewport?: boolean;
  coordsLimits?: CoordsLimits;
}

export function useDraggable({
  controlStyle = true,
  viewport = true,
  ...options
}: UseDraggableOptions = {}) {
  const { coordsLimits } = options;
  const draggableRef = ref<ElementType>();
  const targetRef = ref<ElementType>();

  const draggableElRef = ref<HTMLElement>();
  const targetElRef = ref<HTMLElement>();

  watchEffect(
    () => {
      if (draggableRef.value) {
        draggableElRef.value = isComponentPublicInstance(draggableRef.value)
          ? draggableRef.value.$el
          : draggableRef.value;
      }

      if (targetRef.value) {
        targetElRef.value = isComponentPublicInstance(targetRef.value)
          ? targetRef.value.$el
          : targetRef.value;
      }
    },
    { flush: 'post' }
  );

  const isDragging = ref(false);
  const coords = ref<Coords>({ x: 0, y: 0 });

  const initialCoords = { x: 0, y: 0 };
  const limits = ref<CoordsLimits>({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });

  // 给 draggableElRef的 dom 添加mousedown事件
  watchEffect(
    onInvalidate => {
      const element = draggableElRef.value;

      if (!element) return;

      element.addEventListener('mousedown', startDragging);

      function startDragging(event: MouseEvent) {
        event.preventDefault();

        isDragging.value = true;

        const {
          top: eleTop,
          left: eleLeft,
          width: eleWidth,
          height: eleHeight,
        } = (element as Element).getBoundingClientRect();
        const { clientX, clientY } = event;

        initialCoords.x = clientX - eleTop;
        initialCoords.y = clientY - eleLeft;

        if (viewport || coordsLimits) {
          if (viewport) {
            if (targetElRef.value) {
              const {
                left,
                top,
                width,
                height,
              } = targetElRef.value.getBoundingClientRect();

              limits.value = {
                minX: 0,
                maxX: width - eleWidth,
                minY: 0,
                maxY: height - eleHeight,
              };

              initialCoords.x = clientX - eleLeft + left;
              initialCoords.y = clientY - eleTop + top;
            } else {
              limits.value = {
                minX: 0,
                maxX: window.innerWidth - eleWidth,
                minY: 0,
                maxY: window.innerHeight - eleHeight,
              };
            }
          } else if (coordsLimits) {
            limits.value = coordsLimits;
          }
        }

        onInvalidate(() => {
          element?.removeEventListener('mousedown', startDragging);
        });
      }
    },
    { flush: 'post' }
  );

  watchEffect(
    onInvalidate => {
      if (isDragging.value) {
        document.addEventListener('mousemove', draging, { passive: true });
        document.addEventListener('mouseup', stopDragging);
      }

      if (controlStyle && draggableElRef.value) {
        draggableElRef.value.style.cursor = isDragging.value
          ? 'grabbing'
          : 'grab';
      }

      function draging(event: MouseEvent) {
        if (isDragging.value) {
          const { clientX, clientY } = event;
          const x = clientX - initialCoords.x;
          const y = clientY - initialCoords.y;

          coords.value = calcCoords({ x, y }, limits.value);
        }
      }

      function stopDragging(event: MouseEvent) {
        event.preventDefault();
        isDragging.value = false;

        document.removeEventListener('mousemove', draging);
        document.removeEventListener('mouseup', stopDragging);
      }

      onInvalidate(() => {
        document.removeEventListener('mousemove', draging);
        document.removeEventListener('mouseup', stopDragging);
      });
    },
    { flush: 'post' }
  );

  watch(
    coords,
    ({ x, y }) => {
      if (draggableElRef.value) {
        draggableElRef.value.style.top = y + 'px';
        draggableElRef.value.style.left = x + 'px';
      }
    },
    { flush: 'post' }
  );

  return { draggableRef, targetRef, isDragging, coords };
}

function calcCoords({ x, y }: Coords, limits: CoordsLimits) {
  if (!limits) {
    return { x, y };
  }

  const { minX, maxX, minY, maxY } = limits;

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
}
