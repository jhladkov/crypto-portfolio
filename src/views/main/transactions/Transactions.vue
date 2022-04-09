<template>
  <div class="container">
    <price-section
      :token-info="tokenInfo"
      :pre-title="`${tokenInfo?.name}(${tokenInfo?.shortName}) Balance`"
    />
    <detail-section :token-info="tokenInfo" />
    <assets-section
      :asset-col="assetCol"
      :title="tokenInfo?.name"
      class-name="transaction-col"
    >
      <transactions-col
        v-for="(list,index) in historyList"
        :key="index"
        :history-list="list"
      />
    </assets-section>
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import { useStore } from 'vuex';
import { computed, onBeforeMount, reactive } from 'vue';
import { useRoute } from 'vue-router';
import DetailSection from '@/views/main/transactions/details-section/DetailsSection.vue';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';
import TransactionsCol from '@/components/transactions-col/TransactionsCol.vue';

export default {
  components: {
    TransactionsCol, AssetsSection, DetailSection, PriceSection,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const state = reactive({
      assetCol: ['Type', 'Price', 'Amount', 'Actions'],
    });
    const historyList = computed(() => store.getters['portfolio/getHistoryListByTokenName'](route.params.token));
    const tokenInfo = computed(() => store.getters['portfolio/getSpecificTokenByName'](route.params.token));
    console.log(tokenInfo);

    onBeforeMount(async () => {
      await store.dispatch('portfolio/getPortfolio');
      await store.dispatch('portfolio/getConnectionToWebSocket');
    });
    return {
      ...state,
      tokenInfo,
      historyList,
    };
  },
};
</script>

<style scoped>

</style>
