<template>
  <div class="modal__inner">
    <div class="modal__actions actions">
      <div
        v-for="(action,index) in state.actions"
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
          class-name="main-panel__input select-part"
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
          v-model.number="state.addTransactionConfig.quantity"
          class-name="block__input shadow"
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
            v-model.number="state.addTransactionConfig.price_per_coin"
            class-name="block__input shadow"
            :value="state.addTransactionConfig.price_per_coin"
          />
        </div>
      </div>
    </div>
    <div class="modal__date date">
      <div class="date__time">
        {{ getDate }}
      </div>
      <v-date-picker
        v-model="state.addTransactionConfig.date"
        :max-date="new Date()"
        trim-weeks
        class="calendar"
        mode="dateTime"
        locale="en"
      />
    </div>
    <div class="modal__total-area total-area">
      <p class="total-area__title">
        Total {{ state.addTransactionConfig.type === 'Buy' ? 'Spent' : 'Received' }}
      </p>
      <div class="total-area__spent">
        $ {{ getTotalProfit }}
      </div>
    </div>

    <base-button
      :disabled="state.addTransactionConfig.quantity > 0 ? false : true"
      :class-name="[
        'modal__create-transactions',
        state.addTransactionConfig.quantity > 0 ? null : 'disabled',
      ]"
      value="Add transaction"
      @click="createTransaction"
    />
  </div>
</template>

<script>
import BaseInput from '@/components/base-input/BaseInput.vue';
import {
  computed, reactive, ref, watch, onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import BaseButton from '@/components/base-button/BaseButton.vue';

export default {
  components: {
    BaseButton,
    BaseInput,
  },
  setup() {
    const store = useStore();
    const value = ref('');
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false';
    const state = reactive({
      selectActive: false,
      activeIndex: 0,
      actions: ['Buy', 'Sell'],
      initArrayTokens: [],
      selectedToken: {},
      addTransactionConfig: {
        tokenInfo: {},
        type: 'Buy',
        quantity: 0,
        price_per_coin: 0,
        date: '',
      },
    });
    const getDate = computed(
      () => state.addTransactionConfig.date?.toString()
        ?.split(' ')
        ?.slice(1, 5)
        ?.join(' '),
    );
    const selectedValue = computed(() => state.selectedToken);
    const getTotalProfit = computed(
      () => state.addTransactionConfig.quantity * state.addTransactionConfig.price_per_coin,
    );

    const selectAction = (index) => {
      state.activeIndex = index;
      state.addTransactionConfig.type = state.actions[index];
    };

    const openSelect = () => {
      state.selectActive = true;
    };
    const closeSelect = () => {
      state.selectActive = false;
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

    const selectToken = (token) => {
      state.selectedToken = token;
      state.addTransactionConfig.tokenInfo = token;
      state.addTransactionConfig.price_per_coin = token.current_price || 0;
      closeSelect();
    };

    const searchData = computed(() => store.getters['portfolio/searchData']);

    const createTransaction = () => {
      state.addTransactionConfig.date = state.addTransactionConfig.date.toGMTString()
        .replace('GMT', state.addTransactionConfig.date.toLocaleString('en-US', {
          hour: 'numeric',
          hour12: true,
        })
          .slice(-2));
      console.log(state.addTransactionConfig);
      store.commit('modal/closeModal', 'Transaction');
    };

    watch(value, async (newValue, oldValue) => {
      console.log(searchData);
      if (newValue === oldValue) return;
      const con = store.getters['portfolio/connection'];
      con.send(JSON.stringify({
        method: 'SearchToken',
        value: newValue,
      }));
    });

    onBeforeMount(() => {
      state.addTransactionConfig.date = new Date();
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          state.initArrayTokens = [...data];
          state.selectedToken = data[0];
          state.addTransactionConfig.tokenInfo = data[0];
          state.addTransactionConfig.price_per_coin = data[0].current_price;
        });
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
      getDate,
      createTransaction,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
