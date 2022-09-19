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
          ${{ tokenInfo?.avg || 0 }}
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
          <svg
            class="block__icon"
            viewBox="0 0 16 28"
          >
            <icon-arrow-up />
          </svg>
          {{ replaceData(totalProfit) }}%({{ tokenInfo?.profit > 0 ? '+' : '-' }}
          ${{ replaceData(tokenInfo?.profit) }})
        </p>
      </div>
    </div>
  </section>
</template>

<script>

import { usePercentProfit } from '@/hook/usePercentProfit';
import { computed } from 'vue';
import IconArrowUp from '@/assets/icons/user-space/IconArrowUp.vue';

export default {
  components: { IconArrowUp },
  props: {
    tokenInfo: {
      type: Object,
    },
  },
  setup(props) {
    const totalProfit = computed(() => usePercentProfit(
      props.tokenInfo?.holdTokens, props.tokenInfo?.avg, props.tokenInfo?.profit,
    ));
    const replaceData = computed(
      () => (value) => value.toString().replace('-', ''),
    );

    return {
      totalProfit,
      replaceData,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss"/>
