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

// router.beforeEach((to, from, next) => {
//   console.log(to);
//   if (!localStorage.getItem('token')) {
//     next('/portfolio-auth');
//   }
// });

export default router;
