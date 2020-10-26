import { defineComponent, ref, provide, inject, onBeforeUnmount } from 'vue';

export interface Route {
  path: string;
  hash?: string;
  param?: { [k: string]: string };
}

const APP_NAVIGATOR_PROVIDER = '@@app-navigator';

function getRoute(defaultPath = ''): Route {
  let locationHash = window.location.hash || '';

  if (locationHash.charAt(0) === '#') {
    locationHash = locationHash.slice(1);
  }

  const location = decodeURIComponent(locationHash).split('#');

  let [path] = location;
  const [, hash] = location;

  if (path.charAt(0) === '/') {
    path = path.slice(1);
  }

  return {
    path: path || defaultPath,
    hash
  };
}

function useAppNavigator(defaultPath?: string) {
  const currentRoute = getRoute(defaultPath);
  const route = ref(currentRoute);

  function go(route: string | Route) {
    let path;

    if (typeof route === 'string') {
      path = route;
    } else {
      path = route.path;
    }

    window.location.hash = encodeURIComponent(path);
  }

  const handler = {
    hashchange: () => {
      route.value = getRoute();
    }
  };

  window.addEventListener('hashchange', handler.hashchange);
  onBeforeUnmount(() =>
    window.removeEventListener('hashchange', handler.hashchange)
  );

  const refer = {
    route,
    go
  };

  provide(APP_NAVIGATOR_PROVIDER, refer);

  return refer;
}

export function useNavigator() {
  return inject(APP_NAVIGATOR_PROVIDER) as ReturnType<typeof useAppNavigator>;
}

export const Navigator = defineComponent({
  name: 'Navigator',
  props: {
    defaultPath: { type: String, default: '' }
  },
  setup(props, { slots }) {
    useAppNavigator(props.defaultPath);

    return () => (!!slots.default ? slots.default() : null);
  }
});
