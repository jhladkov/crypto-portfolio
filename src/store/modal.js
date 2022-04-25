import { ModalTypes } from '@/constants/enums';

const state = {
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
