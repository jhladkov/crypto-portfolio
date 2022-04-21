<template>
  <section class="assets-section">
    <div class="assets-section__wrapper">
      <base-loader v-if="loading" />
      <div
        v-else
      >
        <div class="assets-title">
          Your Assets
        </div>
        <table-cols :asset-cols="assetCols">
          <body-col
            v-for="(item, index) in tokensData"
            :key="index"
            class="table-assets-body-col"
            :asset="item"
            @click="goToTransactions(item.name)"
          />
        </table-cols>
      </div>
    </div>
  </section>
</template>

<script>
import {
  reactive, onBeforeMount, computed,
} from 'vue';
import { useStore } from 'vuex';
import BaseLoader from '@/components/base-loader/BaseLoader.vue';
import BodyCol from '@/components/body-col/BodyCol.vue';
import TableCols from '@/components/table-cols/TableCols.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AssetsSection',
  components: {
    TableCols,
    BodyCol,
    BaseLoader,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const assetCols = ['Name', 'Price', '24H', 'Holdings', 'Avg. Buy Price', 'Profit/Loss', 'Actions'];

    const state = reactive({
      WBSKData: store.state.portfolio.WBSKData,
      loading: false,
    });
    const tokensData = computed(() => store.getters['portfolio/getTokensList']);
    const loading = computed(() => state.loading);

    const goToTransactions = (path) => {
      router.push({
        name: 'Transactions',
        params: {
          token: path,
        },
      });
    };

    onBeforeMount(async () => {
      state.loading = true;
      await store.dispatch('portfolio/getPortfolio');
      state.loading = false;
    });
    return {
      ...state,
      tokensData,
      loading,
      goToTransactions,
      assetCols,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
