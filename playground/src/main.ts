import { createApp } from 'vue';
import App from './App.vue';
import { AtlantisPlugin } from '../../packages/ui/src/index';

const app = createApp(App);

app.use(AtlantisPlugin).mount('#app');
