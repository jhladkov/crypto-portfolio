<template>
  <section class="chart">
    <div
      class="chart__inner duration-table"
    >
      <button
        v-for="(value, index) in duration"
        :key="value"
        class="duration-table-block"
        :class="{'active': index === activeIndex}"
        @click="updateData(index)"
      >
        {{ value }}
      </button>
    </div>
    <apexchart
      ref="chart"
      width="100%"
      height="250px"
      type="line"
      :options="chartOptions"
      :series="chartOptions.series"
    />
  </section>
</template>

<script>
import {
  reactive, ref, onBeforeMount, computed,
} from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Chart',
  setup() {
    const store = useStore();
    const activeButton = ref(0);
    const chart = ref(null);

    const state = reactive({
      allValues: [],
      duration: ['24H', '7D', '30D', '90D', 'ALL'],
      chartOptions: {
        series: [],
        chart: {
          id: 'area-datetime',
          type: 'area',
          animations: {
            initialAnimation: {
              enabled: true,
            },
          },
          height: 350,
          zoom: {
            enabled: false,
          },
        },
        xaxis: {
          type: 'datetime',
          position: 'bottom',
          axisTicks: {
            show: true,
          },
        },
        colors: ['rgb(22, 199, 132)'],
        stroke: {
          width: 2,
        },
        theme: {
          palette: 'palette10',
        },
      },
    });
    const activeIndex = computed(() => state.activeButton || 0);

    const updateData = (index) => {
      const indexes = [
        '24h', '7d', '1m', '3m', '1y',
      ];
      if (activeButton !== index) {
        state.activeButton = index;
        state.chartOptions.series[0] = {
          name: 'main',
          data: store.getters['portfolio/chartData'][`historyChart${indexes[index]}`] || [],
        };
      }
    };
    onBeforeMount(() => {
      // get call
    });

    return {
      ...state,
      updateData,
      activeButton,
      chart,
      activeIndex,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
