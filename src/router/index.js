import { createRouter, createWebHistory } from 'vue-router';
import main from '@/router/main';

const routes = [
  {
    path: '/',
    component: {
      name: 'RouterRoot',
      template: '<router-view/>',
    },
    children: [
      main,
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
