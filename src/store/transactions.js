import axios from 'axios';

const api = 'localhost';

const state = {
  chosenTransaction: null,
};

const getters = {
  getChosenTransaction(state) {
    return state.chosenTransaction;
  },
};

const mutations = {
  setChosenTransaction(state, transaction) {
    state.chosenTransaction = transaction;
  },
};

const actions = {
  async changeTransaction(_, payload) {
    await axios.post(`http://${api}:5000/change-transaction?token=${localStorage.getItem('token')}`, {
      ...payload,
    }, {
      params: {
        id: localStorage.getItem('selectedPortfolio'),
      },
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
