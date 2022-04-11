<template>
  <div class="container">
    <button
      class="go-back"
      @click="goHome"
    >
      Back
    </button>
    <price-section
      :token-info="tokenInfo"
      :pre-title="`${tokenInfo?.name}(${tokenInfo?.shortName}) Balance`"
    />
    <detail-section :token-info="tokenInfo" />
    <cols
      :asset-cols="assetCols"
      class-name="transactions"
    >
      <transactions-col
        v-for="(list,index) in historyList"
        :key="index"
        :history-list="list"
      />
    </cols>
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import { useStore } from 'vuex';
import { computed, onBeforeMount, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailSection from '@/views/main/transactions/details-section/DetailsSection.vue';
import TransactionsCol from '@/components/transactions-col/TransactionsCol.vue';
import Cols from '@/components/cols/Cols.vue';

export default {
  components: {
    Cols,
    TransactionsCol,
    DetailSection,
    PriceSection,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      assetCols: ['Type', 'Price', 'Amount', 'Actions'],
    });
    const historyList = computed(() => store.getters['portfolio/getHistoryListByTokenName'](route.params.token));
    const tokenInfo = computed(() => store.getters['portfolio/getSpecificTokenByName'](route.params.token));

    const goHome = () => {
      router.push('/');
    };

    onBeforeMount(async () => {
      await store.dispatch('portfolio/getPortfolio');
      await store.dispatch('portfolio/getConnectionToWebSocket');
    });
    return {
      ...state,
      tokenInfo,
      historyList,
      goHome,
    };
  },
};
</script>

<style scoped>

</style>
