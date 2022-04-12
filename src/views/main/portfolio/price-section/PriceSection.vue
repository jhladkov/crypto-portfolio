<template>
  <section class="section price-section">
    <div class="price-section__block block">
      <p class="prise-section__pre-title">
        Current Balance
      </p>
      <div class="block__inner">
        <h1 class="price-section__title">
          {{ getTotalPrice }}
        </h1>
        <indicator
          :class-name="
            `price-section__profit ${getTotalProfitInPercents > 0 ? 'increase' : 'decrease'}`
          "
          :background="true"
          :value="getTotalProfitInPercents"
        />
      </div>

      <div class="price-section__inner info-block">
        <p
          class="info-block__value"
          :class="getTotalProfit > 0 ? 'increase' : 'decrease'"
        >
          + {{ getTotalProfit }}
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
  setup() {
    const store = useStore();
    const getTotalPrice = computed(() => store.getters['portfolio/totalPrice']);
    const getTotalProfit = computed(() => store.getters['portfolio/totalProfit']);
    const getTotalProfitInPercents = computed(() => store.getters['portfolio/totalProfitInPercents']);

    return {
      getTotalPrice,
      getTotalProfitInPercents,
      getTotalProfit,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
