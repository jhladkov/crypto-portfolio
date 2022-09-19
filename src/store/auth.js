import { Gateway } from '@/setup/axios';

const state = {
  accountInfo: undefined,
};

const getters = {
  getAccountInfo(state) {
    return state.accountInfo;
  },
};

const mutations = {
  setAccountInfo(state, value) {
    state.accountInfo = value;
  },
  resetAccountInfo(state) {
    state.accountInfo = undefined;
  },
};

const actions = {
  async checkUser({ commit }) {
    try {
      commit('portfolio/setLoading', { value: true, loadingName: 'portfolioLoading' }, { root: true });
      const res = await Gateway.get('check-user', { headers: { token: localStorage.getItem('token') } });
      if (res) {
        commit('setAccountInfo', {
          ...res,
        });
        // commit('setSelectedPortfolio', res.data?.portfolios[0]?.id);
      }
      commit('portfolio/setLoading', { value: false, loadingName: 'portfolioLoading' }, { root: true });
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('selectedPortfolio');
    } finally {
      commit('portfolio/setLoading', { value: false, loadingName: 'portfolioLoading' }, { root: true });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
