<template>
  <div class="portfolio-panel__inner item">
    <div class="item__title">
      {{ name }}
    </div>
    <div class="item__value">
      ≈${{ totalPrice }}
    </div>
    <!--    <div class="item__line" />-->
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'PortfolioItem',
  props: {
    name: String,
    price: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const totalPrice = computed(
      () => props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    );

    return {
      totalPrice,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
