<template>
  <div>
    <div v-if="!calendarStatus">
      <div class="modal__title">
        Edit Transaction
      </div>
    </div>
    <content-modal
      button-value="Edit Transaction"
      @createTransactions="changeTransactions"
      @CalendarWasActive="calendarWasActive"
    />
  </div>
</template>

<script>
import ContentModal from '@/containers/content-modal/ContentModal.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'EditModal',
  components: { ContentModal },
  setup() {
    const store = useStore();
    const calendarStatus = ref(false);

    const calendarWasActive = (status) => {
      calendarStatus.value = status;
    };

    const changeTransactions = async (data) => {
      if (!data.timestamp) {
        data.timestamp = store.getters['transactions/getChosenTransaction']?.timestamp;
      }
      if (data) {
        await store.dispatch('transactions/changeTransaction', {
          id: store.getters['transactions/getChosenTransaction'].id,
          timestamp: data.timestamp,
          cryptocurrencyId: data.cryptocurrencyId,
          price: data.price,
          amount: data.amount,
        });
        store.commit('transactions/setChosenTransaction', null);
        store.commit('portfolio/setLoading', { value: true, loadingName: 'transactionsLoading' });
        store.commit('portfolio/setLoading', { value: true, loadingName: 'assetSectionLoading' });
        store.commit('portfolio/setLoading', { value: true, loadingName: 'chartLoading' });
        await store.dispatch('portfolio/findPortfolio');
        store.commit('portfolio/setLoading', { value: false, loadingName: 'transactionsLoading' });
        store.commit('portfolio/setLoading', { value: false, loadingName: 'assetSectionLoading' });
        await store.dispatch('portfolio/getCharts');
        store.commit('portfolio/setLoading', { value: false, loadingName: 'chartLoading' });
      }
    };

    return {
      changeTransactions,
      calendarStatus,
      calendarWasActive,
    };
  },
};
</script>

<style scoped>

</style>
