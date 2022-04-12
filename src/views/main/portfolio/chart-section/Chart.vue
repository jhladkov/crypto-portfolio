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
      :options="testConfig"
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

    const state = reactive({
      series: [],
      buttonActive: 0,
      lastChanges: 0,
      prevChanges: 0,
      testConfig: chartConfig,
    });

    const config = { ...state.testConfig };

    const getActiveIndex = computed(() => state.activeIndex || 0);
    const setData = (index) => {
      console.log('setD', config);
      state.series[0] = {
        name: 'main',
        data: store.getters['portfolio/chartData'][`historyChart${indexes[index]}`] || [],
      };
    };
    const updateData = (index) => {
      if (activeIndex !== index) {
        state.activeIndex = index;
        state.buttonActive = index;
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

      if (state.lastChanges - state.prevChanges < 0) {
        console.log(state.lastChanges - state.prevChanges);
        config.colors = ['dark'];
        state.testConfig.colors = ['dark'];
      }
      console.log(state.lastChanges, state.prevChanges);

      store.commit('portfolio/setTotalPrice', state.lastChanges); // last changes
      store.commit('portfolio/setTotalProfit', (state.lastChanges - state.prevChanges));
      store.commit('portfolio/setTotalProfitInPercents',
        ((state.lastChanges * 100) / state.prevChanges) - 100);
    };
    watchEffect(() => {
      // config.colors = ['#ea3943'];
      if (state.lastChanges - state.prevChanges < 0) {
        console.log(state.lastChanges - state.prevChanges);
        config.colors = ['#ea3943'];
      }
      console.log('watch');
      console.log(config, state.testConfig);
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
      config,
      getActiveIndex,
      mouseLeave,
      calculateData,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
