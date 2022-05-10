<template>
  <section class="chart">
    <div
      class="chart__inner duration-table"
    >
      <button
        v-for="(value, index) in duration"
        :key="value"
        class="duration-table-block"
        :class="{'active': index === indexes.findIndex((a) => a === period)}"
        @click="updateData(index)"
      >
        {{ value }}
      </button>
    </div>
    <div
      v-if="state.loading"
      class="chart__loader"
    >
      <base-loader />
    </div>
    <vue-apex-charts
      ref="chart"
      width="100%"
      height="250px"
      :options="getConfig"
      :series="state.series"
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
import BaseLoader from '@/components/base-loader/BaseLoader.vue';

export default {
  name: 'Chart',
  components: {
    BaseLoader,
    VueApexCharts,
  },
  setup() {
    const store = useStore();
    const activeIndex = ref(0);
    const indexes = [1, 7, 30, 90, 'max'];
    const duration = ['24H', '7D', '30D', '90D', 'ALL'];

    const state = reactive({
      series: [],
      lastChanges: 0,
      prevChanges: 0,
      loading: false,
    });

    const chart = ref(null);

    const config = reactive(chartConfig);
    const getConfig = computed(() => config);
    const period = computed(() => store.getters['portfolio/getActivePeriod']);

    const recalculateData = () => {
      const chartDataForDuration = store.getters['portfolio/chartData'][period.value] || [];
      state.lastChanges = chartDataForDuration[chartDataForDuration.length - 1][1];
      state.prevChanges = chartDataForDuration[0][1];
      if (state.lastChanges - state.prevChanges < 0) {
        config.colors = ['#ea3943'];
        chart?.value?.updateOptions(config);
      } else {
        config.colors = ['rgb(22, 199, 132)'];
        chart?.value?.updateOptions(config);
      }
    };
    const setData = () => {
      recalculateData();
      state.series[0] = {
        name: 'main',
        data: store.getters['portfolio/chartData'][period.value] || [],
      };
    };

    const chartSeries = computed(() => {
      state.series[0].data = store.getters['portfolio/chartData'][period.value];
      chart.value.updateSeries(state.series);
      recalculateData();
      return store.getters['portfolio/chartData'][period.value];
    });

    const updateData = async (index) => {
      if (activeIndex !== index) {
        store.commit('portfolio/setActivePeriod', indexes[index]);
        if (!store.getters['portfolio/chartData'][period.value]?.length) {
          state.loading = true;
          await store.dispatch('portfolio/getCharts', indexes[index]);
          state.loading = false;
        }
        setData();
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
      setData();
    });

    return {
      state,
      duration,
      mouseMove,
      updateData,
      period,
      indexes,
      mouseLeave,
      getConfig,
      chart,
      chartSeries,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
