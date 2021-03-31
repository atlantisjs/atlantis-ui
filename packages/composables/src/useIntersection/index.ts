import { onBeforeUnmount, ref } from 'vue';

export function useIntersection(options: IntersectionObserverInit) {
  const intersectionObserverEntries = ref<IntersectionObserverEntry[]>([]);
  let observedTargets: HTMLElement[] | Element[] = [];

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      intersectionObserverEntries.value = entries;
    },
    options
  );

  function startObserve(targets: HTMLElement[] | Element[]) {
    if (observedTargets.length) clearObserve();

    targets.forEach(target => observer.observe(target));
    observedTargets = targets;
  }

  function clearObserve() {
    observedTargets.forEach(target => observer.unobserve(target));
  }

  onBeforeUnmount(() => {
    observer.disconnect();
  });

  return {
    intersectionObserverEntries,
    startObserve,
    clearObserve
  };
}
