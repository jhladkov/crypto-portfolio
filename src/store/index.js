import { createStore } from 'vuex';
import portfolio from '@/store/portfolio';
import modal from '@/store/modal';
import transactions from '@/store/transactions';
import auth from '@/store/auth';

const store = createStore({
  modules: {
    portfolio,
    modal,
    transactions,
    auth,
  },
});

export default store;
