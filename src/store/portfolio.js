import axios from 'axios';
import { Gateway } from '@/setup/axios';

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
  selectedPortfolio: undefined,
  portfolios: [],
  searchData: [],
  connection: null,
  loadingState: {
    chartLoading: false,
    assetSectionLoading: false,
    transactionsLoading: false,
    portfolioLoading: false,
    portfolioPanelLoading: false,
  },
  totalPrice: 0,
  activePeriod: 1,
  activeToken: null,
};

const getters = {
  getLoadingState(state) {
    return state.loadingState;
  },
  getActivePeriod(state) {
    return state.activePeriod;
  },
  getActiveToken(state) {
    return state.activeToken;
  },
  getTotalPortfoliosPrice(state) {
    return state.portfolios?.reduce((sum, item) => sum + +item.totalPrice, 0);
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
    // const data = getters.chartData['1'];
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
      id: item.cryptocurrencyId,
    })).sort((a, b) => b.hold - a.hold);
  },
};

const mutations = {
  setActiveToken(state, value) {
    state.activeToken = { ...value, image: value.src };
  },
  resetPortfolioStore(state) {
    state.WBSKData = [];
    state.chartData = {
      1: [],
      7: [],
      30: [],
      90: [],
      max: [],
    };
    state.portfolios = [];
    state.selectedPortfolio = undefined;
    state.searchData = [];
    state.connection = null;
    state.loadingState = {
      chartLoading: false,
      assetSectionLoading: false,
      transactionsLoading: false,
      portfolioLoading: false,
      portfolioPanelLoading: false,
    };
    state.totalPrice = 0;
    state.activePeriod = 1;
    state.activeToken = null;
  },
  setPortfolios(state, value) {
    state.portfolios = value;
  },
  setSelectedPortfolio(state, value) {
    localStorage.setItem('selectedPortfolio', value);
    state.selectedPortfolio = value;
  },
  setLoading(state, { value, loadingName }) {
    state.loadingState[loadingName] = value;
  },
  resetActiveToken(state) {
    state.activeToken = null;
  },
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
  async removeToken(_, cryptocurrencyId) {
    try {
      await Gateway.post('remove-token', {
        cryptocurrencyId,
        id: localStorage.getItem('selectedPortfolio'),
      }, { headers: { token: localStorage.getItem('token') } });
    } catch (err) {
      console.warn(err);
    }
  },

  async getParticularTokenPrice(_, idToken) {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${idToken}&vs_currencies=usd`).catch(
        (err) => console.warn(err),
      );
      return response.data[`${idToken}`].usd;
    } catch (err) {
      console.warn(err);
      return err;
    }
  },

  async getInitArrayTokens() {
    try {
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false';
      const response = await axios.get(url).catch(
        (err) => console.warn(err),
      );
      const correctSymbol = response.data.map((item) => {
        item.symbol = item.symbol.toUpperCase();
        return item;
      });
      return {
        initArrayTokens: correctSymbol,
        addTransactionConfig: {
          name: response.data[0].name,
          cryptocurrencyId: response.data[0].id || response.data[0].cryptocurrencyId,
          amount: 0,
          type: 'Buy',
          symbol: response.data[0].symbol,
          price: response.data[0].current_price,
          timestamp: new Date().getTime(),
        },
      };
    } catch (err) {
      console.warn(err);
      return err;
    }
  },
  async removePortfolio({ state, commit }, portfolioId) {
    try {
      if (portfolioId === state.selectedPortfolio) {
        commit('setSelectedPortfolio', state.portfolios[0].id);
      }
      if (portfolioId) {
        await Gateway.post('remove-portfolio', {}, {
          headers: { token: localStorage.getItem('token') },
          params: {
            id: portfolioId,
          },
        });
      }
    } catch (err) {
      console.warn(err);
    }
  },
  async removeTransaction(_, obj) {
    try {
      await Gateway.post('remove-transaction', {
        ...obj,
      }, {
        headers: { token: localStorage.getItem('token') },
        params: {
          id: localStorage.getItem('selectedPortfolio'),
        },
      });
    } catch (err) {
      console.warn(err);
    }
  },

  async changePortfolioName(_, { newName, portfolioId }) {
    try {
      if (newName) {
        await Gateway.post('change-portfolio-name', {
          newName,
        }, {
          headers: { token: localStorage.getItem('token') },
          params: {
            id: portfolioId,
          },
        });
      }
    } catch (err) {
      console.warn(err);
    }
  },

  async createPortfolio({ commit }, name) {
    try {
      if (name) {
        const res = await Gateway.post('create-portfolio', {
          name,
        }, { headers: { token: localStorage.getItem('token') } });
        commit('setAccountInfo', res, { root: true });
      }
    } catch (err) {
      console.warn(err);
    }
  },

  async addTokenToPortfolio(_, payload) {
    try {
      await Gateway.post('add-to-portfolio', {
        ...payload,
      }, {
        headers: { token: localStorage.getItem('token') },
        params: {
          id: localStorage.getItem('selectedPortfolio'),
        },
      });
    } catch (err) {
      console.warn(err);
    }
  },
  async getPortfolios({ commit }) {
    try {
      const res = await Gateway.get('get-portfolios', { headers: { token: localStorage.getItem('token') } });
      commit('setPortfolios', res);
    } catch (err) {
      console.warn(err);
    }
  },
  async findPortfolio({
    commit, state, getters, dispatch,
  }) {
    try {
      await dispatch('getPortfolios');
      const res = await Gateway.get('find-portfolio', {
        headers: { token: localStorage.getItem('token') },
        params: {
          id: localStorage.getItem('selectedPortfolio') || state?.portfolios[0]?.id,
        },
      });
      if (!state.selectedPortfolio) {
        commit('setSelectedPortfolio', +localStorage.getItem('selectedPortfolio') || res.id);
      }
      commit('setWBSKData', res.cryptocurrencies);
      commit('setTotalPrice', getters.calculatedTotalPrice);
    } catch (err) {
      console.warn(err);
    }
  },

  async getCharts({ commit }, period = 1) {
    try {
      const res = await Gateway.get('chart-values', {
        headers: { token: localStorage.getItem('token') },
        params: {
          id: localStorage.getItem('selectedPortfolio'),
          period,
        },
      });
      commit('setChartData', { data: res?.historyChart, period });
    } catch (err) {
      console.warn(err);
    }
  },

  disconnectFromWebSocket({ state }) {
    state.connection?.close(1000, 'Close');
  },

  connectToWebSocket({ commit, state }) {
    const connection = new WebSocket(`ws://${api}:5000/`);
    connection.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const { data } = response;
      if (response?.action === 'portfolio') {
        const tokens = data?.cryptocurrencies;
        commit('setWBSKData', tokens);
      }
      if (response?.action === 'chart') {
        commit('setChartData', response);
      }
      if (response?.action === 'search') {
        commit('setSearchData', data);
      }
    };
    connection.onopen = () => {
      connection.send(JSON.stringify({
        method: 'getPortfolio',
        token: localStorage.getItem('token'),
        portfolioId: localStorage.getItem('selectedPortfolio') || 0,
        period: state.activePeriod || 1,
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
