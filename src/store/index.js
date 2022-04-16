import { createStore } from 'vuex';
import portfolio from '@/store/portfolio';
import modal from '@/store/modal';

const store = createStore({
  modules: {
    portfolio,
    modal,
  },
});

export default store;
