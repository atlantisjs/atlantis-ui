import { defineComponent } from 'vue';
import { injectAppNavigator } from '../navigator/navigator';
import { AppMenu, appMenus } from './menus';

export default defineComponent({
  name: 'AppMenu',
  props: {
    currentPath: { type: String, default: '' }
  },
  setup() {
    const navigator = injectAppNavigator();

    const handleClickMenu = (menu: AppMenu) => {
      navigator.go(menu.route);
    };

    return () => (
      <div>
        <ul>
          {appMenus.map(item => (
            <li onClick={() => handleClickMenu(item)}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  }
});
