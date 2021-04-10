import { App } from 'vue';
import { Backdrop } from './backdrop';
import { Button } from './button';

const AtlantisPlugin = {
  install(app: App) {
    app.component(Backdrop.name, Backdrop);
    app.component(Button.name, Button);
  },
};

export { AtlantisPlugin, Backdrop, Button };
