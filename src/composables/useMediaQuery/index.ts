import { onBeforeUnmount, onMounted, ref } from 'vue';

interface UseMediaQueryOptions {
  onChange: (e: MediaQueryListEvent) => void;
}

export function useMediaQuery(
  mediaQueryString: string,
  options?: UseMediaQueryOptions
) {
  const matches = ref(false);

  const mql: MediaQueryList = window.matchMedia(mediaQueryString);

  const onChange = (e: MediaQueryListEvent) => {
    matches.value = e.matches;
    options?.onChange(e);
  };

  onMounted(() => {
    mql.addEventListener('change', onChange);
  });

  onBeforeUnmount(() => {
    mql.removeEventListener('change', onChange);
  });

  return {
    matches
  };
}
