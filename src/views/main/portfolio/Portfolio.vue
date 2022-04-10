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
    <assets-section
      :asset-col="assetCol"
      title="Your Assets"
    >
      <body-col
        v-for="(item, index) in tokensData"
        :key="index"
        class="table-assets-body-col"
        :asset="item"
      />
    </assets-section>
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
import BodyCol from '@/components/body-col/BodyCol.vue';

export default {
  name: 'Portfolio',
  components: {
    BodyCol, Chart, PriceSection, AssetsSection,
  },
  setup() {
    const store = useStore();

    const assetCol = ref(['Name', 'Price', '24H', 'Holdings', 'Avg. Buy Price', 'Profit/Loss', 'Actions']);
    const value = ref('');
    const searchData = computed(() => store.getters['portfolio/searchData']);
    const tokensData = computed(() => store.getters['portfolio/getTokensList']);

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
      assetCol,
      tokensData,
    };
  },
};
</script>
