import axios from 'axios';
import { ModalTypes } from '@/constants/enums';

// const api = 'localhost';
const api = 'vm3356913.52ssd.had.wf';

const calcProfit = (item) => ((((item?.currentPrice * item?.amount)
    - (item?.buyAvgPrice * item?.amount))
    * 100) / (+item?.amount * +item?.buyAvgPrice)).toFixed(2);

const state = {
  modals: Object.keys(ModalTypes).reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {}),
  WBSKData: [],
  chartData: [],
  searchData: [],
  connection: null,
  totalChangesFor24H: {
    totalPrice: 0,
    totalProfit: 0,
    totalProfitInPercents: 0,
  },
};

const getters = {
  getModal(state) {
    return (type) => state.modals[type];
  },
  totalPrice(state) {
    return `$${state.totalChangesFor24H.totalPrice?.toFixed(2)}`;
  },
  totalProfit(state) {
    return `$${state.totalChangesFor24H.totalProfit?.toFixed(2)}`;
  },
  totalProfitInPercents(state) {
    return `$${state.totalChangesFor24H.totalProfitInPercents?.toFixed(2)}`;
  },
  connection(state) {
    return state.connection;
  },
  chartData(state) {
    return state.chartData;
  },
  searchData(state) {
    return state.searchData;
  },
  getTokensList(state) {
    const data = state.WBSKData;
    return data?.map((item) => ({
      name: item?.name,
      shortName: item?.symbol.toUpperCase(),
      price: item?.currentPrice?.toFixed(2),
      holdTokens: item?.amount?.toFixed(2),
      change: +item?.priceChangePercentage24h?.toFixed(2),
      hold: item?.cryptoHoldings?.toFixed(2),
      avg: item?.buyAvgPrice?.toFixed(2),
      profit_loss_percent: calcProfit(item),
      profit: ((item?.currentPrice * item?.amount)
          - (item?.buyAvgPrice * item?.amount))?.toFixed(2),
      src: item.image,
    }));
  },
};

const mutations = {
  openModal(state, type) {
    state.modals[type] = true;
  },
  closeModal(state, type) {
    state.modals[type] = false;
  },
  setWBSKData(state, value) {
    state.WBSKData = value;
  },
  setConnection(state, value) {
    state.connection = value;
  },
  setChartData(state, value) {
    state.chartData = value;
  },
  setSearchData(state, value) {
    state.searchData = value;
  },
  setTotalPrice(state, value) {
    state.totalChangesFor24H.totalPrice = value;
  },
  setTotalProfit(state, value) {
    state.totalChangesFor24H.totalProfit = value;
  },
  setTotalProfitInPercents(state, value) {
    state.totalChangesFor24H.totalProfitInPercents = value;
  },
};

const actions = {
  async getPortfolio({ commit }) {
    try {
      const res = await axios.get(`http://${api}:5000/get-portfolio?id=1`, {
        headers: {
          withCredentials: true,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
        },
      });

      commit('setWBSKData', res.data.tokenList);
    } catch (err) {
      console.warn(err);
    }
  },

  async getCharts({ commit }) {
    try {
      const res = await axios.get(`http://${api}:5000/chart-values?id=1`, {
        headers: {
          withCredentials: true,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
        },
      });
      commit('setChartData', res.data);
    } catch (err) {
      console.warn(err);
    }
  },

  disconnectFromWebSocket({ state }) {
    state.connection.close('Close');
  },

  connectToWebSocket({ commit }) {
    const connection = new WebSocket(`ws://${api}:5000/`);
    connection.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const { data } = response;
      if (response?.action === 'portfolio') {
        commit('setWBSKData', data.tokenList);
      }
      if (response?.action === 'chart') {
        commit('setChartData', data);
      }
      if (response?.action === 'search') {
        commit('setSearchData', data);
      }
    };

    connection.onopen = () => {
      // console.log('Successfully connected to the echo websocket server...');
      connection.send(JSON.stringify({
        method: 'getPortfolio',
        id: 1,
      }));
    };
    connection.onerror = () => {
      console.log('Error');
    };
    commit('setConnection', connection);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
