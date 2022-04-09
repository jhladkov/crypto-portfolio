<template>
  <section class="assets-section">
    <div
      v-if="!loader"
      class="assets-section__wrapper"
    >
      <div class="assets-title">
        Your Assets
      </div>
      <div class="table-assets">
        <div class="table-assets-head">
          <div
            class="table-assets-head-col"
          >
            Name
          </div>
          <div class="table-assets-head-col">
            Price
          </div>
          <div class="table-assets-head-col">
            24H
          </div>
          <div class="table-assets-head-col">
            Holdings
          </div>
          <div class="table-assets-head-col">
            Avg. Buy Price
          </div>
          <div class="table-assets-head-col">
            Profit/Loss
          </div>
          <div class="table-assets-head-col">
            Actions
          </div>
        </div>
        <div class="table-assets-body">
          <body-col
            v-for="(item, index) in tokensData"
            :key="index"
            class="table-assets-body-col"
            :asset="item"
          />
        </div>
      </div>
    </div>
    <base-loader v-else />
  </section>
</template>

<script>
import BodyCol from '@/components/body-col/BodyCol.vue';
import {
  reactive, onBeforeMount, computed,
} from 'vue';
import { useStore } from 'vuex';
import BaseLoader from '@/components/base-loader/BaseLoader.vue';

export default {
  name: 'AssetsSection',
  components: { BaseLoader, BodyCol },
  setup() {
    const store = useStore();

    const state = reactive({
      WBSKData: store.state.portfolio.WBSKData,
      connection: null,
      loaderActive: false,
    });
    const tokensData = computed(() => store.getters['portfolio/getTokensList']);
    const loader = computed(() => state.loaderActive);

    onBeforeMount(async () => {
      state.loaderActive = true;
      await store.dispatch('portfolio/getPortfolio');
      await store.dispatch('portfolio/getConnectionToWebSocket');
      state.loaderActive = false;
    });
    return {
      ...state,
      tokensData,
      loader,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
