import MainLayout from '@/views/main/MainLayout.vue';

export default {
  path: '',
  name: 'MainLayout',
  component: MainLayout,
  children: [
    {
      path: '',
      name: 'Portfolio',
      component: () => import(
        /* webpackChunkName: "portfolio" */
        '../views/main/portfolio/Portfolio.vue'
      ),
    },
    {
      path: '/transactions/:token',
      name: 'Transactions',
      component: () => import(
        /* webpackChunkName: "transactions" */
        '../views/main/transactions/Transactions.vue'
      ),
    },
  ],
};
