<template>
  <section class="details">
    <div class="details__inner">
      <div class="details__block block">
        <p class="block__title">
          Quantity
        </p>
        <p class="block__value">
          {{ tokenInfo?.holdTokens }} {{ tokenInfo?.shortName }}
        </p>
      </div>
      <div class="details__block block">
        <p class="block__title">
          Avg. buy price
        </p>
        <p class="block__value">
          ${{ tokenInfo?.avg }}
        </p>
      </div>
      <div class="details__block block">
        <p class="block__title">
          Total profit / loss
        </p>
        <p
          class="block__value"
          :class="[totalProfit > 0 ? 'increase' : 'decrease']"
        >
          {{ totalProfit }}%(${{ tokenInfo?.profit }})
        </p>
      </div>
    </div>
  </section>
</template>

<script>

import { usePercentProfit } from '@/hook/usePercentProfit';
import { computed } from 'vue';

export default {
  props: {
    tokenInfo: {
      type: Object,
    },
  },
  setup(props) {
    const totalProfit = computed(() => usePercentProfit(
      props.tokenInfo?.holdTokens, props.tokenInfo?.avg, props.tokenInfo?.profit,
    ));

    return {
      totalProfit,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
