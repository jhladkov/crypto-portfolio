<template>
  <section
    class="assets-section"
    :class="className"
  >
    <div
      v-if="!loader"
      class="assets-section__wrapper"
    >
      <div class="assets-title">
        {{ title }} Transactions
      </div>
      <div class="table-assets">
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
    <base-loader v-else />
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
      loaderActive: false,
    });
    const loader = computed(() => state.loaderActive);

    onBeforeMount(async () => {
      state.loaderActive = true;
      await store.dispatch('portfolio/getPortfolio');
      await store.dispatch('portfolio/getConnectionToWebSocket');
      state.loaderActive = false;
    });
    return {
      ...state,
      loader,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
