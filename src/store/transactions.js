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
    await axios.post(`http://${api}:5000/change-transaction?id=1`, {
      ...payload,
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
