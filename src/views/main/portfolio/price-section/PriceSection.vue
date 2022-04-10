<template>
  <section class="section price-section">
    <div class="price-section__block block">
      <p class="prise-section__pre-title">
        {{ preTitle }}
      </p>
      <div class="block__inner">
        <div
          v-if="tokenInfo"
          class="price-section__token-img"
        >
          <img
            :src="tokenInfo.src"
            alt=""
          >
        </div>
        <h1 class="price-section__title">
          {{ tokenInfo ? `$${priceToken}`: getTotalPrice }}
        </h1>
        <indicator
          class-name="price-section__profit"
          :background="tokenInfo?.change < 0 ? 'down' : 'up'"
          :value="tokenInfo ? tokenInfo.change : '0,04'"
        />
      </div>

      <div
        v-if="!tokenInfo"
        class="price-section__inner info-block"
      >
        <p class="info-block__value">
          + $25.72
        </p>
        <div class="info-block__duration">
          24h
        </div>
      </div>
    </div>
    <div class="price-section__block">
      <base-button
        value="Add New"
        class-name="price-section__add-crypto"
      />
    </div>
  </section>
</template>

<script>
import Indicator from '@/components/indicator/Indicator.vue';
import BaseButton from '@/components/base-button/BaseButton.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'PriceSection',
  components: { BaseButton, Indicator },
  props: {
    preTitle: {
      type: String,
      default: 'Current Balance',
    },
    tokenInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const getTotalPrice = computed(() => store.getters['portfolio/totalPrice']);
    const priceToken = computed(() => props.tokenInfo?.hold);

    return {
      getTotalPrice,
      priceToken,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
