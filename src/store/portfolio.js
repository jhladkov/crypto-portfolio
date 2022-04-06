const state = {
  test: 123,
};

const getters = {
  getTest(store) {
    return store.test;
  },
};

const mutations = {
  update(store, val) {
    store.test = val;
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
