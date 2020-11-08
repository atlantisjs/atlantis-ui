import { App } from 'vue';
import Input from './input';

export { Input };

export default {
  install(app: App) {
    app.component(Input.name, Input);
  }
};
