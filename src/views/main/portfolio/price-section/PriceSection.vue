<template>
  <price-container
    :data="priceData"
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
    const priceData = computed(() => ({
      price: store.getters['portfolio/totalPrice'],
      change: 0.04,
    }));

    return {
      priceData,
    };
  },
};
</script>
