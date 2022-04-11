<template>
  <section class="assets-section">
    <div class="assets-section__wrapper">
      <base-loader v-if="loading" />
      <div
        v-else
      >
        <cols :asset-cols="assetCols">
          <body-col
            v-for="(item, index) in tokensData"
            :key="index"
            class="table-assets-body-col"
            :asset="item"
          />
        </cols>
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
import Cols from '@/components/cols/Cols.vue';

export default {
  name: 'AssetsSection',
  components: {
    Cols,
    BodyCol,
    BaseLoader,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      WBSKData: store.state.portfolio.WBSKData,
      loading: false,
      assetCols: ['Name', 'Price', '24H', 'Holdings', 'Avg. Buy Price', 'Profit/Loss', 'Actions'],
    });
    const tokensData = computed(() => store.getters['portfolio/getTokensList']);
    const loading = computed(() => state.loading);

    onBeforeMount(async () => {
      state.loading = true;
      await store.dispatch('portfolio/getPortfolio');
      state.loading = false;
    });
    return {
      ...state,
      tokensData,
      loading,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
