<template>
  <section class="assets-section">
    <div class="assets-section__wrapper">
      <div class="assets-title">
        {{ title }} Transactions
      </div>
      <base-loader v-if="loading" />
      <div
        v-else
        class="table-assets"
      >
        <div class="table-assets-head">
          <div
            v-for="(colName,index) in assetCol"
            :key="index"
            class="table-assets-head-col"
          >
            {{ colName }}
          </div>
        </div>
        <div class="table-assets-body">
          <slot />
        </div>
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

export default {
  name: 'AssetsSection',
  components: { BaseLoader },
  props: {
    assetCol: Array,
    title: String,
    className: {
      type: String,
      default: null,
    },
  },
  setup() {
    const store = useStore();

    const state = reactive({
      WBSKData: store.state.portfolio.WBSKData,
      connection: null,
      loading: false,
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
