<template>
  <section class="section price-section">
    <div class="price-section__block block">
      <p class="prise-section__pre-title">
        Current Balance
      </p>
      <div class="block__inner">
        <h1 class="price-section__title">
          $3000.12
        </h1>
        <indicator
          class-name="price-section__profit"
          :background="true"
          value="0.04"
        />
      </div>

      <div class="price-section__inner info-block">
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

export default {
  name: 'PriceSection',
  components: { BaseButton, Indicator },
};
</script>

<style src="./styles.scss" lang="scss"/>
