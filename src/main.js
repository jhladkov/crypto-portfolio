import { createApp } from 'vue';

import directives from '@/directives/index';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

directives.forEach((directive) => {
  console.log(directive);
  app.directive(directive.name, directive); // register directives
});

app
  .use(router)
  .use(store)
  .mount('#app');
