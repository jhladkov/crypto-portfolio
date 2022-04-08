<template>
  <section class="assets-section">
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
  </section>
</template>

<script>
import BodyCol from '@/components/body-col/BodyCol.vue';
import { onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AssetsSection',
  components: { BodyCol },
  setup() {
    const store = useStore();

    const tokensData = computed(() => store.getters['portfolio/getTokensList']);

    onBeforeMount(async () => {
      await store.dispatch('portfolio/getPortfolio');
    });
    return {
      tokensData,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
