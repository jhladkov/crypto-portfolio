import { createApp } from 'vue';

import directives from '@/directives/index';
import VCalendar from 'v-calendar';
import globalUIElements from '@/helpers/globalUIElements';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

directives.forEach((directive) => {
  app.directive(directive.name, directive); // register directives
});

globalUIElements.forEach((component) => {
  app.component(component.name, component);
});

app
  .use(router)
  .use(store)
  .use(VCalendar, {})
  .mount('#app');
