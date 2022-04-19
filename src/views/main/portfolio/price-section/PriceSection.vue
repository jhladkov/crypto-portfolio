<template>
  <price-container
    :data="priceData"
    :modal-type="currentModal"
  />
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import PriceContainer from '@/containers/price-container/PriceContainer.vue';

export default {
  name: 'PriceSection',
  components: { PriceContainer },
  setup() {
    const store = useStore();
    const currentModal = computed(() => store.state.modal.currentModal);
    const priceData = computed(() => ({
      price: store.getters['portfolio/totalPrice'],
      change: store.getters['portfolio/totalProfitInPercents'],
      totalProfit: store.getters['portfolio/totalProfit'],
    }));

    return {
      priceData,
      currentModal,
    };
  },
};
</script>
