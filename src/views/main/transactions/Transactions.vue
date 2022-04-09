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
    />
  </div>
</template>

<script>
import PriceSection from '@/views/main/portfolio/price-section/PriceSection.vue';
import { useStore } from 'vuex';
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import DetailSection from '@/views/main/transactions/details-section/DetailsSection.vue';
import AssetsSection from '@/views/main/portfolio/assets-section/AssetsSection.vue';

export default {
  components: { AssetsSection, DetailSection, PriceSection },
  setup() {
    const store = useStore();
    const route = useRoute();

    const assetCol = ref(['Type', 'Price', 'Amount', 'Actions']);

    const tokenInfo = computed(() => store.getters['portfolio/getSpecificTokenByName'](route.params.token));

    onBeforeMount(async () => {
      await store.dispatch('portfolio/getPortfolio');
      await store.dispatch('portfolio/getConnectionToWebSocket');
    });
    return {
      tokenInfo,
      assetCol,
    };
  },
};
</script>

<style scoped>

</style>
