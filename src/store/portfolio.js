import axios from 'axios';

const api = 'localhost';
// const api = 'vm3356913.52ssd.had.wf';

const calcProfitByHistoryList = (historyList, tokenInfo) => {
  if (historyList.length > 1) {
    const resultArr = [];
    historyList.forEach((item) => {
      const initSpentMoney = item.amount * item.price;
      const currentPrice = item.amount * tokenInfo.currentPrice;
      const profit = +currentPrice - +initSpentMoney;
      resultArr.push(profit);
    });
    return resultArr.reduce((init, item) => init + item, 0).toFixed(2);
  }
  return ((tokenInfo?.currentPrice * tokenInfo?.amount)
      - (tokenInfo?.buyAvgPrice * tokenInfo?.amount))?.toFixed(2);
};

const calcProfitInPercent = (historyList, tokenInfo) => {
  const calcProfit = calcProfitByHistoryList(historyList, tokenInfo);
  if (historyList.length > 1) {
    const result = historyList.reduce((init, item) => init + (item.amount * item.price), 0);
    return ((calcProfit * 100) / result).toFixed(2);
  }
  return ((((tokenInfo?.currentPrice * tokenInfo?.amount)
    - (tokenInfo?.buyAvgPrice * tokenInfo?.amount))
    * 100) / (+tokenInfo?.amount * +tokenInfo?.buyAvgPrice)).toFixed(2);
};

// const calcProfitInPercent = (item) => ((((item?.currentPrice * item?.amount)
//     - (item?.buyAvgPrice * item?.amount))
//     * 100) / (+item?.amount * +item?.buyAvgPrice)).toFixed(2);

const state = {
  WBSKData: [],
  chartData: {
    1: [],
    7: [],
    30: [],
    90: [],
    max: [],
  },
  searchData: [],
  connection: null,
  totalPrice: 0,
  activePeriod: 1,
};

const getters = {
  getActivePeriod(state) {
    return state.activePeriod;
  },
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
    const data = state.chartData['1'];
    if (!data?.length) return 0;
    return Number(data[data.length - 1][1] - data[0][1]).toFixed(2);
  },
  totalProfitInPercents(state) {
    const data = state.chartData['1'];
    if (!data?.length) return 0;
    return -(((data[0][1] * 100) / data[data.length - 1][1]) - 100).toFixed(2);
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
      type: item?.type,
      shortName: item?.symbol.toUpperCase(),
      price: item?.currentPrice?.toFixed(2),
      holdTokens: item?.amount?.toFixed(2),
      change: +item?.priceChangePercentage24h?.toFixed(2),
      hold: item?.cryptoHoldings?.toFixed(2),
      avg: item?.buyAvgPrice?.toFixed(2),
      profit_loss_percent: calcProfitInPercent(item?.historyList, item),
      profit: calcProfitByHistoryList(item?.historyList, item),
      src: item.image,
      historyList: item?.historyList,
    }));
  },
};

const mutations = {
  setActivePeriod(state, value) {
    state.activePeriod = value;
  },
  setWBSKData(state, value) {
    state.WBSKData = value;
  },
  setConnection(state, value) {
    state.connection = value;
  },
  setChartData(state, obj) {
    state.chartData = { ...state.chartData, [`${obj.period}`]: obj.data };
  },
  setSearchData(state, value) {
    state.searchData = value;
  },
  setTotalPrice(state, value) {
    state.totalPrice = value;
  },
};

const actions = {
  async removeToken(_, payload) {
    await axios.post(`http://${api}:5000/remove-token?id=1`, {
      cryptocurrencyId: payload,
    });
  },

  async getParticularTokenPrice(_, payload) {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${payload}&vs_currencies=usd`).catch(
      (err) => console.warn(err),
    );
    return response.data[`${payload}`].usd;
  },

  async getInitArrayTokens() {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false';
    const response = await axios.get(url).catch(
      (err) => console.warn(err),
    );
    return response;
  },

  async addTokenToPortfolio(_, payload) {
    await axios.post(`http://${api}:5000/add-to-portfolio?id=1`, {
      ...payload,
    });
  },
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

  async getCharts({ commit }, period = 1) {
    try {
      const res = await axios.get(`http://${api}:5000/chart-values?id=1&period=${period}`, {
        headers: {
          withCredentials: true,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
        },
      });
      commit('setChartData', { data: res.data?.historyChart, period });
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
