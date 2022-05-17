<template>
  <section class="price-container">
    <div class="price-container__block block">
      <p class="price-container__pre-title">
        {{ preTitle }}
      </p>
      <div class="block__inner">
        <div
          v-if="showTokenInfo"
          class="price-container__token-img"
        >
          <img
            :src="data.src"
            alt="token-icon"
          >
        </div>
        <h1 class="price-container__title">
          {{ data.price }}
        </h1>
        <indicator
          :class="
            `price-section__profit ${+data.change > 0 ? 'increase' : 'decrease'}`
          "
          :background="true"
          :value="replaceData(+data.change)"
        >
          <svg
            class="price-section__profit-icon"
            viewBox="0 0 16 28"
          >
            <icon-arrow-up />
          </svg>
        </indicator>
      </div>

      <div
        v-if="!showTokenInfo"
        class="price-container__inner info-block"
      >
        <p
          class="info-block__value"
          :class="data.totalProfit > 0 ? 'increase' : 'decrease'"
        >
          {{ data.totalProfit > 0 ? '+' : '-' }} {{ replaceData(data.totalProfit) }}
        </p>
        <div class="info-block__duration">
          24h
        </div>
      </div>
    </div>
    <div class="price-section__block">
      <base-button
        value="Add New"
        class="price-section__add-crypto"
        @click="openModal"
      >
        <svg
          class="button__icon"
          viewBox="0 0 20 20"
        >
          <icon-add />
        </svg>
      </base-button>
    </div>
  </section>
</template>

<script>
import Indicator from '@/components/indicator/Indicator.vue';
import BaseButton from '@/components/base-button/BaseButton.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import IconAdd from '@/assets/icons/user-space/IconAdd.vue';
import IconArrowUp from '@/assets/icons/user-space/IconArrowUp.vue';

export default {
  name: 'PriceContainer',
  components: {
    IconArrowUp,
    IconAdd,
    BaseButton,
    Indicator,
  },
  props: {
    modalType: {
      type: String,
    },
    preTitle: {
      type: String,
      default: 'Current Balance',
    },
    showTokenInfo: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const replaceData = computed(
      () => (value) => value.toString().replace('-', ''),
    );

    const openModal = () => {
      store.commit('modal/openModal', props.modalType);
    };

    return {
      openModal,
      replaceData,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
