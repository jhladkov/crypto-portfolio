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
      :options="getConfig"
      :series="series"
      type="area"
      @MouseMove="mouseMove"
      @mouseleave="mouseLeave"
    />
  </section>
</template>

<script>
import {
  reactive, ref, onBeforeMount, computed,
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
      lastChanges: 0,
      prevChanges: 0,
    });

    const chart = ref(null);

    const config = reactive(chartConfig);
    const getConfig = computed(() => config);

    const recalculateData = (duration) => {
      const chartDataForDuration = store.getters['portfolio/chartData'][`historyChart${indexes[duration]}`] || [];
      state.lastChanges = chartDataForDuration[chartDataForDuration.length - 1][1];
      state.prevChanges = chartDataForDuration[0][1];
      if (state.lastChanges - state.prevChanges < 0) {
        config.colors = ['#ea3943'];
        chart?.value.updateOptions(config);
      } else {
        config.colors = ['rgb(22, 199, 132)'];
        chart?.value.updateOptions(config);
      }
    };

    const getActiveIndex = computed(() => state.activeIndex || 0);
    const setData = (index) => {
      recalculateData(index);
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
      store.commit('portfolio/setTotalPrice', store.getters['portfolio/calculatedTotalPrice']);
    };

    const mouseMove = (e, chart, opt) => {
      const data = state?.series[0]?.data[opt?.dataPointIndex];
      if (data?.length === 2 && data[1]) {
        store.commit('portfolio/setTotalPrice', state.series[0].data[opt.dataPointIndex][1]);
      }
    };

    onBeforeMount(async () => {
      await store.dispatch('portfolio/getCharts');
      setData(0);
    });

    return {
      ...state,
      duration,
      mouseMove,
      updateData,
      getActiveIndex,
      mouseLeave,
      getConfig,
      chart,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
