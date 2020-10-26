import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  DefineComponent,
  markRaw,
  watch
} from 'vue';
import { useNavigator } from './navigator';

export const NavigatorPage = defineComponent({
  name: 'NavigatorPage',
  setup() {
    const state = reactive({
      PageComponent: null as null | DefineComponent
    });

    const { route } = useNavigator();

    const utils = {
      reset: async () => {
        const { path } = route.value;
        if (!path) return;

        const Component = defineAsyncComponent(() =>
          import('playground/views/' + path)
        );
        state.PageComponent = markRaw(Component);
      }
    };

    watch(() => route.value.path, utils.reset, { immediate: true });

    return () => {
      const { PageComponent } = state;

      return (
        <div class="app-navigator-page">
          {!!PageComponent ? <PageComponent /> : null}
        </div>
      );
    };
  }
});
