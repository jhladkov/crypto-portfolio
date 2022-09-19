import { createApp } from 'vue';

import { setupInterceptors } from '@/setup/axios';
import directives from '@/directives/index';
import VCalendar from 'v-calendar';
import globalUIElements from '@/helpers/globalUIElements';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

setupInterceptors();

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
