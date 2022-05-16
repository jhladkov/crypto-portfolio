<template>
  <div class="container">
    <base-loader v-if="state.loading" />
    <template v-else>
      <button
        class="go-back"
        @click="goHome"
      >
        Back
      </button>
      <price-container
        :data="tokenData"
        :pre-title="preTitle"
        :show-token-info="true"
        modal-type="TransactionModal"
      />
      <detail-section :token-info="tokenInfo" />
      <table-cols
        :asset-cols="state.assetCols"
        class="transactions"
      >
        <transactions-col
          v-for="(list,index) in historyList"
          :key="index"
          :history-list="list"
          @removeTransaction="removeTransaction"
        />
      </table-cols>
    </template>
  </div>
</template>

<script>
import PriceContainer from '@/containers/price-container/PriceContainer.vue';
import { useStore } from 'vuex';
import { computed, onBeforeMount, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailSection from '@/views/main/transactions/details-section/DetailsSection.vue';
import TransactionsCol from '@/components/transactions-col/TransactionsCol.vue';
import BaseLoader from '@/components/base-loader/BaseLoader.vue';
import TableCols from '@/components/table-cols/TableCols.vue';

export default {
  components: {
    TableCols,
    BaseLoader,
    TransactionsCol,
    DetailSection,
    PriceContainer,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      assetCols: ['Type', 'Price', 'Amount', 'Actions'],
      loading: false,
    });
    const tokenInfo = computed(() => store.getters['portfolio/getTokensList'].find((item) => item.name === route.params.token));
    const historyList = computed(() => tokenInfo.value?.historyList?.reverse());
    const tokenData = computed(() => ({
      src: tokenInfo.value?.src,
      price: tokenInfo.value?.hold,
      change: tokenInfo.value?.change,
    }));
    const preTitle = computed(() => (`${tokenInfo?.value?.name}(${tokenInfo?.value?.shortName}) Balance`));

    const goHome = () => {
      router.push({ name: 'Portfolio' });
    };
    const removeTransaction = async (id, cryptocurrencyId) => {
      if (id && cryptocurrencyId) {
        await store.dispatch('portfolio/removeTransaction', {
          id,
          cryptocurrencyId,
        });
      }
      await store.dispatch('portfolio/getPortfolio');
    };

    onBeforeMount(async () => {
      state.loading = true;
      await store.dispatch('portfolio/getPortfolio');
      state.loading = false;
    });
    return {
      state,
      tokenInfo,
      tokenData,
      preTitle,
      historyList,
      goHome,
      removeTransaction,
    };
  },
};
</script>

<style scoped>

</style>
