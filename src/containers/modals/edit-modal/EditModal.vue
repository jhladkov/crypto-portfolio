<template>
  <content-modal @createTransactions="changeTransactions" />
</template>

<script>
import ContentModal from '@/containers/content-modal/ContentModal.vue';
import { useStore } from 'vuex';

export default {
  name: 'EditModal',
  components: { ContentModal },
  setup() {
    const store = useStore();

    const changeTransactions = async (data) => {
      data.timestamp = store.getters['transactions/getChosenTransaction']?.timestamp;
      if (data.cryptocurrencyId && data.timestamp) {
        await store.dispatch('transactions/changeTransaction', {
          id: store.getters['transactions/getChosenTransaction'].id,
          timestamp: data.timestamp,
          cryptocurrencyId: data.cryptocurrencyId,
          price: data.price,
          amount: data.amount,
        });
        await store.dispatch('portfolio/getPortfolio');
        await store.dispatch('portfolio/getCharts');
      }
    };

    return {
      changeTransactions,
    };
  },
};
</script>

<style scoped>

</style>
