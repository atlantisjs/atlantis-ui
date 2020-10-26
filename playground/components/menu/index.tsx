import { defineComponent } from 'vue';
import { useNavigator } from '../navigator/navigator';
import { appMenus } from './menus';

export default defineComponent({
  name: 'AppMenu',
  setup() {
    const { route, go } = useNavigator();

    return () => (
      <div>
        <ul class="menu">
          {appMenus.map(item => (
            <li
              class={route.value.path === item.route ? 'active' : ''}
              onClick={() => go(item.route)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
});
