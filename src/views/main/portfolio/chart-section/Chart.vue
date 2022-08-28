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
      v-if="loading"
      v-animation
      class="area__loader"
    >
      <base-loader />
    </div>
    <div
      v-if="noData"
      class="chart__empty no-data"
    >
      <p class="no-data__info">
        There is no data
      </p>
    </div>
    <vue-apex-charts
      ref="chart"
      width="100%"
      height="250px"
      :options="getConfig"
      :series="compSeries"
      type="area"
      @MouseMove="mouseMove"
      @mouseleave="mouseLeave"
    />
  </section>
</template>

<script>
import {
  reactive, ref, onBeforeMount, computed, onBeforeUpdate,
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
    });

    const chart = ref(null);

    const config = reactive(chartConfig);
    const getConfig = computed(() => config);
    const period = computed(() => store.getters['portfolio/getActivePeriod']);
    const loading = computed(() => store.state.portfolio.loadingState.chartLoading);
    const noData = computed(() => {
      if (store.state.portfolio.chartData[store.getters['portfolio/getActivePeriod']]?.length <= 1 && !loading.value) {
        return true;
      }
      return false;
    });

    // TODO: come up with it sth
    const recalculateData = () => {
      const chartDataForDuration = store.getters['portfolio/chartData'][period.value] || [];
      if (chartDataForDuration.length) {
        state.lastChanges = chartDataForDuration[chartDataForDuration?.length - 1][1];
        state.prevChanges = chartDataForDuration[0][1];
        if (state.lastChanges - state.prevChanges < 0) {
          config.colors = ['#ea3943'];
          chart?.value?.updateOptions(config);
        } else {
          config.colors = ['rgb(22, 199, 132)'];
          chart?.value?.updateOptions(config);
        }
      }
    };
    // const setData = () => {
    //   recalculateData();
    //   state.series[0] = {
    //     name: 'main',
    //     data: store.getters['portfolio/chartData'][period.value] || [],
    //   };
    // };
    const compSeries = computed(() => ([{
      name: 'main',
      data: store.getters['portfolio/chartData'][period.value] || [],
    }]));

    const updateData = async (index) => {
      if (activeIndex !== index) {
        store.commit('portfolio/setActivePeriod', indexes[index]);
        if (!store.getters['portfolio/chartData'][period.value]?.length) {
          store.commit('portfolio/setLoading', { value: true, loadingName: 'chartLoading' });
          await store.dispatch('portfolio/getCharts', indexes[index]);
          store.commit('portfolio/setLoading', { value: false, loadingName: 'chartLoading' });
        }
        // setData();
      }
    };

    const mouseLeave = () => {
      store.commit('portfolio/setTotalPrice', store.getters['portfolio/calculatedTotalPrice']);
    };

    const mouseMove = (e, chart, opt) => {
      const data = compSeries.value[0]?.data[opt?.dataPointIndex];
      if (data?.length === 2 && data[1]) {
        store.commit('portfolio/setTotalPrice', compSeries.value[0].data[opt.dataPointIndex][1]);
      }
    };

    onBeforeUpdate(() => {
      recalculateData();
    });
    onBeforeMount(async () => {
      if (!store.getters['portfolio/chartData'][period.value]?.length) {
        store.commit('portfolio/setLoading', { value: true, loadingName: 'chartLoading' });
        await store.dispatch('portfolio/getCharts');
        store.commit('portfolio/setLoading', { value: false, loadingName: 'chartLoading' });
      }
      // setData();
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
      compSeries,
      loading,
      noData,
      // chartSeries,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
