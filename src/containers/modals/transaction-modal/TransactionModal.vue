<template>
  <div>
    <div
      v-show="state.currentModal === 'TransactionModal'"
      class="modal__inner"
    >
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
      <div
        class="select select-part"
        @click="handlerClose"
      >
        <div
          class="select__main-panel main-panel select-part shadow"
          :class="{'active-select':state.selectActive}"
          @click="openSelect"
        >
          <div
            v-if="!state.selectActive"
            class="main-panel__content select-part"
          >
            <div class="panel-crypto__img">
              <img
                width="20"
                height="20"
                :src="selectedValue.image"
              >
            </div>
            <div class="panel-crypto__info info-token">
              <p class="info-token__name">
                {{ selectedValue.name }}
              </p>
              <p class="info-token__symbol">
                {{ selectedValue.symbol }}
              </p>
            </div>
          </div>
          <base-input
            v-else
            v-model="value"
            v-focus
            class="main-panel__input select-part"
            type="text"
          />
        </div>
        <Transition>
          <div
            v-if="state.selectActive"
            class="select__panel panel-crypto"
          >
            <div
              v-for="(token, key) in value ? searchData : state.initArrayTokens"
              :key="key"
              class="panel-crypto__wrapper"
              @click="selectToken(token)"
            >
              <div class="panel-crypto__img">
                <img
                  width="20"
                  height="20"
                  :src="token.image"
                >
              </div>
              <div class="panel-crypto__info info-token">
                <p class="info-token__name">
                  {{ token.name }}
                </p>
                <p class="info-token__symbol">
                  {{ token.symbol }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <div class="modal__info-inner info-inner">
        <div class="info-inner__block block">
          <p class="block__title">
            Quantity
          </p>
          <base-input
            v-model.number="state.addTransactionConfig.amount"
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
        @close="changeModal('TransactionModal')"
      />
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/base-input/BaseInput.vue';
import {
  computed, reactive, ref, watch, onBeforeMount, onUnmounted,
} from 'vue';
import { useStore } from 'vuex';
import BaseButton from '@/components/base-button/BaseButton.vue';
import CalendarModal from '@/containers/modals/calendar-modal/CalendarModal.vue';

export default {
  name: 'TransactionModal',
  components: {
    CalendarModal,
    BaseButton,
    BaseInput,
  },
  setup() {
    const store = useStore();
    const value = ref('');
    const actions = ['Buy', 'Sell'];
    const state = reactive({
      currentModal: 'TransactionModal',
      selectActive: false,
      activeIndex: 0,
      initArrayTokens: [],
      selectedToken: {},
      addTransactionConfig: {
        cryptocurrencyId: '',
        amount: 0,
        price: 0,
        name: '',
        symbol: '',
        timestamp: 0,
        type: 'Buy',
      },
    });
    const getCurrentDate = computed(
      () => {
        const date = new Date(store.state.modal.timestamp || state.addTransactionConfig.timestamp);
        return date.toString().substring(0, 24);
      },
    );
    const selectedValue = computed(() => state.selectedToken);
    const getTotalProfit = computed(
      () => state.addTransactionConfig.amount * state.addTransactionConfig.price,
    );
    const searchData = computed(() => store.getters['portfolio/searchData']);

    const selectAction = (index) => {
      state.addTransactionConfig.type = actions[index];
      state.activeIndex = index;
    };

    const openSelect = () => {
      state.selectActive = true;
    };
    const closeSelect = () => {
      state.selectActive = false;
    };
    const setTimestamp = (value) => {
      state.addTransactionConfig.timestamp = value;
    };

    const changeModal = (value) => {
      state.currentModal = value;
    };
    const compareClickElement = (event) => {
      if (!event.target.classList.contains('select-part')) {
        state.selectActive = false;
        document.removeEventListener('click', compareClickElement);
      }
    };

    const handlerClose = () => {
      if (state.selectActive) {
        document.addEventListener('click', compareClickElement);
      }
    };

    const selectToken = async (token) => {
      state.selectedToken = token;
      state.addTransactionConfig.name = token.name;
      state.addTransactionConfig.cryptocurrencyId = token.id || token.cryptocurrencyId;
      state.addTransactionConfig.symbol = token.symbol || token.shortName;
      if (token.current_price) {
        state.addTransactionConfig.price = token.current_price || 0;
      } else {
        const res = await store.dispatch(
          'portfolio/getParticularTokenPrice', token.cryptocurrencyId || token.id,
        );
        if (res) state.addTransactionConfig.price = res;
      }
      closeSelect();
    };

    const createTransaction = async () => {
      if (typeof state.addTransactionConfig.timestamp !== 'number') {
        state.addTransactionConfig.timestamp = state.addTransactionConfig.timestamp.getTime();
      }
      if (state.addTransactionConfig.type === 'Sell') {
        state.addTransactionConfig.amount = -state.addTransactionConfig.amount;
      }
      store.commit('modal/closeModal', 'TransactionModal');
      await store.dispatch('portfolio/addTokenToPortfolio', { ...state.addTransactionConfig });
      await store.dispatch('portfolio/getPortfolio');
      await store.dispatch('portfolio/getCharts');
    };

    watch(value, async (newValue, oldValue) => {
      if (newValue === oldValue) return;
      const con = store.getters['portfolio/connection'];
      con.send(JSON.stringify({
        method: 'SearchToken',
        value: newValue,
      }));
    });
    onUnmounted(() => {
      store.commit('portfolio/resetActiveToken');
    });

    onBeforeMount(async () => {
      if (store.getters['portfolio/getActiveToken']) {
        state.addTransactionConfig.timestamp = new Date().getTime();
        selectToken(store.getters['portfolio/getActiveToken']);
      } else {
        try {
          const { addTransactionConfig, initArrayTokens } = await store.dispatch('portfolio/getInitArrayTokens');
          state.initArrayTokens = initArrayTokens;
          state.selectedToken = initArrayTokens[0];
          state.addTransactionConfig = addTransactionConfig;
        } catch (err) {
          console.warn(err);
        }
      }
    });

    return {
      state,
      searchData,
      value,
      openSelect,
      selectedValue,
      selectToken,
      closeSelect,
      handlerClose,
      selectAction,
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

<style src="./styles.scss" lang="scss"/>
