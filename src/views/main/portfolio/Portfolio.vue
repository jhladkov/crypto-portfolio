<template>
  <div class="container">
    <price-section />
    <input
      v-model="value"
      type="text"
    >
    <div
      v-for="(token, key) in searchData"
      :key="key"
    >
      <div>
        <img
          width="20"
          height="20"
          :src="token.image"
        > {{ token.name }} - {{ token.cryptocurrencyId }}
      </div>
    </div>
    <chart />
    <assets-section />
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';
import Chart from '@/views/main/portfolio/chart-section/Chart.vue';
import { useStore } from 'vuex';
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';

export default {
  name: 'Portfolio',
  components: { Chart, PriceSection, AssetsSection },
  setup() {
    const store = useStore();

    const value = ref('');
    const searchData = computed(() => store.getters['portfolio/searchData']);

    watch(value, async (newValue, oldValue) => {
      if (newValue === oldValue) return;
      const con = store.getters['portfolio/connection'];
      con.send(JSON.stringify({ method: 'SearchToken', value: newValue }));
    });

    onBeforeMount(async () => {
      await store.dispatch('portfolio/getConnectionToWebSocket');
    });

    return {
      value,
      searchData,
    };
  },
};
</script>
