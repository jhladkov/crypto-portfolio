import { ModalTypes } from '@/constants/enums';

const state = {
  currentModal: 'TransactionModal',
  timestamp: 0,
  modals: Object.keys(ModalTypes).reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {}),
};

const getters = {
  getModal(state) {
    return (type) => state.modals[type];
  },
};

const mutations = {
  setTimestamp(state, value) {
    state.timestamp = value;
  },
  setCurrentModal(state, value) {
    state.currentModal = value;
  },
  openModal(state, type) {
    state.modals[type] = true;
  },
  closeModal(state, type) {
    state.modals[type] = false;
  },
};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
