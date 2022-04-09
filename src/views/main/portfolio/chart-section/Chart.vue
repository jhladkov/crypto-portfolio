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
      :options="chartConfig"
      :series="series"
      @MouseMove="mouseMove"
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
    });

    const getActiveIndex = computed(() => state.activeIndex || 0);

    const setData = (index) => {
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
      chartConfig,
      getActiveIndex,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
