import axios from 'axios';

const state = {
  WBSKData: [],
  chartData: [],
  searchData: [],
  connection: null,
};

const getters = {
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
      shortName: item?.symbol,
      price: item?.currentPrice.toFixed(2),
      holdTokens: item?.amount.toFixed(2),
      change: item?.priceChangePercentage24h.toFixed(2),
      hold: item?.cryptoHoldings.toFixed(2),
      avg: item?.buyAvgPrice.toFixed(2),
      profit: ((item?.currentPrice * item?.amount)
          - (item?.buyAvgPrice * item?.amount)).toFixed(2),
      src: item.image,
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
};

const actions = {
  async getPortfolio({ commit }) {
    try {
      const res = await axios.get('http://vm3356913.52ssd.had.wf:5000/get-portfolio?id=1', {
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

  getConnectionToWebSocket({ commit }) {
    const connection = new WebSocket('ws://vm3356913.52ssd.had.wf:5000/');
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
