import axios from 'axios';

const api = 'localhost';
// const api = 'vm3356913.52ssd.had.wf';

const calcProfit = (item) => ((((item?.currentPrice * item?.amount)
    - (item?.buyAvgPrice * item?.amount))
    * 100) / (+item?.amount * +item?.buyAvgPrice)).toFixed(2);

const state = {
  WBSKData: [],
  chartData: [],
  searchData: [],
  connection: null,
  totalPrice: 0,
};

const getters = {
  calculatedTotalPrice(state) {
    return state.WBSKData.reduce((acc, next) => {
      acc += Number(next.cryptoHoldings);
      return acc;
    }, 0);
  },
  totalPrice(state) {
    return state.totalPrice.toFixed(2);
  },
  totalProfit(state) {
    const data = state.chartData?.historyChart24h;
    if (!data?.length) return 0;
    return Number(data[data.length - 1][1] - data[0][1]).toFixed(2);
  },
  totalProfitInPercents(state) {
    const data = state.chartData?.historyChart24h;
    if (!data?.length) return 0;
    return (((data[0][1] * 100) / data[data.length - 1][1]) - 100).toFixed(2);
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
      historyList: item?.historyList,
    }));
  },
};

const mutations = {
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
    state.totalPrice = value;
  },
};

const actions = {
  async getPortfolio({ commit, getters }) {
    try {
      const res = await axios.get(`http://${api}:5000/get-portfolio?id=1`, {
        headers: {
          withCredentials: true,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
        },
      });

      commit('setWBSKData', res.data.tokenList);
      commit('setTotalPrice', getters.calculatedTotalPrice);
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
      connection.send(JSON.stringify({
        method: 'getPortfolio',
        id: 1,
      }));
    };
    connection.onerror = () => {
      console.warn('Error');
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
