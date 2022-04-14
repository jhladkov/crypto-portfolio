<template>
  <section class="chart">
    <div
      class="chart__inner duration-table"
    >
      <button
        v-for="(value, index) in duration"
        :key="value"
        class="duration-table-block"
        :class="{'active': index === getActiveIndex}"
        @click="updateData(index)"
      >
        {{ value }}
      </button>
    </div>
    <vue-apex-charts
      ref="chart"
      width="100%"
      height="250px"
      :options="testConf"
      :series="series"
      @MouseMove="mouseMove"
      @mouseleave="mouseLeave"
    />
  </section>
</template>

<script>
import {
  reactive, ref, onBeforeMount, computed, watchEffect,
} from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useStore } from 'vuex';
import { chartConfig } from '@/constants';

export default {
  name: 'Chart',
  components: { VueApexCharts },
  setup() {
    const store = useStore();
    const activeIndex = ref(0);
    const indexes = ['24h', '7d', '1m', '3m', '1y'];
    const duration = ['24H', '7D', '30D', '90D', 'ALL'];

    const chart = ref(null);

    const state = reactive({
      series: [],
      lastChanges: 0,
      prevChanges: 0,
      testConf: [],
    });

    const getConfig = computed(() => {
      const config = { ...chartConfig };
      if (state.lastChanges - state.prevChanges < 0) {
        config.colors = ['#ea3943'];
      } else {
        config.colors = ['rgb(22, 199, 132)'];
      }
      console.log('config', config);
      return config;
    });
    const getActiveIndex = computed(() => state.activeIndex || 0);
    const setData = (index) => {
      console.log(chart.value.options.colors);
      state.series[0] = {
        name: 'main',
        data: store.getters['portfolio/chartData'][`historyChart${indexes[index]}`] || [],
      };
    };
    const updateData = (index) => {
      if (activeIndex !== index) {
        state.activeIndex = index;
        setData(index);
      }
    };

    const mouseLeave = () => {
      if (state.series[0]?.data) {
        store.commit('portfolio/setTotalPrice', state.series[0]?.data?.slice(-1)[0]['1']);
      }
    };

    const mouseMove = (e, chart, opt) => {
      const data = state?.series[0]?.data[opt?.dataPointIndex];
      if (data?.length === 2 && data[1]) {
        store.commit('portfolio/setTotalPrice', state.series[0].data[opt.dataPointIndex][1]);
      }
    };

    const calculateData = async () => {
      const chartDataFor24H = await store.getters['portfolio/chartData'].historyChart24h;
      state.lastChanges = chartDataFor24H?.slice(-1)[0]['1'];
      state.prevChanges = chartDataFor24H[0]['1'];

      console.log(state.lastChanges, state.prevChanges);

      store.commit('portfolio/setTotalPrice', state.lastChanges); // last changes
      store.commit('portfolio/setTotalProfit', (state.lastChanges - state.prevChanges));
      store.commit('portfolio/setTotalProfitInPercents',
        ((state.lastChanges * 100) / state.prevChanges) - 100);
    };
    watchEffect(() => {
      // config.colors = ['#ea3943'];
      const test = chartConfig;
      if (state.lastChanges - state.prevChanges < 0) {
        console.log('ifiswork', state.lastChanges, state.prevChanges);
        test.colors = ['#ea3943'];
        chart.value.options.colors = ['red'];
        state.testConf = test;
      }
      console.log('watch');
      // state.testConf = test;
      console.log(test);
      state.testConf = test;
    });

    onBeforeMount(async () => {
      await store.dispatch('portfolio/getCharts');
      await calculateData();
      setData(0);
    });

    return {
      ...state,
      duration,
      mouseMove,
      updateData,
      getActiveIndex,
      getConfig,
      mouseLeave,
      calculateData,
      chart,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
