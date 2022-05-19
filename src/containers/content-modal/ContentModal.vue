<template>
  <div>
    <div v-if="state.currentModal === 'AddModal'">
      <div class="modal__info-inner info-inner">
        <div class="info-inner__block block">
          <p class="block__title">
            Quantity
          </p>
          <base-input
            v-model.number="state.addTransactionConfig.amount"
            :value="state.addTransactionConfig.amount"
            class="block__input shadow"
            placeholder="0.00"
            min="0"
          />
        </div>
        <div class="info-inner__block block">
          <p class="block__title">
            Price Per Coin
          </p>
          <div class="block__inner">
            <span>$</span>
            <base-input
              v-model.number="state.addTransactionConfig.price"
              class="block__input shadow"
              :value="state.addTransactionConfig.price"
            />
          </div>
        </div>
      </div>
      <div
        class="modal__date date"
        @click="changeModal('CalendarModal')"
      >
        <div class="date__time">
          {{ getCurrentDate }}
        </div>
      </div>
      <div class="modal__total-area total-area">
        <p class="total-area__title">
          Total
        </p>
        <div class="total-area__spent">
          $ {{ getTotalProfit }}
        </div>
      </div>
      <base-button
        :disabled="state.addTransactionConfig.amount <= 0"
        :class="[
          'modal__add',
          state.addTransactionConfig.amount > 0 ? null : 'disabled',
        ]"
        value="Add transaction"
        @click="createTransaction"
      />
    </div>
    <div v-show="state.currentModal === 'CalendarModal'">
      <calendar-modal
        @setTimestamp="setTimestamp"
        @close="changeModal('AddModal')"
      />
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed, reactive, ref, onBeforeMount,
} from 'vue';
import BaseButton from '@/components/base-button/BaseButton.vue';
import BaseInput from '@/components/base-input/BaseInput.vue';
import CalendarModal from '@/containers/modals/calendar-modal/CalendarModal.vue';
import { useRoute } from 'vue-router';

export default {
  name: 'ContentModal',
  components: {
    CalendarModal,
    BaseInput,
    BaseButton,
  },
  setup(_, { emit }) {
    const store = useStore();
    const route = useRoute();
    const value = ref('');
    const actions = ['Buy', 'Sell'];
    const state = reactive({
      currentModal: 'AddModal',
      addTransactionConfig: {
        cryptocurrencyId: route.params.token,
        amount: 0,
        price: 0,
        timestamp: 0,
        name: '',
        symbol: '',
      },
    });
    const tokenInfo = computed(() => store.getters['portfolio/getTokensList'].find((item) => item.id === route.params.token));
    const getCurrentDate = computed(
      () => {
        const date = new Date(
          state.addTransactionConfig.timestamp || store.getters['transactions/getChosenTransaction']?.timestamp,
        );
        return date.toString()
          .substring(0, 24);
      },
    );
    const getTotalProfit = computed(
      () => state.addTransactionConfig.amount * state.addTransactionConfig.price,
    );
    const setTimestamp = (value) => {
      state.addTransactionConfig.timestamp = value;
    };

    const changeModal = (value) => {
      if (value === 'AddModal') {
        emit('CalendarWasActive', false);
      } else {
        emit('CalendarWasActive', true);
      }
      state.currentModal = value;
    };

    const createTransaction = async () => {
      if (typeof state.addTransactionConfig.timestamp !== 'number') {
        state.addTransactionConfig.timestamp = state.addTransactionConfig.timestamp.getTime();
      }
      if (state.addTransactionConfig.type === 'Sell') {
        state.addTransactionConfig.amount = -state.addTransactionConfig.amount;
      }
      state.addTransactionConfig.name = tokenInfo.value.name;
      state.addTransactionConfig.symbol = tokenInfo.value.shortName;

      emit('createTransactions', state.addTransactionConfig);
      store.commit('modal/closeModal', store.getters['modal/getOpenedModal'][0]);
    };

    onBeforeMount(async () => {
      if (!store.state.transactions?.chosenTransaction?.timestamp) {
        state.addTransactionConfig.timestamp = new Date().getTime();
      }
      state.addTransactionConfig.price = await store.dispatch('portfolio/getParticularTokenPrice', route.params.token);
      if (store.state.transactions?.chosenTransaction?.amount) {
        state.addTransactionConfig.amount = store.state.transactions?.chosenTransaction?.amount;
      }
    });

    return {
      state,
      value,
      getTotalProfit,
      getCurrentDate,
      createTransaction,
      actions,
      changeModal,
      setTimestamp,
    };
  },
};
</script>

<style scoped>

</style>
