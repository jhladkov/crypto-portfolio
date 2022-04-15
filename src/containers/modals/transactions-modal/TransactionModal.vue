<template>
  <div class="modal__inner">
    <div class="select">
      <div
        class="select__main-panel main-panel shadow"
        :class="{'active-select':state.selectActive}"
        @click="openSelect"
      >
        <div
          v-if="!state.selectActive"
          class="main-panel__content"
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
          class-name="main-panel__input"
          type="text"
        />
      </div>
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
    </div>
    <div class="modal__info-inner info-inner">
      <div class="info-inner__block block">
        <p class="block__title">
          Quantity
        </p>
        <base-input
          class-name="block__input shadow"
          placeholder="0.00"
        />
      </div>
      <div class="info-inner__block block">
        <p class="block__title">
          Price Per Coin
        </p>
        <div class="block__inner">
          <span>$</span>
          <base-input
            class-name="block__input shadow"
            :value="state.selectedToken.current_price"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from '@/components/base-input/BaseInput.vue';
import {
  computed, reactive, ref, watch, onMounted,
} from 'vue';
import { useStore } from 'vuex';

export default {
  components: { BaseInput },
  setup() {
    const store = useStore();
    const value = ref('');
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false';
    const state = reactive({
      selectActive: false,
      initArrayTokens: [],
      selectedToken: [],
    });

    const selectedValue = computed(() => state.selectedToken);

    const openSelect = () => {
      state.selectActive = true;
    };

    const selectToken = (token) => {
      state.selectedToken = token;
      state.selectActive = false;
    };

    const searchData = computed(() => store.getters['portfolio/searchData']);

    watch(value, async (newValue, oldValue) => {
      console.log(searchData);
      if (newValue === oldValue) return;
      const con = store.getters['portfolio/connection'];
      con.send(JSON.stringify({
        method: 'SearchToken',
        value: newValue,
      }));
    });

    onMounted(() => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          state.initArrayTokens = [...data];
          state.selectedToken = data[0];
        });
    });

    return {
      state,
      searchData,
      value,
      openSelect,
      selectedValue,
      selectToken,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
