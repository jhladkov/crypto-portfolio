import { createStore } from 'vuex';
import portfolio from '@/store/portfolio';
import modal from '@/store/modal';
import transactions from '@/store/transactions';

const store = createStore({
  modules: {
    portfolio,
    modal,
    transactions,
  },
});

export default store;
