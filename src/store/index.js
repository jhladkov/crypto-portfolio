import { createStore } from 'vuex';
import portfolio from '@/store/portfolio';

const store = createStore({
  modules: {
    portfolio,
  },
});

export default store;
