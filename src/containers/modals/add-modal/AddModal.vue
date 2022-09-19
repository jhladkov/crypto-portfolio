<template>
  <div>
    <div
      class="modal__inner"
    >
      <div v-if="!state.calendarStatus">
        <div class="modal__title">
          Add Transaction
        </div>
        <div class="modal__actions actions">
          <div
            v-for="(action,index) in actions"
            :key="index"
            class="actions__block block"
            :class="{'active': index === state.activeIndex}"
            @click="selectAction(index)"
          >
            <p class="block__value">
              {{ action }}
            </p>
          </div>
        </div>
      </div>
      <content-modal
        button-value="Add Transaction"
        @CalendarWasActive="calendarWasActive"
        @createTransactions="createTransactions"
      />
    </div>
  </div>
</template>

<script>
import {
  reactive, ref,
} from 'vue';
import ContentModal from '@/containers/content-modal/ContentModal.vue';
import { useStore } from 'vuex';

export default {
  name: 'AddModal',
  components: { ContentModal },
  setup() {
    const store = useStore();
    const value = ref('');
    const actions = ['Buy', 'Sell'];
    const state = reactive({
      calendarStatus: false,
      activeIndex: 0,
      type: 'Buy',
    });

    const calendarWasActive = (status) => {
      state.calendarStatus = status;
    };

    const selectAction = (index) => {
      state.type = actions[index];
      state.activeIndex = index;
    };
    const createTransactions = async (data) => {
      if (!data.timestamp) {
        data.timestamp = Date.now();
      }
      if (state.type === 'Sell') {
        data.amount = -data.amount;
      }
      if (data) {
        store.commit('portfolio/setLoading', { value: true, loadingName: 'chartLoading' });
        store.commit('portfolio/setLoading', { value: true, loadingName: 'assetSectionLoading' });
        store.commit('portfolio/setLoading', { value: true, loadingName: 'transactionsLoading' });
        await store.dispatch('portfolio/addTokenToPortfolio', { ...data, type: state.type });
        await store.dispatch('portfolio/findPortfolio');
        store.commit('portfolio/setLoading', { value: false, loadingName: 'transactionsLoading' });
        store.commit('portfolio/setLoading', { value: false, loadingName: 'assetSectionLoading' });
        await store.dispatch('portfolio/getCharts', store.getters['portfolio/getActivePeriod']);
        store.commit('portfolio/setLoading', { value: false, loadingName: 'chartLoading' });
      }
    };

    return {
      state,
      value,
      selectAction,
      actions,
      createTransactions,
      calendarWasActive,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
