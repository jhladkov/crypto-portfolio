<template>
  <div class="container">
    <portfolio-panel />
    <price-section />
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
    <modal
      v-if="getModal"
      type-modal="TransactionModal"
    >
      <transaction-modal />
    </modal>
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';
import Chart from '@/views/main/portfolio/chart-section/Chart.vue';
import { useStore } from 'vuex';
import {
  computed, ref, watch,
} from 'vue';
import BodyCol from '@/components/body-col/BodyCol.vue';
import Modal from '@/components/modal/Modal.vue';
import TransactionModal from '@/containers/modals/transaction-modal/TransactionModal.vue';
import PortfolioPanel from '@/views/main/portfolio/portfolioPanel-section/PortfolioPanel.vue';

export default {
  name: 'Portfolio',
  components: {
    PortfolioPanel,
    TransactionModal,
    BodyCol,
    Chart,
    PriceSection,
    AssetsSection,
    Modal,
  },
  setup() {
    const store = useStore();

    const assetCol = ref(['Name', 'Price', '24H', 'Holdings', 'Avg. Buy Price', 'Profit/Loss', 'Actions']);
    const value = ref('');
    const searchData = computed(() => store.getters['portfolio/searchData']);
    const tokensData = computed(() => store.getters['portfolio/getTokensList']);
    const getModal = computed(() => store.getters['modal/getModal']('TransactionModal'));

    watch(value, async (newValue, oldValue) => {
      if (newValue === oldValue) return;
      const con = store.getters['portfolio/connection'];
      con.send(JSON.stringify({ method: 'SearchToken', value: newValue }));
    });

    return {
      value,
      searchData,
      assetCol,
      tokensData,
      getModal,
    };
  },
};
</script>
