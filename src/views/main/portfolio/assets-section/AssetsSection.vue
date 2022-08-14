<template>
  <section class="assets-section">
    <div class="assets-section__wrapper">
      <!--      <base-loader v-if="loading" />-->
      <div>
        <div class="assets-title">
          Your Assets
        </div>
        <table-cols :asset-cols="assetCols">
          <body-col
            v-for="(item, index) in tokensData"
            :key="index"
            class="table-assets-body-col"
            :asset="item"
            @click="goToTransactions(item.id)"
            @remove-token="removeToken"
            @goToTransactions="goToTransactions"
            @openModal="openModal"
          />
        </table-cols>
      </div>
      <div
        v-if="loading"
        v-animation
        class="area__loader"
      >
        <base-loader />
      </div>
    </div>
  </section>
</template>

<script>
import {
  reactive, computed,
} from 'vue';
import { useStore } from 'vuex';
import BodyCol from '@/components/body-col/BodyCol.vue';
import TableCols from '@/components/table-cols/TableCols.vue';
import { useRouter } from 'vue-router';
import BaseLoader from '@/components/base-loader/BaseLoader.vue';

export default {
  name: 'AssetsSection',
  components: {
    BaseLoader,
    TableCols,
    BodyCol,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const assetCols = ['Name', 'Price', '24H', 'Holdings', 'Avg. Buy Price', 'Profit/Loss', 'Actions'];

    const state = reactive({
      WBSKData: store.state.portfolio.WBSKData,
    });
    const tokensData = computed(() => store.getters['portfolio/getTokensList'].filter((item) => {
      if (!item.historyList.length) {
        store.dispatch('portfolio/removeToken', item.id);
      }
      return item.historyList.length;
    }));
    const loading = computed(() => store.state.portfolio.loadingState.assetSectionLoading);

    const removeToken = async (cryptocurrencyId) => {
      if (cryptocurrencyId) {
        store.commit('portfolio/setLoading', {
          value: true,
          loadingName: 'assetSectionLoading',
        });
        store.commit('portfolio/setLoading', { value: true, loadingName: 'assetSectionLoading' });
        store.commit('portfolio/setLoading', { value: true, loadingName: 'chartLoading' });
        await store.dispatch('portfolio/removeToken', cryptocurrencyId);
        await store.dispatch('portfolio/getPortfolio');
        store.commit('portfolio/setLoading', { value: false, loadingName: 'assetSectionLoading' });
        await store.dispatch('portfolio/getCharts', store.getters['portfolio/getActivePeriod']);
        store.commit('portfolio/setLoading', { value: false, loadingName: 'chartLoading' });
      }
    };
    const goToTransactions = (path) => {
      router.push({
        name: 'Transactions',
        params: {
          token: path,
        },
      });
    };
    const openModal = (token) => {
      store.commit('portfolio/setActiveToken', token);
      store.commit('modal/openModal', 'TransactionModal');
    };

    // onBeforeMount(async () => {
    //   state.loading = true;
    //   await store.dispatch('portfolio/getPortfolio');
    //   state.loading = false;
    // });
    return {
      ...state,
      tokensData,
      loading,
      goToTransactions,
      assetCols,
      removeToken,
      openModal,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
